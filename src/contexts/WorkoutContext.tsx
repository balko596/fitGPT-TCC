import React, { createContext, useContext, useState, useEffect } from 'react';
import { Workout } from '../types/Workout';
import { fetchWorkouts, generateCustomWorkout, fetchUserFavorites, toggleFavorite } from '../services/workoutService';
import { useAuth } from './AuthContext';

interface WorkoutContextProps {
  workouts: Workout[];
  favorites: string[];
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  getWorkout: (id: string) => Workout | undefined;
  setFavorite: (id: string) => Promise<void>;
  generateWorkout: (preferences: any) => Promise<Workout>;
  refreshWorkouts: () => Promise<void>;
  clearAllWorkoutData: () => void;
}

const WorkoutContext = createContext<WorkoutContextProps>({
  workouts: [],
  favorites: [],
  isLoading: true,
  isGenerating: false,
  error: null,
  getWorkout: () => undefined,
  setFavorite: async () => {},
  generateWorkout: async () => ({} as Workout),
  refreshWorkouts: async () => {},
  clearAllWorkoutData: () => {},
});

export const useWorkoutContext = () => useContext(WorkoutContext);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  const loadWorkouts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('WorkoutContext: Carregando treinos...');
      
      const workoutData = await fetchWorkouts();
      console.log('WorkoutContext: Treinos carregados:', workoutData.length);
      
      setWorkouts(workoutData);
    } catch (error) {
      console.error('WorkoutContext: Erro ao carregar treinos:', error);
      setError('Erro ao carregar treinos. Usando dados offline.');
      
      // Em caso de erro, tentar carregar dados mock diretamente
      try {
        const mockWorkouts = await fetchWorkouts();
        setWorkouts(mockWorkouts);
        console.log('WorkoutContext: Dados offline carregados como fallback');
      } catch (fallbackError) {
        console.error('WorkoutContext: Erro crítico:', fallbackError);
        setWorkouts([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      console.log('WorkoutContext: Carregando favoritos...');
      const favoritesData = await fetchUserFavorites();
      console.log('WorkoutContext: Favoritos carregados:', favoritesData.length);
      setFavorites(favoritesData);
    } catch (error) {
      console.error('WorkoutContext: Erro ao carregar favoritos:', error);
      setFavorites([]);
    }
  };

  const clearAllWorkoutData = () => {
    console.log('WorkoutContext: Limpando todos os dados de treino...');
    setWorkouts([]);
    setFavorites([]);
    setError(null);
    
    // Limpar dados locais relacionados a treinos
    localStorage.removeItem('workoutFavorites');
    localStorage.removeItem('workoutHistory');
    localStorage.removeItem('workoutSchedule');
    localStorage.removeItem('userProgressStats');
    
    console.log('WorkoutContext: Dados de treino limpos');
  };

  useEffect(() => {
    console.log('WorkoutContext: Inicializando...');
    loadWorkouts();
  }, []);

  useEffect(() => {
    console.log('WorkoutContext: Status de autenticação mudou:', isAuthenticated);
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);
  
  const getWorkout = (id: string) => {
    const workout = workouts.find(workout => workout.id === id);
    console.log('WorkoutContext: Buscando treino:', id, 'Encontrado:', !!workout);
    return workout;
  };
  
  const handleToggleFavorite = async (id: string) => {
    try {
      console.log('WorkoutContext: Alternando favorito:', id);
      const isFavorite = await toggleFavorite(id);
      
      if (isFavorite) {
        setFavorites(prev => [...prev, id]);
      } else {
        setFavorites(prev => prev.filter(favId => favId !== id));
      }
      
      console.log('WorkoutContext: Favorito alternado com sucesso');
    } catch (error) {
      console.error('WorkoutContext: Erro ao alterar favorito:', error);
    }
  };
  
  const handleGenerateWorkout = async (preferences: any): Promise<Workout> => {
    console.log('WorkoutContext: Iniciando geração de treino personalizado:', preferences);
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const newWorkout = await generateCustomWorkout(preferences);
      console.log('WorkoutContext: Treino gerado com sucesso:', newWorkout.name);
      
      // Adicionar o novo treino ao início da lista
      setWorkouts(prev => [newWorkout, ...prev]);
      
      return newWorkout;
    } catch (error) {
      console.error('WorkoutContext: Erro ao gerar treino:', error);

      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar treino personalizado. Tente novamente.';
      setError(errorMessage);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const refreshWorkouts = async () => {
    console.log('WorkoutContext: Atualizando lista de treinos...');
    await loadWorkouts();
  };
  
  return (
    <WorkoutContext.Provider 
      value={{ 
        workouts, 
        favorites, 
        isLoading,
        isGenerating,
        error,
        getWorkout, 
        setFavorite: handleToggleFavorite,
        generateWorkout: handleGenerateWorkout,
        refreshWorkouts,
        clearAllWorkoutData,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};