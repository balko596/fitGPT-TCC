import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Clock, Target, User, Loader, CheckCircle } from 'lucide-react';

interface WorkoutGeneratorProps {
  onGenerate: (preferences: WorkoutPreferences) => Promise<any>;
  isLoading: boolean;
  onSuccess?: (workout: any) => void;
}

interface WorkoutPreferences {
  fitnessLevel: string;
  duration: string;
  goal: string;
  equipment: string[];
  focusAreas: string[];
}

const WorkoutGenerator: React.FC<WorkoutGeneratorProps> = ({ onGenerate, isLoading, onSuccess }) => {
  const [preferences, setPreferences] = useState<WorkoutPreferences>({
    fitnessLevel: 'intermediario',
    duration: 'medio',
    goal: 'forca',
    equipment: ['nenhum'],
    focusAreas: ['corpo-todo']
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'equipment' | 'focusAreas') => {
    const { value, checked } = e.target;
    
    setPreferences(prev => {
      if (checked) {
        return { ...prev, [type]: [...prev[type], value] };
      } else {
        return { ...prev, [type]: prev[type].filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);

    try {
      console.log('🎯 WorkoutGenerator: Enviando preferências:', preferences);
      const workout = await onGenerate(preferences);
      setIsSuccess(true);

      if (onSuccess && workout) {
        onSuccess(workout);
      }

      // Resetar sucesso após 3 segundos
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('❌ WorkoutGenerator: Erro ao gerar treino:', error);
    }
  };

  return (
    <motion.div 
      className="bg-white p-6 rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Dumbbell className="mr-2 text-blue-600" size={24} />
        Gerar Treino Personalizado
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center">
              <User size={16} className="mr-1 text-slate-500" />
              Nível de Condicionamento
            </label>
            <select 
              name="fitnessLevel"
              value={preferences.fitnessLevel}
              onChange={handleInputChange}
              className="input-field"
              required
              disabled={isLoading}
            >
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center">
              <Clock size={16} className="mr-1 text-slate-500" />
              Duração do Treino
            </label>
            <select 
              name="duration"
              value={preferences.duration}
              onChange={handleInputChange}
              className="input-field"
              required
              disabled={isLoading}
            >
              <option value="curto">Curto (15-30 mins)</option>
              <option value="medio">Médio (30-60 mins)</option>
              <option value="longo">Longo (60+ mins)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center">
              <Target size={16} className="mr-1 text-slate-500" />
              Objetivo do Treino
            </label>
            <select 
              name="goal"
              value={preferences.goal}
              onChange={handleInputChange}
              className="input-field"
              required
              disabled={isLoading}
            >
              <option value="forca">Força</option>
              <option value="hipertrofia">Ganho de Massa</option>
              <option value="resistencia">Resistência</option>
              <option value="perda-peso">Perda de Peso</option>
              <option value="tonificacao">Tonificação</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Equipamentos Disponíveis</label>
          <div className="flex flex-wrap gap-3">
            {[
              { value: 'nenhum', label: 'Nenhum' },
              { value: 'halteres', label: 'Halteres' },
              { value: 'barra', label: 'Barra' },
              { value: 'kettlebell', label: 'Kettlebell' },
              { value: 'faixas-elasticas', label: 'Faixas Elásticas' },
              { value: 'maquinas', label: 'Máquinas' },
              { value: 'barra-fixa', label: 'Barra Fixa' }
            ].map(item => (
              <label key={item.value} className="flex items-center">
                <input 
                  type="checkbox"
                  value={item.value}
                  checked={preferences.equipment.includes(item.value)}
                  onChange={(e) => handleCheckboxChange(e, 'equipment')}
                  className="mr-1.5 rounded text-blue-600 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Áreas de Foco</label>
          <div className="flex flex-wrap gap-3">
            {[
              { value: 'corpo-todo', label: 'Corpo Todo' },
              { value: 'parte-superior', label: 'Parte Superior' },
              { value: 'parte-inferior', label: 'Parte Inferior' },
              { value: 'core', label: 'Core' },
              { value: 'peito', label: 'Peito' },
              { value: 'costas', label: 'Costas' },
              { value: 'pernas', label: 'Pernas' },
              { value: 'bracos', label: 'Braços' },
              { value: 'ombros', label: 'Ombros' }
            ].map(item => (
              <label key={item.value} className="flex items-center">
                <input 
                  type="checkbox"
                  value={item.value}
                  checked={preferences.focusAreas.includes(item.value)}
                  onChange={(e) => handleCheckboxChange(e, 'focusAreas')}
                  className="mr-1.5 rounded text-blue-600 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <button 
          type="submit"
          className={`w-full flex items-center justify-center py-3 px-4 rounded-md font-medium transition-all ${
            isLoading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : isSuccess
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader size={20} className="animate-spin mr-2" />
              Gerando Treino...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle size={20} className="mr-2" />
              Treino Criado com Sucesso!
            </>
          ) : (
            <>
              <Dumbbell size={20} className="mr-2" />
              Gerar Plano de Treino
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default WorkoutGenerator;