import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Search, Calendar, Star, Target, GitMerge, X, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import WorkoutGenerator from '../components/WorkoutGenerator';
import { useWorkoutContext } from '../contexts/WorkoutContext';
import { isSupabaseConfigured } from '../lib/supabase';

const HomePage: React.FC = () => {
  const { generateWorkout, isGenerating, error } = useWorkoutContext();
  const [showGenerator, setShowGenerator] = useState(false);
  const [showError, setShowError] = useState(true);
  const [showOfflineNotice, setShowOfflineNotice] = useState(!isSupabaseConfigured());

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
            <motion.div 
              className="max-w-xl mx-auto bg-white rounded-lg p-2 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <SearchBar onSearch={handleSearch} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Generator Section */}
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
            Explore nossa biblioteca abrangente de treinos ou crie seu próprio plano personalizado hoje.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/workouts" className="btn-accent inline-block">
              Explorar Treinos
            </Link>
            <button onClick={handleGenerateClick} className="btn-secondary inline-block">
              Criar Plano Personalizado
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;