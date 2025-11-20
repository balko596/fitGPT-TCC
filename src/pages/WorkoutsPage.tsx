import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import WorkoutCard from '../components/WorkoutCard';
import FilterPanel from '../components/FilterPanel';
import { Workout } from '../types/Workout';
import { fetchWorkouts } from '../services/workoutService';
import { Clock, Filter, Loader, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWorkoutContext } from '../contexts/WorkoutContext';

const WorkoutsPage: React.FC = () => {
  const { workouts, isLoading, setFavorite, favorites } = useWorkoutContext();
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    difficulty: [] as string[],
    duration: '',
    equipment: [] as string[],
    muscleGroups: [] as string[]
  });

  useEffect(() => {
    setFilteredWorkouts(workouts);
  }, [workouts]);

  const applyFiltersAndSearch = (newFilters?: any, newSearchQuery?: string) => {
    const filtersToUse = newFilters || activeFilters;
    const queryToUse = newSearchQuery !== undefined ? newSearchQuery : searchQuery;
    
    let filtered = [...workouts];
    
    // Aplicar busca por texto
    if (queryToUse.trim()) {
      filtered = filtered.filter(workout => 
        workout.name.toLowerCase().includes(queryToUse.toLowerCase()) ||
        workout.muscleGroups.some(group => group.toLowerCase().includes(queryToUse.toLowerCase())) ||
        workout.exercises.some(exercise => exercise.name.toLowerCase().includes(queryToUse.toLowerCase())) ||
        workout.difficulty.toLowerCase().includes(queryToUse.toLowerCase())
      );
    }
    
    // Aplicar filtros de dificuldade
    if (filtersToUse.difficulty.length > 0) {
      filtered = filtered.filter(workout => 
        filtersToUse.difficulty.includes(workout.difficulty)
      );
    }
    
    // Aplicar filtros de grupos musculares
    if (filtersToUse.muscleGroups.length > 0) {
      filtered = filtered.filter(workout => 
        workout.muscleGroups.some(group => filtersToUse.muscleGroups.includes(group))
      );
    }
    
    // Aplicar filtros de equipamentos
    if (filtersToUse.equipment.length > 0) {
      filtered = filtered.filter(workout => {
        // Se "Nenhum" está selecionado, mostrar treinos sem equipamento ou com array vazio
        if (filtersToUse.equipment.includes('Nenhum')) {
          return workout.equipment.length === 0 || 
                 workout.equipment.includes('Nenhum') ||
                 workout.equipment.includes('Peso corporal');
        }
        // Caso contrário, verificar se algum equipamento do treino está nos filtros
        return workout.equipment.some(item => filtersToUse.equipment.includes(item));
      });
    }
    
    // Aplicar filtro de duração
    if (filtersToUse.duration) {
      filtered = filtered.filter(workout => {
        const duration = workout.durationMinutes;
        switch (filtersToUse.duration) {
          case 'short':
            return duration <= 30;
          case 'medium':
            return duration > 30 && duration <= 60;
          case 'long':
            return duration > 60;
          default:
            return true;
        }
      });
    }
    
    setFilteredWorkouts(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFiltersAndSearch(undefined, query);
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    applyFiltersAndSearch(filters, undefined);
  };

  const toggleFavorite = (id: string) => {
    setFavorite(id);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      difficulty: [] as string[],
      duration: '',
      equipment: [] as string[],
      muscleGroups: [] as string[]
    };
    setActiveFilters(emptyFilters);
    setSearchQuery('');
    handleSearch('');
    handleApplyFilters(emptyFilters);
  };

  const hasActiveFilters = activeFilters.difficulty.length > 0 || 
                          activeFilters.equipment.length > 0 || 
                          activeFilters.muscleGroups.length > 0 || 
                          activeFilters.duration || 
                          searchQuery.trim();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Biblioteca de Treinos
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <motion.div 
            className="bg-white p-4 rounded-lg shadow-md sticky top-24"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold mb-4">Buscar e Filtrar</h2>
            
            <div className="mb-4">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            <FilterPanel onApplyFilters={handleApplyFilters} />
            
            {hasActiveFilters && (
              <div className="mt-4">
                <button
                  onClick={clearAllFilters}
                  className="w-full bg-red-100 text-red-700 py-2 px-4 rounded-md hover:bg-red-200 transition-colors text-sm"
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Dumbbell size={16} className="mr-1" />
                Tipos de Treino Rápidos
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Força', 'HIIT', 'Cardio', 'Yoga', 'Pilates'].map(type => (
                  <button 
                    key={type}
                    onClick={() => handleSearch(type)}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Clock size={16} className="mr-1" />
                Duração
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '< 30 min', filter: { duration: 'short' } },
                  { label: '30-60 min', filter: { duration: 'medium' } },
                  { label: '> 60 min', filter: { duration: 'long' } }
                ].map(({ label, filter }) => (
                  <button 
                    key={label}
                    onClick={() => handleApplyFilters({ ...activeFilters, ...filter })}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredWorkouts.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Mostrando {filteredWorkouts.length} de {workouts.length} treinos
                {hasActiveFilters && (
                  <span className="ml-2 text-blue-600">
                    (filtros aplicados)
                  </span>
                )}
              </div>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {filteredWorkouts.map(workout => (
                  <WorkoutCard 
                    key={workout.id} 
                    workout={workout} 
                    isFavorite={favorites.includes(workout.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </motion.div>
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <h3 className="text-xl font-medium mb-2">Nenhum treino encontrado</h3>
              <p className="text-slate-600 mb-4">
                {hasActiveFilters 
                  ? "Nenhum treino corresponde aos seus critérios de busca. Tente ajustar seus filtros ou consulta de busca."
                  : "Nenhum treino disponível no momento."
                }
              </p>
              {hasActiveFilters && (
                <button 
                  onClick={clearAllFilters}
                  className="btn-primary"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutsPage;