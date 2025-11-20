import React, { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, ArrowRight, Plus, Trash, Loader, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWorkoutContext } from '../contexts/WorkoutContext';
import { Link } from 'react-router-dom';
import { 
  fetchScheduleEntries, 
  saveScheduleEntry, 
  removeScheduleEntry, 
  markScheduleEntryCompleted,
  ScheduleEntry 
} from '../services/scheduleService';

const SchedulePage: React.FC = () => {
  const { workouts, isLoading } = useWorkoutContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule, setSchedule] = useState<{ [key: string]: ScheduleEntry[] }>({});
  const [showWorkoutSelector, setShowWorkoutSelector] = useState<string | false>(false);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);
  
  const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
  const previousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };
  
  const nextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };
  
  const getCurrentWeekDates = () => {
    const currentDay = selectedDate.getDay();
    const result = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(selectedDate);
      date.setDate(selectedDate.getDate() - currentDay + i);
      result.push(date);
    }
    
    return result;
  };
  
  const weekDates = getCurrentWeekDates();
  
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  // Carregar agendamentos da semana atual
  const loadScheduleEntries = async () => {
    setIsLoadingSchedule(true);
    try {
      const startDate = formatDate(weekDates[0]);
      const endDate = formatDate(weekDates[6]);
      
      const entries = await fetchScheduleEntries(startDate, endDate);
      
      // Organizar por data
      const scheduleByDate: { [key: string]: ScheduleEntry[] } = {};
      entries.forEach(entry => {
        const dateKey = entry.scheduled_date;
        if (!scheduleByDate[dateKey]) {
          scheduleByDate[dateKey] = [];
        }
        scheduleByDate[dateKey].push(entry);
      });
      
      setSchedule(scheduleByDate);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  useEffect(() => {
    loadScheduleEntries();
  }, [selectedDate]);
  
  const addWorkout = async (date: Date, workout: any) => {
    try {
      const dateStr = formatDate(date);
      const newEntry = await saveScheduleEntry(workout.id, dateStr);
      
      // Adicionar à lista local
      setSchedule(prev => ({
        ...prev,
        [dateStr]: [...(prev[dateStr] || []), { ...newEntry, workout }]
      }));
      
      setShowWorkoutSelector(false);
    } catch (error) {
      console.error('Erro ao adicionar treino à agenda:', error);
    }
  };
  
  const removeWorkout = async (date: Date, entryId: string) => {
    try {
      await removeScheduleEntry(entryId);
      
      const dateStr = formatDate(date);
      setSchedule(prev => ({
        ...prev,
        [dateStr]: prev[dateStr]?.filter(entry => entry.id !== entryId) || []
      }));
    } catch (error) {
      console.error('Erro ao remover treino da agenda:', error);
    }
  };

  const markCompleted = async (date: Date, entryId: string) => {
    try {
      await markScheduleEntryCompleted(entryId);
      
      const dateStr = formatDate(date);
      setSchedule(prev => ({
        ...prev,
        [dateStr]: prev[dateStr]?.map(entry => 
          entry.id === entryId ? { ...entry, completed: true } : entry
        ) || []
      }));
    } catch (error) {
      console.error('Erro ao marcar treino como concluído:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="flex items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Calendar className="w-8 h-8 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold">Agenda de Treinos</h1>
      </motion.div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center bg-blue-600 text-white p-4">
          <button 
            onClick={previousWeek}
            className="p-1 rounded hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </button>
          
          <h2 className="text-lg font-semibold">
            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </h2>
          
          <button 
            onClick={nextWeek}
            className="p-1 rounded hover:bg-white/10"
          >
            <ArrowRight size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 bg-blue-50 border-b border-blue-100">
          {daysOfWeek.map(day => (
            <div key={day} className="p-2 text-center font-medium text-blue-800 text-sm">
              {day}
            </div>
          ))}
        </div>
        
        {isLoadingSchedule ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-7 h-[600px]">
            {weekDates.map((date, index) => {
              const isToday = new Date().toDateString() === date.toDateString();
              const dateStr = formatDate(date);
              const dayEntries = schedule[dateStr] || [];
              
              return (
                <div 
                  key={index} 
                  className={`border border-slate-100 p-2 h-full ${
                    isToday ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-medium ${
                      isToday ? 'text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full' : ''
                    }`}>
                      {date.getDate()}
                    </span>
                    <button 
                      onClick={() => setShowWorkoutSelector(dateStr)}
                      className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {dayEntries.map((entry) => {
                      // Buscar dados do treino se não estiver incluído
                      const workout = entry.workout || workouts.find(w => w.id === entry.workout_id);
                      
                      return (
                        <div 
                          key={entry.id}
                          className={`bg-white p-2 rounded shadow-sm border text-xs ${
                            entry.completed 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-slate-100'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className={`font-medium ${
                              entry.completed ? 'text-green-700 line-through' : ''
                            }`}>
                              {workout?.name || 'Treino'}
                            </span>
                            <div className="flex gap-1">
                              {!entry.completed && (
                                <button 
                                  onClick={() => markCompleted(date, entry.id)}
                                  className="text-green-600 hover:bg-green-50 p-0.5 rounded"
                                  title="Marcar como concluído"
                                >
                                  <CheckCircle size={12} />
                                </button>
                              )}
                              <button 
                                onClick={() => removeWorkout(date, entry.id)}
                                className="text-red-500 hover:bg-red-50 p-0.5 rounded"
                                title="Remover"
                              >
                                <Trash size={12} />
                              </button>
                            </div>
                          </div>
                          {workout && (
                            <div className="text-slate-500">
                              {workout.duration} • {workout.difficulty}
                            </div>
                          )}
                          {entry.scheduled_time && (
                            <div className="text-blue-600 text-xs mt-1">
                              {entry.scheduled_time}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {showWorkoutSelector === dateStr && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <motion.div 
                        className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-auto"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold">Adicionar Treino para {date.toLocaleDateString('pt-BR')}</h3>
                          <button 
                            onClick={() => setShowWorkoutSelector(false)}
                            className="text-slate-500 hover:text-slate-700"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                        
                        {isLoading ? (
                          <div className="flex items-center justify-center p-4">
                            <Loader className="w-6 h-6 text-blue-600 animate-spin" />
                          </div>
                        ) : workouts.length > 0 ? (
                          <div className="space-y-2">
                            {workouts.map(workout => (
                              <button 
                                key={workout.id}
                                className="w-full text-left p-3 rounded border border-slate-200 hover:bg-blue-50 transition-colors"
                                onClick={() => addWorkout(date, workout)}
                              >
                                <div className="font-medium">{workout.name}</div>
                                <div className="text-xs text-slate-500 mt-1">
                                  <span>{workout.duration}</span>
                                  <span className="mx-1">•</span>
                                  <span>{workout.difficulty}</span>
                                  <span className="mx-1">•</span>
                                  <span>{workout.calories} cal</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <p className="text-slate-600 mb-2">Nenhum treino disponível</p>
                            <Link to="/workouts" className="btn-primary text-sm">
                              Explorar Treinos
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;