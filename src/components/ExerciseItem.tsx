import React from 'react';
import { motion } from 'framer-motion';
import { Exercise } from '../types/Workout';

interface ExerciseItemProps {
  exercise: Exercise;
  index: number;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, index }) => {
  const { name, sets, reps, restTime, instructions, imageUrl } = exercise;

  return (
    <motion.div
      className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-slate-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="md:flex items-start">
        {imageUrl && (
          <div className="md:w-1/4 mb-4 md:mb-0 md:mr-4">
            <div className="rounded-lg overflow-hidden bg-slate-100 aspect-video">
              <img 
                src={imageUrl} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        
        <div className={imageUrl ? "md:w-3/4" : "w-full"}>
          <div className="flex items-center mb-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mr-2">
              {index + 1}
            </span>
            <h3 className="font-medium text-lg">{name}</h3>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-3">
            <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-700">
              {sets} séries
            </div>
            <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-700">
              {reps}
            </div>
            <div className="bg-slate-100 px-3 py-1 rounded-full text-xs font-medium text-slate-700">
              {restTime} descanso
            </div>
          </div>
          
          <p className="text-slate-600 text-sm">{instructions}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ExerciseItem;