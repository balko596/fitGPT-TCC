import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Dumbbell, 
  Clock, 
  Target, 
  User, 
  AlertTriangle, 
  Calendar, 
  Info, 
  ArrowLeft,
  Star,
  StarOff,
  Loader,
  Activity,
  Repeat,
  CheckCircle,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import ExerciseItem from '../components/ExerciseItem';
import { fetchWorkoutById, saveWorkoutHistory } from '../services/workoutService';
import { saveScheduleEntry } from '../services/scheduleService';
import { useWorkoutContext } from '../contexts/WorkoutContext';
import { Workout } from '../types/Workout';

const WorkoutDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { workouts, getWorkout, setFavorite, favorites, isLoading } = useWorkoutContext();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [actualDuration, setActualDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const loadWorkout = async () => {
      if (!id) return;
      
      try {
        const workoutData = getWorkout(id);
        if (workoutData) {
          setWorkout(workoutData);
          setIsFavorite(favorites.includes(id));
        } else {
          setError('Treino não encontrado');
        }
      } catch (err) {
        setError('Falha ao carregar detalhes do treino. Tente novamente mais tarde.');
        console.error('Erro ao buscar treino:', err);
      }
    };
    
    loadWorkout();
  }, [id, getWorkout, favorites]);
  
  const toggleFavorite = () => {
    if (!id) return;
    setFavorite(id);
    setIsFavorite(!isFavorite);
  };

  const handleScheduleWorkout = async () => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      await saveScheduleEntry(id, scheduleDate, scheduleTime);
      setShowScheduleModal(false);
      setScheduleDate(new Date().toISOString().split('T')[0]);
      setScheduleTime('');
      alert('Treino adicionado à agenda com sucesso!');
    } catch (error) {
      console.error('Erro ao agendar treino:', error);
      alert('Erro ao agendar treino. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteWorkout = async () => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      const durationMinutes = actualDuration ? parseInt(actualDuration) : undefined;
      await saveWorkoutHistory(id, durationMinutes, completionNotes);
      setShowCompleteModal(false);
      setCompletionNotes('');
      setActualDuration('');
      alert('Treino marcado como concluído!');
    } catch (error) {
      console.error('Erro ao marcar treino como concluído:', error);
      alert('Erro ao salvar treino. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Loader className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }
  
  if (error || !workout) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Erro ao Carregar Detalhes</h2>
          <p className="text-slate-600 mb-4">{error || 'Treino não encontrado'}</p>
          <Link to="/workouts" className="btn-primary">
            Voltar aos Treinos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/workouts" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Voltar aos Treinos
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <Dumbbell className="w-6 h-6 mr-2" />
                <h1 className="text-2xl font-bold">{workout.name}</h1>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {workout.muscleGroups.map((group, index) => (
                  <span key={index} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {group}
                  </span>
                ))}
              </div>
            </div>
            <button 
              onClick={toggleFavorite}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              {isFavorite ? (
                <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
              ) : (
                <StarOff className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-blue-100">Dificuldade</div>
              <div className="font-medium mt-1 flex items-center">
                <User size={16} className="mr-1" />
                {workout.difficulty}
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-blue-100">Duração</div>
              <div className="font-medium mt-1 flex items-center">
                <Clock size={16} className="mr-1" />
                {workout.duration}
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-blue-100">Calorias</div>
              <div className="font-medium mt-1 flex items-center">
                <Activity size={16} className="mr-1" />
                {workout.calories} cal
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-blue-100">Exercícios</div>
              <div className="font-medium mt-1 flex items-center">
                <Repeat size={16} className="mr-1" />
                {workout.exercises.length} exercícios
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Workout Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Exercícios</h2>
              
              <div className="space-y-4">
                {workout.exercises.map((exercise, index) => (
                  <ExerciseItem 
                    key={index} 
                    exercise={exercise} 
                    index={index} 
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Detalhes do Treino</h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-slate-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium">Áreas de Foco</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {workout.muscleGroups.map((group, index) => (
                      <span 
                        key={index} 
                        className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-slate-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Dumbbell className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium">Equipamentos Necessários</h3>
                  </div>
                  <ul className="text-slate-600 text-sm space-y-1">
                    {workout.equipment.length > 0 ? (
                      workout.equipment.map((item, index) => (
                        <li key={index} className="capitalize">• {item}</li>
                      ))
                    ) : (
                      <li>• Nenhum equipamento necessário</li>
                    )}
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg bg-slate-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium">Instruções</h3>
                  </div>
                  <p className="text-slate-600 text-sm">
                    {workout.instructions || "Execute cada exercício com a forma adequada, focando nos grupos musculares sendo trabalhados. Respeite os períodos de descanso recomendados entre séries e exercícios. Mantenha-se hidratado e escute seu corpo."}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowScheduleModal(true)}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    <Calendar className="mr-2" size={18} />
                    Adicionar à Agenda
                  </button>

                  <button 
                    onClick={() => setShowCompleteModal(true)}
                    className="btn-secondary w-full flex items-center justify-center"
                  >
                    <CheckCircle className="mr-2" size={18} />
                    Marcar como Concluído
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Agendamento */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Agendar Treino</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário (opcional)
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleScheduleWorkout}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : 'Agendar'}
              </button>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de Conclusão */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Marcar Treino como Concluído</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duração real (minutos)
                </label>
                <input
                  type="number"
                  value={actualDuration}
                  onChange={(e) => setActualDuration(e.target.value)}
                  className="input-field"
                  placeholder="Ex: 45"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas (opcional)
                </label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="input-field"
                  rows={3}
                  placeholder="Como foi o treino? Alguma observação?"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCompleteWorkout}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : 'Concluir'}
              </button>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WorkoutDetailsPage;