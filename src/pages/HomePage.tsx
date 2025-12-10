import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Search, Calendar, Star, Target, GitMerge, X, Database, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import WorkoutGenerator from '../components/WorkoutGenerator';
import { useWorkoutContext } from '../contexts/WorkoutContext';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';

const HomePage: React.FC = () => {
  const { generateWorkout, isGenerating, error } = useWorkoutContext();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showGenerator, setShowGenerator] = useState(false);
  const [showError, setShowError] = useState(true);
  const [showOfflineNotice, setShowOfflineNotice] = useState(!isSupabaseConfigured());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedWorkoutId, setGeneratedWorkoutId] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    console.log('Buscando por:', query);
    // Em uma aplicação real, redirecionaria para resultados de busca
  };

  const handleGenerateClick = () => {
    setShowGenerator(true);
  };

  const dismissError = () => {
    setShowError(false);
  };

  const dismissOfflineNotice = () => {
    setShowOfflineNotice(false);
  };

  const handleWorkoutSuccess = (workout: any) => {
    console.log('✅ Treino criado com sucesso:', workout);
    setGeneratedWorkoutId(workout.id);
    setShowSuccessModal(true);
  };

  const handleGoToWorkout = () => {
    if (generatedWorkoutId) {
      navigate(`/workout/${generatedWorkoutId}`);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setGeneratedWorkoutId(null);
  };

  return (
    <div>
      {/* Offline Notice */}
      {showOfflineNotice && !isSupabaseConfigured() && (
        <section className="py-3 bg-blue-50 border-b border-blue-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-blue-800">
                <Database className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm">
                  Modo offline ativo. Seus dados são salvos apenas neste navegador. 
                  <Link to="/supabase-setup" className="font-medium underline ml-1">
                    Configure o Supabase para sincronizar entre dispositivos
                  </Link>
                </span>
              </div>
              <button 
                onClick={dismissOfflineNotice}
                className="text-blue-600 hover:text-blue-800 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Error Alert - Only show if there's a real error, not connection warnings */}
      {error && showError && !error.includes('dados de exemplo') && !error.includes('Conecte ao Supabase') && (
        <section className="py-3 bg-red-50 border-b border-red-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-red-800">
                <span className="text-sm">{error}</span>
              </div>
              <button 
                onClick={dismissError}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90 z-0"></div>
        <div
          className="absolute inset-0 bg-cover bg-center z-[-1]"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1600')"
          }}
        ></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-2xl mx-auto text-center text-white">
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Planos de Treino com IA
            </motion.h1>
            <motion.p
              className="text-xl mb-8 text-blue-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Obtenha rotinas de treino personalizadas geradas por inteligência artificial
            </motion.p>

            {isAuthenticated ? (
              <motion.div
                className="max-w-xl mx-auto bg-white rounded-lg p-2 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <SearchBar onSearch={handleSearch} />
              </motion.div>
            ) : (
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  to="/login"
                  className="flex-1 px-8 py-4 text-lg font-semibold bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 px-8 py-4 text-lg font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all shadow-lg hover:shadow-xl"
                >
                  Criar conta
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Generator Section - Only for authenticated users */}
      {isAuthenticated && (
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Crie Seu Plano de Treino Personalizado</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Nossa IA criará uma rotina de treino personalizada baseada nos seus objetivos, nível de condicionamento e equipamentos disponíveis.
              </p>
            </div>

            {showGenerator ? (
              <div className="max-w-3xl mx-auto">
                <WorkoutGenerator
                  onGenerate={generateWorkout}
                  isLoading={isGenerating}
                  onSuccess={handleWorkoutSuccess}
                />
              </div>
            ) : (
              <div className="text-center">
                <motion.button
                  className="btn-primary inline-flex items-center"
                  onClick={handleGenerateClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Dumbbell className="mr-2" size={20} />
                  Criar Treino Personalizado
                </motion.button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Por que Escolher o FitGPT</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="card p-6 text-center"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Treinos Inteligentes</h3>
              <p className="text-slate-600">Planos de treino personalizados criados por IA baseados nos seus objetivos e preferências</p>
            </motion.div>
            
            <motion.div 
              className="card p-6 text-center"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Focado em Objetivos</h3>
              <p className="text-slate-600">Treinos adaptados para atender seus objetivos específicos de condicionamento físico</p>
            </motion.div>
            
            <motion.div 
              className="card p-6 text-center"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Planejador Semanal</h3>
              <p className="text-slate-600">Organize seus treinos em uma agenda semanal para manter a consistência</p>
            </motion.div>
            
            <motion.div 
              className="card p-6 text-center"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GitMerge className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Acompanhamento de Progresso</h3>
              <p className="text-slate-600">Monitore sua jornada fitness com acompanhamento detalhado de progresso e insights</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Transformar Seu Condicionamento?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {isAuthenticated
              ? 'Explore nossa biblioteca abrangente de treinos ou crie seu próprio plano personalizado hoje.'
              : 'Crie uma conta gratuita para acessar treinos personalizados e muito mais.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/workouts" className="btn-accent inline-block">
                  Explorar Treinos
                </Link>
                <button onClick={handleGenerateClick} className="btn-secondary inline-block">
                  Criar Plano Personalizado
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-accent inline-block">
                  Criar Conta Grátis
                </Link>
                <Link to="/login" className="btn-secondary inline-block">
                  Entrar
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Treino Criado com Sucesso!
                </h3>
                <p className="text-gray-600 mb-6">
                  Seu plano de treino personalizado está pronto para você começar.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleGoToWorkout}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Ver Treino
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;