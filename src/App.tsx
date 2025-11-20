import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader } from 'lucide-react';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { AuthProvider } from './contexts/AuthContext';

// Lazy loading dos componentes para melhor performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const WorkoutsPage = React.lazy(() => import('./pages/WorkoutsPage'));
const WorkoutDetailsPage = React.lazy(() => import('./pages/WorkoutDetailsPage'));
const FavoritesPage = React.lazy(() => import('./pages/FavoritesPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const SchedulePage = React.lazy(() => import('./pages/SchedulePage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const EditProfilePage = React.lazy(() => import('./pages/EditProfilePage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const GymFinderPage = React.lazy(() => import('./pages/GymFinderPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const SupabaseSetupPage = React.lazy(() => import('./pages/SupabaseSetupPage'));

// Componente de loading
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
      <p className="text-slate-600">Carregando...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <WorkoutProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Rotas de autenticação sem layout */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Rota de configuração do Supabase sem layout */}
              <Route path="/supabase-setup" element={<SupabaseSetupPage />} />
              
              {/* Rotas com layout */}
              <Route path="/" element={
                <Layout>
                  <HomePage />
                </Layout>
              } />
              
              <Route path="/workouts" element={
                <Layout>
                  <WorkoutsPage />
                </Layout>
              } />
              
              <Route path="/workout/:id" element={
                <Layout>
                  <WorkoutDetailsPage />
                </Layout>
              } />
              
              <Route path="/about" element={
                <Layout>
                  <AboutPage />
                </Layout>
              } />
              
              <Route path="/gyms" element={
                <Layout>
                  <GymFinderPage />
                </Layout>
              } />
              
              {/* Rotas protegidas com layout */}
              <Route path="/favorites" element={
                <Layout>
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                </Layout>
              } />
              
              <Route path="/schedule" element={
                <Layout>
                  <ProtectedRoute>
                    <SchedulePage />
                  </ProtectedRoute>
                </Layout>
              } />
              
              <Route path="/profile" element={
                <Layout>
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                </Layout>
              } />
              
              <Route path="/edit-profile" element={
                <Layout>
                  <ProtectedRoute>
                    <EditProfilePage />
                  </ProtectedRoute>
                </Layout>
              } />

              <Route path="/settings" element={
                <Layout>
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                </Layout>
              } />

              {/* Rota 404 */}
              <Route path="*" element={
                <Layout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600 mb-8">Página não encontrada</p>
                      <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        Voltar ao Início
                      </a>
                    </div>
                  </div>
                </Layout>
              } />
            </Routes>
          </Suspense>
        </Router>
      </WorkoutProvider>
    </AuthProvider>
  );
}

export default App;