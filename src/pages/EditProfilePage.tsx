import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Save, ArrowLeft, Camera, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EditProfilePage: React.FC = () => {
  const { profile, updateProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    age: profile?.age || '',
    height: profile?.height || '',
    weight: profile?.weight || '',
    fitness_level: profile?.fitness_level || 'iniciante',
    goals: profile?.goals || [],
    preferred_workouts: profile?.preferred_workouts || [],
    avatar_url: profile?.avatar_url || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'weight' 
        ? (value ? parseInt(value) : '') 
        : value
    }));
  };

  const handleArrayChange = (field: 'goals' | 'preferred_workouts', value: string) => {
    setFormData(prev => {
      const currentArray = prev[field];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      await updateProfile(formData);
      setMessage('Perfil atualizado com sucesso!');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      setMessage('Erro ao atualizar perfil. Tente novamente.');
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fitnessGoals = [
    'Perder Peso',
    'Ganhar Massa',
    'Melhorar Força',
    'Aumentar Resistência',
    'Tonificar',
    'Melhorar Flexibilidade',
    'Reabilitação',
    'Bem-estar Geral'
  ];

  const workoutTypes = [
    'Musculação',
    'Cardio',
    'HIIT',
    'Yoga',
    'Pilates',
    'Corrida',
    'Natação',
    'Ciclismo',
    'Crossfit',
    'Dança'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/profile" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Voltar ao Perfil
      </Link>

      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex items-center">
              <User className="w-6 h-6 mr-2" />
              <h1 className="text-2xl font-bold">Editar Perfil</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Avatar */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {formData.avatar_url ? (
                    <img
                      src={formData.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-blue-600" />
                  )}
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Camera size={16} />
                </button>
              </div>
              <input
                type="url"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleInputChange}
                placeholder="URL da foto de perfil"
                className="input-field text-center text-sm"
              />
            </div>

            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idade
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="13"
                  max="120"
                  className="input-field"
                  placeholder="Sua idade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  min="100"
                  max="250"
                  className="input-field"
                  placeholder="Altura em centímetros"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  min="30"
                  max="300"
                  className="input-field"
                  placeholder="Peso em quilogramas"
                />
              </div>
            </div>

            {/* Nível de Condicionamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nível de Condicionamento Físico
              </label>
              <select
                name="fitness_level"
                value={formData.fitness_level}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediário">Intermediário</option>
                <option value="avançado">Avançado</option>
              </select>
            </div>

            {/* Objetivos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivos de Fitness
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {fitnessGoals.map(goal => (
                  <label key={goal} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal)}
                      onChange={() => handleArrayChange('goals', goal)}
                      className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tipos de Treino Preferidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipos de Treino Preferidos
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {workoutTypes.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preferred_workouts.includes(type)}
                      onChange={() => handleArrayChange('preferred_workouts', type)}
                      className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mensagem de Status */}
            {message && (
              <motion.div
                className={`p-3 rounded-lg text-center ${
                  message.includes('sucesso') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message}
              </motion.div>
            )}

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </button>
              
              <Link
                to="/profile"
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfilePage;