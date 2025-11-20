import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Trash2, 
  Download, 
  Upload,
  Moon,
  Sun,
  Globe,
  Smartphone,
  Save,
  AlertTriangle,
  CheckCircle,
  Loader,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWorkoutContext } from '../contexts/WorkoutContext';

const SettingsPage: React.FC = () => {
  const { clearAllData, isLoading } = useAuth();
  const { clearAllWorkoutData } = useWorkoutContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [isClearing, setIsClearing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState('');
  
  // Estados para configurações
  const [settings, setSettings] = useState({
    // Perfil
    notifications: {
      workoutReminders: true,
      weeklyProgress: true,
      achievements: true,
      emailNotifications: false
    },
    // Aparência
    theme: 'light',
    language: 'pt-BR',
    // Privacidade
    dataSharing: false,
    analytics: true,
    // Dados
    autoBackup: true,
    syncEnabled: true
  });

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleCompleteReset = async () => {
    if (!confirm('⚠️ RESET COMPLETO: Esta ação irá apagar TODOS os dados da aplicação, incluindo contas, treinos, favoritos, agenda e progresso. A aplicação será resetada para o estado inicial. Esta ação não pode ser desfeita. Tem certeza?')) {
      return;
    }

    if (!confirm('Última confirmação: TODOS os dados serão perdidos permanentemente e você será deslogado. A aplicação será completamente resetada. Continuar?')) {
      return;
    }

    setIsResetting(true);
    try {
      // Limpar dados de treinos primeiro
      clearAllWorkoutData();
      
      // Depois limpar dados de autenticação
      await clearAllData();
      
      setMessage('Reset completo realizado! A aplicação foi resetada para o estado inicial.');
      
      // Recarregar a página após um breve delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      setMessage('Erro ao realizar reset completo. Tente novamente.');
      console.error('Erro no reset:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleClearAllData = async () => {
    if (!confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODOS os seus dados pessoais, mas manterá os treinos padrão da aplicação. Tem certeza?')) {
      return;
    }

    setIsClearing(true);
    try {
      await clearAllData();
      setMessage('Todos os dados pessoais foram apagados com sucesso!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setMessage('Erro ao apagar dados. Tente novamente.');
    } finally {
      setIsClearing(false);
    }
  };

  const handleExportData = () => {
    try {
      const data = {
        workoutFavorites: localStorage.getItem('workoutFavorites'),
        workoutHistory: localStorage.getItem('workoutHistory'),
        workoutSchedule: localStorage.getItem('workoutSchedule'),
        userProgressStats: localStorage.getItem('userProgressStats'),
        fitgpt_session: localStorage.getItem('fitgpt_session'),
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitgpt-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage('Dados exportados com sucesso!');
    } catch (error) {
      setMessage('Erro ao exportar dados.');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.workoutFavorites) localStorage.setItem('workoutFavorites', data.workoutFavorites);
        if (data.workoutHistory) localStorage.setItem('workoutHistory', data.workoutHistory);
        if (data.workoutSchedule) localStorage.setItem('workoutSchedule', data.workoutSchedule);
        if (data.userProgressStats) localStorage.setItem('userProgressStats', data.userProgressStats);
        if (data.fitgpt_session) localStorage.setItem('fitgpt_session', data.fitgpt_session);

        setMessage('Dados importados com sucesso! Recarregue a página para ver as mudanças.');
      } catch (error) {
        setMessage('Erro ao importar dados. Arquivo inválido.');
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'appearance', label: 'Aparência', icon: Moon },
    { id: 'privacy', label: 'Privacidade', icon: Shield },
    { id: 'data', label: 'Dados', icon: Database },
    { id: 'danger', label: 'Zona Perigosa', icon: AlertTriangle }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="flex items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Settings className="w-8 h-8 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold">Configurações</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu Lateral */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                        : 'text-gray-700'
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="lg:col-span-3">
          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Mensagem de Status */}
            {message && (
              <motion.div
                className={`mb-6 p-3 rounded-lg text-center ${
                  message.includes('sucesso') || message.includes('exportados') || message.includes('Reset completo')
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message}
              </motion.div>
            )}

            {/* Tab: Perfil */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Configurações do Perfil</h2>
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Informações do Perfil</h3>
                    <p className="text-blue-700 text-sm">
                      Para editar suas informações pessoais, acesse a página de edição do perfil.
                    </p>
                    <a 
                      href="/edit-profile" 
                      className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Editar Perfil
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Notificações */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Notificações</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notificações Push</h3>
                    <div className="space-y-4">
                      {Object.entries(settings.notifications).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between">
                          <span className="text-gray-700">
                            {key === 'workoutReminders' && 'Lembretes de Treino'}
                            {key === 'weeklyProgress' && 'Progresso Semanal'}
                            {key === 'achievements' && 'Conquistas'}
                            {key === 'emailNotifications' && 'Notificações por Email'}
                          </span>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Aparência */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Aparência</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Tema</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleSettingChange('', 'theme', 'light')}
                        className={`p-4 border rounded-lg flex items-center justify-center ${
                          settings.theme === 'light' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                        }`}
                      >
                        <Sun className="mr-2" size={20} />
                        Claro
                      </button>
                      <button
                        onClick={() => handleSettingChange('', 'theme', 'dark')}
                        className={`p-4 border rounded-lg flex items-center justify-center ${
                          settings.theme === 'dark' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                        }`}
                      >
                        <Moon className="mr-2" size={20} />
                        Escuro
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Idioma</h3>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('', 'language', e.target.value)}
                      className="input-field"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Privacidade */}
            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Privacidade e Segurança</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Compartilhamento de Dados</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-gray-700">Compartilhar dados anônimos</span>
                          <p className="text-sm text-gray-500">Ajude a melhorar o app compartilhando dados anônimos de uso</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.dataSharing}
                          onChange={(e) => handleSettingChange('', 'dataSharing', e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="text-gray-700">Analytics</span>
                          <p className="text-sm text-gray-500">Permitir coleta de dados de uso para melhorias</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.analytics}
                          onChange={(e) => handleSettingChange('', 'analytics', e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Dados */}
            {activeTab === 'data' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Gerenciamento de Dados</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Backup e Sincronização</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Backup Automático</span>
                        <input
                          type="checkbox"
                          checked={settings.autoBackup}
                          onChange={(e) => handleSettingChange('', 'autoBackup', e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Sincronização Habilitada</span>
                        <input
                          type="checkbox"
                          checked={settings.syncEnabled}
                          onChange={(e) => handleSettingChange('', 'syncEnabled', e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Exportar/Importar Dados</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={handleExportData}
                        className="flex items-center justify-center p-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <Download className="mr-2" size={20} />
                        Exportar Dados
                      </button>
                      
                      <label className="flex items-center justify-center p-4 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors cursor-pointer">
                        <Upload className="mr-2" size={20} />
                        Importar Dados
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportData}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Zona Perigosa */}
            {activeTab === 'danger' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-red-600">Zona Perigosa</h2>
                <div className="space-y-6">
                  {/* Reset Completo */}
                  <div className="border border-red-300 rounded-lg p-6 bg-red-50">
                    <div className="flex items-start">
                      <RefreshCw className="text-red-600 mr-3 mt-1" size={24} />
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-red-900 mb-2">
                          Reset Completo da Aplicação
                        </h3>
                        <p className="text-red-700 text-sm mb-4">
                          Esta ação irá resetar completamente a aplicação para o estado inicial, removendo:
                        </p>
                        <ul className="text-red-700 text-sm mb-4 list-disc list-inside space-y-1">
                          <li>Todas as contas e sessões</li>
                          <li>Todos os dados pessoais</li>
                          <li>Histórico de treinos</li>
                          <li>Treinos favoritos</li>
                          <li>Agenda de treinos</li>
                          <li>Estatísticas de progresso</li>
                          <li>Todas as configurações</li>
                          <li>Cache e dados temporários</li>
                        </ul>
                        <p className="text-red-700 text-sm font-medium mb-4">
                          ⚠️ A aplicação será completamente resetada para o estado inicial!
                        </p>
                        <button
                          onClick={handleCompleteReset}
                          disabled={isResetting}
                          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center mr-4"
                        >
                          {isResetting ? (
                            <Loader className="w-5 h-5 animate-spin mr-2" />
                          ) : (
                            <RefreshCw className="w-5 h-5 mr-2" />
                          )}
                          {isResetting ? 'Resetando...' : 'Reset Completo'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Apagar Dados Pessoais */}
                  <div className="border border-orange-300 rounded-lg p-6 bg-orange-50">
                    <div className="flex items-start">
                      <AlertTriangle className="text-orange-600 mr-3 mt-1" size={24} />
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-orange-900 mb-2">
                          Apagar Apenas Dados Pessoais
                        </h3>
                        <p className="text-orange-700 text-sm mb-4">
                          Esta ação irá remover apenas seus dados pessoais, mantendo os treinos padrão:
                        </p>
                        <ul className="text-orange-700 text-sm mb-4 list-disc list-inside space-y-1">
                          <li>Perfil e informações pessoais</li>
                          <li>Histórico de treinos</li>
                          <li>Treinos favoritos</li>
                          <li>Agenda de treinos</li>
                          <li>Estatísticas de progresso</li>
                        </ul>
                        <p className="text-orange-700 text-sm font-medium mb-4">
                          ⚠️ Os treinos padrão da aplicação serão mantidos!
                        </p>
                        <button
                          onClick={handleClearAllData}
                          disabled={isClearing}
                          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                        >
                          {isClearing ? (
                            <Loader className="w-5 h-5 animate-spin mr-2" />
                          ) : (
                            <Trash2 className="w-5 h-5 mr-2" />
                          )}
                          {isClearing ? 'Apagando...' : 'Apagar Dados Pessoais'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botão Salvar (para tabs que não são danger) */}
            {activeTab !== 'danger' && activeTab !== 'profile' && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <Save className="w-5 h-5 mr-2" />
                  Salvar Configurações
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;