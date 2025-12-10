import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Profile, isSupabaseConfigured } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextProps {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  clearAllData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  profile: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  clearAllData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Dados de teste para fallback APENAS quando Supabase não estiver configurado
const testUsers = [
  {
    id: 'test-user-1',
    email: 'teste@fitgpt.com',
    password: '123456',
    profile: {
      id: 'test-user-1',
      name: 'Usuário Teste',
      avatar_url: 'https://ui-avatars.com/api/?name=Usuario+Teste&background=3B82F6&color=fff',
      age: 25,
      height: 175,
      weight: 70,
      fitness_level: 'intermediário',
      goals: ['Ganhar Massa', 'Melhorar Força'],
      preferred_workouts: ['Musculação', 'HIIT'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthContext: Inicializando...');
    
    // Se Supabase estiver configurado, usar apenas Supabase
    if (isSupabaseConfigured()) {
      console.log('Supabase configurado, usando autenticação do Supabase');
      initializeSupabaseAuth();
    } else {
      console.log('Supabase não configurado, usando modo offline com dados de teste');
      initializeOfflineAuth();
    }
  }, []);

  const clearInvalidSession = async () => {
    console.log('Limpando sessão inválida...');
    
    // Limpar estado local
    setUser(null);
    setProfile(null);
    setSession(null);
    
    // Limpar dados locais do Supabase
    localStorage.removeItem('sb-' + supabase.supabaseUrl.split('//')[1].split('.')[0] + '-auth-token');
    localStorage.removeItem('fitgpt_session');
    
    // Tentar fazer logout silencioso do Supabase para limpar qualquer estado residual
    try {
      await supabase.auth.signOut({ scope: 'local' });
    } catch (error) {
      console.warn('Erro ao fazer logout silencioso:', error);
    }
  };

  const initializeSupabaseAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn('Erro ao obter sessão do Supabase:', error);
        
        // Se o erro for relacionado a refresh token inválido, limpar a sessão
        if (error.message?.includes('refresh_token_not_found') || 
            error.message?.includes('Invalid Refresh Token') ||
            error.message?.includes('Refresh Token Not Found')) {
          console.log('Token de refresh inválido detectado, limpando sessão...');
          await clearInvalidSession();
        }
        
        setIsLoading(false);
        return;
      }
      
      console.log('Sessão do Supabase:', !!session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }

      // Escutar mudanças de autenticação
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event, !!session);
        
        // Se houver erro de token, limpar sessão
        if (event === 'TOKEN_REFRESHED' && !session) {
          console.log('Falha na renovação do token, limpando sessão...');
          await clearInvalidSession();
          setIsLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setError(null);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.warn('Erro de conexão com Supabase:', error);
      
      // Se o erro for relacionado a refresh token, limpar sessão
      if (error instanceof Error && 
          (error.message?.includes('refresh_token_not_found') || 
           error.message?.includes('Invalid Refresh Token') ||
           error.message?.includes('Refresh Token Not Found'))) {
        console.log('Erro de refresh token na inicialização, limpando sessão...');
        await clearInvalidSession();
      }
      
      setIsLoading(false);
    }
  };

  const initializeOfflineAuth = () => {
    // Verificar se há sessão salva localmente (fallback)
    const savedSession = localStorage.getItem('fitgpt_session');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        console.log('Sessão local encontrada');
        setUser(sessionData.user);
        setProfile(sessionData.profile);
        setSession(sessionData.session);
      } catch (error) {
        console.warn('Erro ao carregar sessão local:', error);
        localStorage.removeItem('fitgpt_session');
      }
    }
    setIsLoading(false);
  };

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Carregando perfil do usuário:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Erro ao carregar perfil do Supabase:', error);
      } else if (data) {
        console.log('Perfil carregado do Supabase');
        setProfile(data);
      }
    } catch (error) {
      console.warn('Erro ao carregar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Se Supabase estiver configurado, usar apenas Supabase
      if (isSupabaseConfigured()) {
        console.log('Fazendo login no Supabase...');
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          console.warn('Erro no login do Supabase:', error.message);
          
          // Se o erro for relacionado a refresh token, limpar sessão antes de tentar novamente
          if (error.message?.includes('refresh_token_not_found') || 
              error.message?.includes('Invalid Refresh Token') ||
              error.message?.includes('Refresh Token Not Found')) {
            console.log('Erro de refresh token no login, limpando sessão...');
            await clearInvalidSession();
          }
          
          throw new Error('Email ou senha incorretos');
        }
        
        if (data.user) {
          console.log('Login no Supabase realizado com sucesso');
          // O perfil será carregado automaticamente pelo onAuthStateChange
          return;
        }
        
        throw new Error('Erro inesperado no login');
      }
      
      // Fallback para dados de teste apenas se Supabase não estiver configurado
      console.log('Usando credenciais de teste (modo offline)...');
      const testUser = testUsers.find(u => u.email === email && u.password === password);
      
      if (testUser) {
        // Simular sessão local
        const mockSession = {
          user: {
            id: testUser.id,
            email: testUser.email,
            created_at: new Date().toISOString(),
          },
          session: {
            access_token: 'mock-token',
            refresh_token: 'mock-refresh',
            expires_at: Date.now() + 3600000, // 1 hora
          },
          profile: testUser.profile
        };
        
        setUser(mockSession.user as any);
        setProfile(testUser.profile);
        setSession(mockSession.session as any);
        
        // Salvar sessão localmente
        localStorage.setItem('fitgpt_session', JSON.stringify(mockSession));
        
        console.log('Login com dados de teste realizado');
        return;
      }
      
      throw new Error('Email ou senha incorretos');
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Se Supabase estiver configurado, usar apenas Supabase
      if (isSupabaseConfigured()) {
        console.log('Registrando no Supabase...');
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name
            }
          }
        });
        
        if (error) {
          console.warn('Erro no registro do Supabase:', error.message);
          throw new Error(error.message);
        }
        
        if (data.user) {
          console.log('Registro no Supabase realizado');
          
          // O perfil será criado automaticamente pelo trigger
          // Aguardar um pouco para o trigger executar
          setTimeout(async () => {
            if (data.user) {
              await loadUserProfile(data.user.id);
            }
          }, 1000);
          
          return;
        }
        
        throw new Error('Erro inesperado no registro');
      }
      
      // Fallback para criação local apenas se Supabase não estiver configurado
      console.log('Criando conta local de teste (modo offline)...');
      
      const newUserId = `test-user-${Date.now()}`;
      const newUser = {
        id: newUserId,
        email,
        password,
        profile: {
          id: newUserId,
          name,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff`,
          age: null,
          height: null,
          weight: null,
          fitness_level: 'iniciante',
          goals: [],
          preferred_workouts: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
      
      // Adicionar aos usuários de teste
      testUsers.push(newUser);
      
      // Simular login automático
      const mockSession = {
        user: {
          id: newUser.id,
          email: newUser.email,
          created_at: new Date().toISOString(),
        },
        session: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          expires_at: Date.now() + 3600000,
        },
        profile: newUser.profile
      };
      
      setUser(mockSession.user as any);
      setProfile(newUser.profile);
      setSession(mockSession.session as any);
      
      localStorage.setItem('fitgpt_session', JSON.stringify(mockSession));
      
      console.log('Conta local criada com sucesso');
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao criar conta');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('Fazendo logout...');
      
      // Se Supabase estiver configurado, fazer logout do Supabase
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.warn('Erro no logout do Supabase:', error);
        }
      }
      
      // Limpar estado local
      setUser(null);
      setProfile(null);
      setSession(null);
      localStorage.removeItem('fitgpt_session');
      
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.warn('Erro ao fazer logout:', error);
      // Mesmo com erro, limpar estado local
      setUser(null);
      setProfile(null);
      setSession(null);
      localStorage.removeItem('fitgpt_session');
    }
  };

  const updateProfile = async (data: Partial<Profile>): Promise<void> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Atualizando perfil...', data);
      
      // Preparar dados para atualização
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      };
      
      let updatedProfile: Profile;
      
      // Se Supabase estiver configurado, tentar atualizar no Supabase
      if (isSupabaseConfigured()) {
        console.log('Atualizando perfil no Supabase...');
        
        const { data: supabaseData, error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id)
          .select()
          .single();
        
        if (error) {
          console.warn('Erro ao atualizar perfil no Supabase:', error?.message);
          throw new Error('Erro ao atualizar perfil no banco de dados');
        }
        
        if (supabaseData) {
          console.log('Perfil atualizado no Supabase');
          updatedProfile = supabaseData;
        } else {
          throw new Error('Nenhum dado retornado do Supabase');
        }
      } else {
        // Fallback para atualização local apenas se Supabase não estiver configurado
        console.log('Atualizando perfil localmente (modo offline)...');
        updatedProfile = { ...profile, ...updateData } as Profile;
        
        // Atualizar usuário de teste se for o caso
        const testUserIndex = testUsers.findIndex(u => u.id === user.id);
        if (testUserIndex !== -1) {
          testUsers[testUserIndex].profile = updatedProfile;
        }
      }
      
      // Atualizar estado local
      setProfile(updatedProfile);
      
      // Atualizar sessão salva localmente
      const savedSession = localStorage.getItem('fitgpt_session');
      if (savedSession) {
        try {
          const sessionData = JSON.parse(savedSession);
          sessionData.profile = updatedProfile;
          localStorage.setItem('fitgpt_session', JSON.stringify(sessionData));
          console.log('Sessão local atualizada com novo perfil');
        } catch (error) {
          console.warn('Erro ao atualizar sessão local:', error);
        }
      }
      
      console.log('Perfil atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('Erro ao atualizar perfil');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllData = async (): Promise<void> => {
    try {
      console.log('Limpando todos os dados...');
      
      // Fazer logout se estiver autenticado
      if (isAuthenticated) {
        await logout();
      }
      
      // Limpar todos os dados locais
      localStorage.clear();
      sessionStorage.clear();
      
      // Limpar cookies se necessário
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      
      // Resetar estado
      setUser(null);
      setProfile(null);
      setSession(null);
      setError(null);
      
      console.log('Todos os dados foram limpos');
    } catch (error) {
      console.warn('Erro ao limpar dados:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        clearAllData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};