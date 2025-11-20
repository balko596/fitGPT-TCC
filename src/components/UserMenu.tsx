import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, logout, isLoading, isAuthenticated } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Se não está autenticado, não mostrar nada
  if (!isAuthenticated) {
    return null;
  }

  // Se ainda está carregando, mostrar skeleton
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 p-2 rounded-lg">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="hidden md:block w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  // Se não há perfil, mostrar perfil padrão
  const displayProfile = profile || {
    name: 'Usuário',
    fitness_level: 'iniciante',
    avatar_url: null
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
          {displayProfile.avatar_url ? (
            <img
              src={displayProfile.avatar_url}
              alt={displayProfile.name}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                // Se a imagem falhar ao carregar, mostrar o ícone padrão
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
                }
              }}
            />
          ) : (
            <User size={16} className="text-white" />
          )}
        </div>
        <span className="hidden md:block font-medium text-gray-700 max-w-24 truncate">
          {displayProfile.name}
        </span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">{displayProfile.name}</p>
              <p className="text-xs text-gray-500 capitalize">Nível: {displayProfile.fitness_level}</p>
            </div>

            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} className="mr-2" />
              Meu Perfil
            </Link>

            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} className="mr-2" />
              Configurações
            </Link>

            <hr className="my-1" />

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Sair
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;