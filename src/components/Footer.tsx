import React from 'react';
import { Dumbbell, Mail, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Dumbbell size={24} className="text-blue-400" />
              <span className="text-xl font-bold">FitGPT</span>
            </div>
            <p className="text-slate-300">
              Planos de treino personalizados e acompanhamento de fitness. Seu companheiro inteligente para um estilo de vida mais saudável.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-slate-300 hover:text-white transition-colors">Início</a></li>
              <li><a href="/workouts" className="text-slate-300 hover:text-white transition-colors">Treinos</a></li>
              <li><a href="/favorites" className="text-slate-300 hover:text-white transition-colors">Favoritos</a></li>
              <li><a href="/schedule" className="text-slate-300 hover:text-white transition-colors">Agenda</a></li>
              <li><a href="/profile" className="text-slate-300 hover:text-white transition-colors">Perfil</a></li>
              <li><a href="/about" className="text-slate-300 hover:text-white transition-colors">Sobre</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-2">
              <a href="mailto:info@fitgpt.app" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                <Mail size={18} />
                <span>info@fitgpt.app</span>
              </a>
              <a href="https://github.com/fitgpt" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                <Github size={18} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-4 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} FitGPT. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;