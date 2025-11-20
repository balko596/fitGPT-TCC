import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Dumbbell, ArrowRight, Star, StarOff, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Workout } from '../types/Workout';

interface WorkoutCardProps {
  workout: Workout;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ 
  workout, 
  isFavorite = false,
  onToggleFavorite 
}) => {
  const { id, name, difficulty, muscleGroups, duration, exercises, calories } = workout;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'iniciante':
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediário':
      case 'intermediate':
        return 'text-amber-600 bg-amber-100';
      case 'avançado':
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/workout/${id}`} className="block h-full">
        <div className="card p-4 h-full flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <div className="mt-1 flex flex-wrap gap-1">
                {muscleGroups.map((group, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
            
            {onToggleFavorite && (
              <button 
                onClick={handleFavoriteClick}
                className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                {isFavorite ? (
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                ) : (
                  <StarOff className="w-5 h-5 text-slate-400" />
                )}
              </button>
            )}
          </div>
          
          <div className="mt-3 flex items-center text-slate-600 text-sm space-x-4">
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Dumbbell size={14} />
              <span>{exercises.length} exercícios</span>
            </div>
            <div className="flex items-center space-x-1">
              <Activity size={14} />
              <span>{calories} cal</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center mt-auto">
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}
            >
              {difficulty}
            </span>
            <span className="text-blue-600 text-sm font-medium flex items-center">
              Ver Treino
              <ArrowRight size={14} className="ml-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default WorkoutCard;