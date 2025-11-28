import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './UserMenu';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600' : 'text-slate-700';
  };

  const handleMobileLogout = () => {
    logout();
    toggleMenu();
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell size={28} className="text-blue-600" />
            <span className="text-xl font-bold">FitGPT</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-medium hover:text-blue-600 transition-colors ${isActive('/')}`}>
              Início
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/workouts" className={`font-medium hover:text-blue-600 transition-colors ${isActive('/workouts')}`}>
                  Treinos
                </Link>
                <Link to="/favorites" className={`font-medium hover:text-blue-600 transition-colors ${isActive('/favorites')}`}>
                  Favoritos
                </Link>
                <Link to="/schedule" className={`font-medium hover:text-blue-600 transition-colors ${isActive('/schedule')}`}>
                  Agenda
                </Link>
                <Link to="/gyms" className={`font-medium hover:text-blue-600 transition-colors ${isActive('/gyms')}`}>
                  Encontrar Academias
                </Link>
              </>
            )}
            <Link to="/about" className={`font-medium hover:text-blue-600 transition-colors ${isActive('/about')}`}>
              Sobre
            </Link>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Criar conta
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <button 
            className="md:hidden p-2 rounded-md focus:outline-none" 
            onClick={toggleMenu}
            aria-label="Alternar menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div 
            className="md:hidden py-4 space-y-4 border-t border-gray-100 mt-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" onClick={toggleMenu} className={`block font-medium hover:text-blue-600 transition-colors ${isActive('/')}`}>
              Início
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/workouts" onClick={toggleMenu} className={`block font-medium hover:text-blue-600 transition-colors ${isActive('/workouts')}`}>
                  Treinos
                </Link>
                <Link to="/favorites" onClick={toggleMenu} className={`block font-medium hover:text-blue-600 transition-colors ${isActive('/favorites')}`}>
                  Favoritos
                </Link>
                <Link to="/schedule" onClick={toggleMenu} className={`block font-medium hover:text-blue-600 transition-colors ${isActive('/schedule')}`}>
                  Agenda
                </Link>
                <Link to="/gyms" onClick={toggleMenu} className={`block font-medium hover:text-blue-600 transition-colors ${isActive('/gyms')}`}>
                  Encontrar Academias
                </Link>
              </>
            )}
            <Link to="/about" onClick={toggleMenu} className={`block font-medium hover:text-blue-600 transition-colors ${isActive('/about')}`}>
              Sobre
            </Link>
            
            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-100">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link to="/profile" onClick={toggleMenu} className="block font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    Meu Perfil
                  </Link>
                  <Link to="/settings" onClick={toggleMenu} className="block font-medium text-gray-700 hover:text-blue-600 transition-colors">
                    Configurações
                  </Link>
                  <button 
                    onClick={handleMobileLogout}
                    className="block w-full text-left font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={toggleMenu}
                    className="block px-4 py-2 text-center font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMenu}
                    className="block px-4 py-2 text-center font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Criar conta
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Navbar;