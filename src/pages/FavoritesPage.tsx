import React, { useState, useEffect } from 'react';
import WorkoutCard from '../components/WorkoutCard';
import { Star, Loader, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWorkoutContext } from '../contexts/WorkoutContext';

const FavoritesPage: React.FC = () => {
  const { workouts, favorites, setFavorite, isLoading } = useWorkoutContext();
  const [favoriteWorkouts, setFavoriteWorkouts] = useState([]);
  
  useEffect(() => {
    if (workouts.length > 0 && favorites.length > 0) {
      const favWorkouts = workouts.filter(workout => favorites.includes(workout.id));
      setFavoriteWorkouts(favWorkouts);
    } else {
      setFavoriteWorkouts([]);
    }
  }, [workouts, favorites]);
  
  const toggleFavorite = (id: string) => {
    setFavorite(id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="flex items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Star className="w-8 h-8 text-amber-500 fill-amber-500 mr-2" />
        <h1 className="text-3xl font-bold">Seus Treinos Favoritos</h1>
      </motion.div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : favoriteWorkouts.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {favoriteWorkouts.map(workout => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Nenhum Favorito Ainda</h2>
          <p className="text-slate-600 mb-4">
            Você ainda não adicionou nenhum treino à sua lista de favoritos. Navegue pelos treinos e marque com estrela os que deseja salvar.
          </p>
          <a href="/workouts" className="btn-primary">
            Ver Treinos
          </a>
        </motion.div>
      )}
    </div>
  );
};

export default FavoritesPage;