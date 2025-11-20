import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Dumbbell, 
  Target, 
  Settings, 
  Award, 
  Activity, 
  Edit, 
  RotateCcw,
  TrendingUp,
  Calendar,
  Loader
} from 'lucide-react';
import { motion } from 'framer-motion';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../contexts/AuthContext';
import { 
  getUserProgressStats, 
  resetWeeklyProgress, 
  resetMonthlyProgress, 
  updateGoals, 
  resetStreak,
  UserProgressStats 
} from '../services/progressService';

const ProfilePage: React.FC = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<UserProgressStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [newWeeklyGoal, setNewWeeklyGoal] = useState(5);
  const [newMonthlyGoal, setNewMonthlyGoal] = useState(20);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [recentWorkouts, setRecentWorkouts] = useState([
    { id: '1', name: 'Força Corpo Todo', date: '2023-06-12', duration: '45 min' },
    { id: '2', name: 'HIIT Cardio Explosivo', date: '2023-06-10', duration: '30 min' },
    { id: '3', name: 'Foco Parte Superior', date: '2023-06-08', duration: '50 min' },
  ]);
  
  const [achievements, setAchievements] = useState([
    { id: '1', name: 'Primeiro Treino', description: 'Completou seu primeiro treino', unlocked: true },
    { id: '2', name: 'Guerreiro da Semana', description: 'Treinou 5 dias seguidos', unlocked: true },
    { id: '3', name: 'Mestre da Variedade', description: 'Experimentou 5 tipos diferentes de treino', unlocked: false },
  ]);

  // Dados padrão se não houver perfil
  const defaultProfile = {
    name: 'Usuário',
    fitness_level: 'iniciante',
    age: null,
    height: null,
    weight: null,
    goals: [],
    preferred_workouts: [],
    avatar_url: null
  };

  const userProfile = profile || defaultProfile;

  useEffect(() => {
    loadProgressStats();
  }, []);

  const loadProgressStats = async () => {
    setIsLoading(true);
    try {
      const progressStats = await getUserProgressStats();
      setStats(progressStats);
      if (progressStats) {
        setNewWeeklyGoal(progressStats.weekly_workouts_goal);
        setNewMonthlyGoal(progressStats.monthly_workouts_goal);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetWeekly = async () => {
    if (confirm('Tem certeza que deseja resetar o progresso semanal?')) {
      setIsUpdating(true);
      try {
        await resetWeeklyProgress();
        await loadProgressStats();
        alert('Progresso semanal resetado com sucesso!');
      } catch (error) {
        alert('Erro ao resetar progresso semanal');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleResetMonthly = async () => {
    if (confirm('Tem certeza que deseja resetar o progresso mensal?')) {
      setIsUpdating(true);
      try {
        await resetMonthlyProgress();
        await loadProgressStats();
        alert('Progresso mensal resetado com sucesso!');
      } catch (error) {
        alert('Erro ao resetar progresso mensal');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleResetStreak = async () => {
    if (confirm('Tem certeza que deseja resetar sua sequência?')) {
      setIsUpdating(true);
      try {
        await resetStreak();
        await loadProgressStats();
        alert('Sequência resetada com sucesso!');
      } catch (error) {
        alert('Erro ao resetar sequência');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleUpdateGoals = async () => {
    setIsUpdating(true);
    try {
      await updateGoals(newWeeklyGoal, newMonthlyGoal);
      await loadProgressStats();
      setShowGoalsModal(false);
      alert('Metas atualizadas com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar metas');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Seu Perfil
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white text-center">
              <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {userProfile.avatar_url ? (
                  <img
                    src={userProfile.avatar_url}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-blue-600" />
                )}
              </div>
              <h2 className="text-xl font-bold">{userProfile.name}</h2>
              <p className="text-blue-100">Nível {userProfile.fitness_level}</p>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-3 text-center mb-4">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats?.total_workouts_completed || 0}
                  </div>
                  <div className="text-xs text-slate-500">Treinos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats?.current_streak || 0}
                  </div>
                  <div className="text-xs text-slate-500">Sequência</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats?.total_minutes_exercised || 0}
                  </div>
                  <div className="text-xs text-slate-500">Minutos</div>
                </div>
              </div>
              
              <div className="space-y-4">
                {userProfile.age && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Idade</div>
                    <div className="text-sm">{userProfile.age} anos</div>
                  </div>
                )}
                {userProfile.height && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Altura</div>
                    <div className="text-sm">{userProfile.height} cm</div>
                  </div>
                )}
                {userProfile.weight && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Peso</div>
                    <div className="text-sm">{userProfile.weight} kg</div>
                  </div>
                )}
                
                {userProfile.goals && userProfile.goals.length > 0 && (
                  <div className="pt-2">
                    <div className="text-sm font-medium mb-2">Objetivos Fitness</div>
                    <div className="flex flex-wrap gap-1">
                      {userProfile.goals.map((goal, index) => (
                        <span key={index} className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {userProfile.preferred_workouts && userProfile.preferred_workouts.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Treinos Preferidos</div>
                    <div className="flex flex-wrap gap-1">
                      {userProfile.preferred_workouts.map((workout, index) => (
                        <span key={index} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                          {workout}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <Link 
                to="/edit-profile"
                className="mt-4 text-sm text-blue-600 font-medium flex items-center hover:text-blue-800 transition-colors"
              >
                <Edit size={14} className="mr-1" />
                Editar Perfil
              </Link>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Progresso e Metas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold">Progresso Semanal</h3>
                </div>
                <button
                  onClick={handleResetWeekly}
                  disabled={isUpdating}
                  className="text-red-600 hover:text-red-800 p-1 rounded"
                  title="Resetar progresso semanal"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
              <ProgressBar 
                value={stats?.weekly_workouts_completed || 0} 
                max={stats?.weekly_workouts_goal || 5} 
                label={`${stats?.weekly_workouts_completed || 0}/${stats?.weekly_workouts_goal || 5} Treinos`} 
              />
              <div className="text-center text-sm text-slate-500">
                Mais {Math.max(0, (stats?.weekly_workouts_goal || 5) - (stats?.weekly_workouts_completed || 0))} para atingir sua meta semanal
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-emerald-600 mr-2" />
                  <h3 className="font-semibold">Progresso Mensal</h3>
                </div>
                <button
                  onClick={handleResetMonthly}
                  disabled={isUpdating}
                  className="text-red-600 hover:text-red-800 p-1 rounded"
                  title="Resetar progresso mensal"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
              <ProgressBar 
                value={stats?.monthly_workouts_completed || 0} 
                max={stats?.monthly_workouts_goal || 20} 
                label={`${stats?.monthly_workouts_completed || 0}/${stats?.monthly_workouts_goal || 20} Treinos`} 
                color="bg-emerald-600"
              />
              <div className="text-center text-sm text-slate-500">
                Mais {Math.max(0, (stats?.monthly_workouts_goal || 20) - (stats?.monthly_workouts_completed || 0))} para atingir sua meta mensal
              </div>
            </div>
          </div>

          {/* Estatísticas Adicionais */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="font-semibold">Estatísticas Gerais</h3>
              </div>
              <button
                onClick={() => setShowGoalsModal(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Editar Metas
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats?.current_streak || 0}
                </div>
                <div className="text-xs text-slate-500">Sequência Atual</div>
                <button
                  onClick={handleResetStreak}
                  disabled={isUpdating}
                  className="text-red-500 hover:text-red-700 text-xs mt-1"
                >
                  Resetar
                </button>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats?.longest_streak || 0}
                </div>
                <div className="text-xs text-slate-500">Maior Sequência</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats?.total_minutes_exercised || 0}
                </div>
                <div className="text-xs text-slate-500">Total Minutos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats?.total_calories_burned || 0}
                </div>
                <div className="text-xs text-slate-500">Calorias Queimadas</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Dumbbell className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold">Treinos Recentes</h3>
              </div>
              <Link to="/workouts" className="text-sm text-blue-600 hover:text-blue-800">Ver Todos</Link>
            </div>
            
            <div className="space-y-2">
              {recentWorkouts.map(workout => (
                <div key={workout.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                  <div>
                    <div className="font-medium">{workout.name}</div>
                    <div className="text-xs text-slate-500">{workout.date}</div>
                  </div>
                  <div className="text-sm">{workout.duration}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Award className="w-5 h-5 text-amber-500 mr-2" />
              <h3 className="font-semibold">Conquistas</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`p-3 rounded-lg border ${
                    achievement.unlocked 
                      ? 'border-amber-200 bg-amber-50' 
                      : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                      achievement.unlocked ? 'bg-amber-400' : 'bg-slate-300'
                    }`}>
                      <Award size={16} className={achievement.unlocked ? 'text-white' : 'text-slate-500'} />
                    </div>
                    <div>
                      <div className="font-medium">{achievement.name}</div>
                      <div className="text-xs text-slate-500">{achievement.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal de Edição de Metas */}
      {showGoalsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Editar Metas</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Semanal (treinos)
                </label>
                <input
                  type="number"
                  value={newWeeklyGoal}
                  onChange={(e) => setNewWeeklyGoal(parseInt(e.target.value) || 0)}
                  className="input-field"
                  min="1"
                  max="7"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Mensal (treinos)
                </label>
                <input
                  type="number"
                  value={newMonthlyGoal}
                  onChange={(e) => setNewMonthlyGoal(parseInt(e.target.value) || 0)}
                  className="input-field"
                  min="1"
                  max="31"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateGoals}
                disabled={isUpdating}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isUpdating ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : 'Salvar'}
              </button>
              <button
                onClick={() => setShowGoalsModal(false)}
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

export default ProfilePage;