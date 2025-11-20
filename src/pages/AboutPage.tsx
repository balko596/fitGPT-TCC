import React from 'react';
import { Dumbbell, Users, Server, Shield, Mail, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Sobre o FitGPT
      </motion.h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b">
          <div className="flex items-center mb-4">
            <Dumbbell className="w-8 h-8 text-blue-600 mr-2" />
            <h2 className="text-2xl font-semibold">Nossa Missão</h2>
          </div>
          <p className="text-slate-600">
            O FitGPT é dedicado a tornar o fitness mais acessível e personalizado através do poder da inteligência artificial. Nossa plataforma usa tecnologia GPT avançada para fornecer planos de treino abrangentes adaptados aos seus objetivos específicos, nível de condicionamento e preferências.
          </p>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Como Funciona</h2>
          <p className="text-slate-600 mb-4">
            Nossa aplicação combina ciência do exercício com análise alimentada por GPT para gerar rotinas de treino eficazes e equilibradas. Usamos processamento de linguagem natural para entender seus objetivos de fitness e criar programas que se adaptam ao seu progresso.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <motion.div 
              className="flex"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="mr-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Server className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Backend Alimentado por IA</h3>
                <p className="text-slate-600 text-sm">
                  Nosso backend Node.js integra com GPT para analisar e gerar planos de treino abrangentes baseados em princípios da ciência do exercício, garantindo rotinas eficazes e equilibradas.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="mr-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Interface Amigável</h3>
                <p className="text-slate-600 text-sm">
                  Nossa interface intuitiva baseada em React torna fácil gerar, navegar e seguir planos de treino. Salve suas rotinas favoritas e acompanhe seu progresso com nosso recurso de agenda.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="mr-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Privacidade e Segurança</h3>
                <p className="text-slate-600 text-sm">
                  Priorizamos a segurança dos seus dados pessoais. Suas informações de fitness são criptografadas e armazenadas com segurança, e nunca compartilharemos seus dados com terceiros sem seu consentimento.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="mr-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Experiência Personalizada</h3>
                <p className="text-slate-600 text-sm">
                  Nossa IA se adapta ao seu nível de condicionamento, objetivos e equipamentos disponíveis para criar planos de treino verdadeiramente personalizados que evoluem conforme você progride em sua jornada fitness.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Nossa Equipe</h2>
          <p className="text-slate-600 mb-4">
            O FitGPT foi criado por uma equipe de entusiastas do fitness, especialistas em IA e personal trainers certificados que acreditam que todos merecem acesso a orientação fitness de alta qualidade.
          </p>
          <p className="text-slate-600">
            Nossos especialistas combinam seu conhecimento da ciência do exercício com tecnologia de IA de ponta para garantir que nossos planos de treino sejam não apenas inteligentes, mas também seguros e eficazes.
          </p>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">Entre em Contato</h2>
          <p className="text-slate-600 mb-4">
            Estamos sempre buscando melhorar nossa plataforma e recebemos feedback dos nossos usuários. Se você tiver alguma dúvida, sugestão ou preocupação, não hesite em entrar em contato.
          </p>
          
          <div className="space-y-3">
            <a href="mailto:info@fitgpt.app" className="flex items-center text-blue-600 hover:text-blue-800">
              <Mail className="w-5 h-5 mr-2" />
              info@fitgpt.app
            </a>
            <a href="https://github.com/fitgpt" className="flex items-center text-blue-600 hover:text-blue-800">
              <Github className="w-5 h-5 mr-2" />
              github.com/fitgpt
            </a>
          </div>
        </motion.div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Comece Sua Jornada Fitness Hoje</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Seja você um iniciante ou um atleta experiente, o FitGPT pode ajudá-lo a alcançar seus objetivos fitness com planos de treino personalizados e alimentados por IA.
          </p>
          <a href="/workouts" className="btn-accent inline-block">
            Explorar Treinos
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;