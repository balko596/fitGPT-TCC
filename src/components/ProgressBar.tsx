import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max, 
  label, 
  color = 'bg-blue-600' 
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  return (
    <div className="mb-4">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-sm font-medium text-slate-700">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <motion.div 
          className={`h-2.5 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;