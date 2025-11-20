import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  onApplyFilters: (filters: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: [] as string[],
    duration: '',
    equipment: [] as string[],
    muscleGroups: [] as string[]
  });

  const handleFilterChange = (key: string, value: string, isArray = false) => {
    if (isArray) {
      setFilters(prev => {
        const currentArray = prev[key as keyof typeof prev] as string[];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        
        const newFilters = {
          ...prev,
          [key]: newArray
        };
        
        // Aplicar filtros automaticamente quando mudança ocorre
        onApplyFilters(newFilters);
        return newFilters;
      });
    } else {
      setFilters(prev => {
        const newFilters = {
          ...prev,
          [key]: value
        };
        
        // Aplicar filtros automaticamente quando mudança ocorre
        onApplyFilters(newFilters);
        return newFilters;
      });
    }
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      difficulty: [] as string[],
      duration: '',
      equipment: [] as string[],
      muscleGroups: [] as string[]
    };
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="w-4 h-4" />
        Filtros
        {(filters.difficulty.length > 0 || filters.equipment.length > 0 || filters.muscleGroups.length > 0 || filters.duration) && (
          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 ml-1">
            {filters.difficulty.length + filters.equipment.length + filters.muscleGroups.length + (filters.duration ? 1 : 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filtros</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nível de Dificuldade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Dificuldade
                </label>
                <div className="space-y-2">
                  {['Iniciante', 'Intermediário', 'Avançado'].map(level => (
                    <label key={level} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.difficulty.includes(level)}
                        onChange={() => handleFilterChange('difficulty', level, true)}
                        className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duração */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração
                </label>
                <select
                  value={filters.duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Qualquer Duração</option>
                  <option value="short">Até 30 minutos</option>
                  <option value="medium">30-60 minutos</option>
                  <option value="long">Mais de 60 minutos</option>
                </select>
              </div>

              {/* Equipamentos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipamentos
                </label>
                <div className="space-y-2">
                  {['Nenhum', 'Halteres', 'Barra', 'Faixas Elásticas', 'Kettlebell', 'Máquinas'].map(equipment => (
                    <label key={equipment} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.equipment.includes(equipment)}
                        onChange={() => handleFilterChange('equipment', equipment, true)}
                        className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{equipment}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Grupos Musculares */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grupos Musculares
                </label>
                <div className="space-y-2">
                  {['Corpo Todo', 'Peito', 'Costas', 'Ombros', 'Braços', 'Pernas', 'Core', 'Glúteos'].map(muscle => (
                    <label key={muscle} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.muscleGroups.includes(muscle)}
                        onChange={() => handleFilterChange('muscleGroups', muscle, true)}
                        className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{muscle}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleApplyFilters}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={handleClearFilters}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Limpar Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;