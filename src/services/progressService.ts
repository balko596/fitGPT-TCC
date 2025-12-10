import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UserProgressStats {
  id: string;
  user_id: string;
  week_start_date: string;
  month_start_date: string;
  weekly_workouts_completed: number;
  weekly_workouts_goal: number;
  monthly_workouts_completed: number;
  monthly_workouts_goal: number;
  total_workouts_completed: number;
  current_streak: number;
  longest_streak: number;
  total_minutes_exercised: number;
  total_calories_burned: number;
  created_at: string;
  updated_at: string;
}

// Função para obter início da semana (segunda-feira)
const getWeekStartDate = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para segunda-feira
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
};

// Função para obter início do mês
const getMonthStartDate = (date: Date): string => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
};

// Função para buscar ou criar estatísticas do usuário
export const getUserProgressStats = async (): Promise<UserProgressStats | null> => {
  console.log('Carregando estatísticas de progresso...');
  
  try {
    // Se Supabase estiver configurado, usar Supabase
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('Usuário não autenticado');
        return null;
      }

      const now = new Date();
      const weekStart = getWeekStartDate(now);
      const monthStart = getMonthStartDate(now);

      // Buscar estatísticas atuais
      const { data: existingStats, error: fetchError } = await supabase
        .from('user_progress_stats')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStart)
        .eq('month_start_date', monthStart)
        .maybeSingle();

      if (fetchError) {
        console.warn('Erro ao buscar estatísticas do Supabase:', fetchError.message);
        return null;
      }

      if (existingStats) {
        console.log('Estatísticas encontradas no Supabase');
        return existingStats;
      }

      // Se não existir, criar novas estatísticas
      console.log('Criando novas estatísticas...');
      const { data: newStats, error: createError } = await supabase
        .from('user_progress_stats')
        .insert({
          user_id: user.id,
          week_start_date: weekStart,
          month_start_date: monthStart,
          weekly_workouts_completed: 0,
          weekly_workouts_goal: 5,
          monthly_workouts_completed: 0,
          monthly_workouts_goal: 20,
          total_workouts_completed: 0,
          current_streak: 0,
          longest_streak: 0,
          total_minutes_exercised: 0,
          total_calories_burned: 0
        })
        .select()
        .single();

      if (createError) {
        console.warn('Erro ao criar estatísticas no Supabase:', createError.message);
        return null;
      }

      console.log('Novas estatísticas criadas no Supabase');
      return newStats;
    } else {
      // Fallback para localStorage apenas se Supabase não estiver configurado
      console.log('Modo offline, usando localStorage');
      const savedStats = localStorage.getItem('userProgressStats');
      if (savedStats) {
        return JSON.parse(savedStats);
      }
      
      // Criar estatísticas padrão locais
      const now = new Date();
      const defaultStats: UserProgressStats = {
        id: 'local-stats',
        user_id: 'local-user',
        week_start_date: getWeekStartDate(now),
        month_start_date: getMonthStartDate(now),
        weekly_workouts_completed: 0,
        weekly_workouts_goal: 5,
        monthly_workouts_completed: 0,
        monthly_workouts_goal: 20,
        total_workouts_completed: 0,
        current_streak: 0,
        longest_streak: 0,
        total_minutes_exercised: 0,
        total_calories_burned: 0,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      };
      
      localStorage.setItem('userProgressStats', JSON.stringify(defaultStats));
      return defaultStats;
    }
  } catch (error) {
    console.warn('Erro ao carregar estatísticas:', error);
    return null;
  }
};

// Função para atualizar progresso após completar um treino
export const updateProgressAfterWorkout = async (
  durationMinutes: number = 0, 
  caloriesBurned: number = 0
): Promise<void> => {
  console.log('Atualizando progresso após treino...');
  
  try {
    // Se Supabase estiver configurado, usar Supabase
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('Usuário não autenticado');
        return;
      }

      const now = new Date();
      const weekStart = getWeekStartDate(now);
      const monthStart = getMonthStartDate(now);

      // Buscar estatísticas atuais
      let stats = await getUserProgressStats();
      
      if (!stats) {
        console.warn('Não foi possível obter estatísticas');
        return;
      }

      // Verificar se precisa resetar semana/mês
      const needsWeekReset = stats.week_start_date !== weekStart;
      const needsMonthReset = stats.month_start_date !== monthStart;

      if (needsWeekReset || needsMonthReset) {
        console.log('Resetando período...', { needsWeekReset, needsMonthReset });
        
        const { error: resetError } = await supabase
          .from('user_progress_stats')
          .insert({
            user_id: user.id,
            week_start_date: weekStart,
            month_start_date: monthStart,
            weekly_workouts_completed: 1,
            weekly_workouts_goal: stats.weekly_workouts_goal,
            monthly_workouts_completed: needsMonthReset ? 1 : stats.monthly_workouts_completed + 1,
            monthly_workouts_goal: stats.monthly_workouts_goal,
            total_workouts_completed: stats.total_workouts_completed + 1,
            current_streak: stats.current_streak + 1,
            longest_streak: Math.max(stats.longest_streak, stats.current_streak + 1),
            total_minutes_exercised: stats.total_minutes_exercised + durationMinutes,
            total_calories_burned: stats.total_calories_burned + caloriesBurned
          });

        if (resetError) {
          console.warn('Erro ao resetar período:', resetError.message);
        } else {
          console.log('Período resetado com sucesso');
        }
      } else {
        // Atualizar estatísticas existentes
        const { error: updateError } = await supabase
          .from('user_progress_stats')
          .update({
            weekly_workouts_completed: stats.weekly_workouts_completed + 1,
            monthly_workouts_completed: stats.monthly_workouts_completed + 1,
            total_workouts_completed: stats.total_workouts_completed + 1,
            current_streak: stats.current_streak + 1,
            longest_streak: Math.max(stats.longest_streak, stats.current_streak + 1),
            total_minutes_exercised: stats.total_minutes_exercised + durationMinutes,
            total_calories_burned: stats.total_calories_burned + caloriesBurned
          })
          .eq('id', stats.id);

        if (updateError) {
          console.warn('Erro ao atualizar progresso:', updateError.message);
        } else {
          console.log('Progresso atualizado com sucesso');
        }
      }
    } else {
      // Fallback para localStorage apenas se Supabase não estiver configurado
      console.log('Modo offline, atualizando localStorage');
      const savedStats = localStorage.getItem('userProgressStats');
      if (savedStats) {
        const stats: UserProgressStats = JSON.parse(savedStats);
        stats.weekly_workouts_completed += 1;
        stats.monthly_workouts_completed += 1;
        stats.total_workouts_completed += 1;
        stats.total_minutes_exercised += durationMinutes;
        stats.total_calories_burned += caloriesBurned;
        stats.current_streak += 1;
        stats.longest_streak = Math.max(stats.longest_streak, stats.current_streak);
        stats.updated_at = new Date().toISOString();
        
        localStorage.setItem('userProgressStats', JSON.stringify(stats));
        console.log('Progresso atualizado no localStorage');
      }
    }
  } catch (error) {
    console.warn('Erro ao atualizar progresso:', error);
  }
};

// Função para resetar progresso semanal
export const resetWeeklyProgress = async (): Promise<void> => {
  console.log('Resetando progresso semanal...');
  
  try {
    // Se Supabase estiver configurado, usar Supabase
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('Usuário não autenticado');
        return;
      }

      const stats = await getUserProgressStats();
      if (!stats) return;

      const { error } = await supabase
        .from('user_progress_stats')
        .update({
          weekly_workouts_completed: 0,
          week_start_date: getWeekStartDate(new Date())
        })
        .eq('id', stats.id);

      if (error) {
        console.warn('Erro ao resetar progresso semanal:', error.message);
        throw new Error('Erro ao resetar progresso semanal');
      } else {
        console.log('Progresso semanal resetado com sucesso');
      }
    } else {
      // Fallback para localStorage apenas se Supabase não estiver configurado
      console.log('Modo offline, resetando localStorage');
      const savedStats = localStorage.getItem('userProgressStats');
      if (savedStats) {
        const stats: UserProgressStats = JSON.parse(savedStats);
        stats.weekly_workouts_completed = 0;
        stats.week_start_date = getWeekStartDate(new Date());
        stats.updated_at = new Date().toISOString();
        
        localStorage.setItem('userProgressStats', JSON.stringify(stats));
        console.log('Progresso semanal resetado no localStorage');
      }
    }
  } catch (error) {
    console.warn('Erro ao resetar progresso semanal:', error);
    throw error;
  }
};

// Função para resetar progresso mensal
export const resetMonthlyProgress = async (): Promise<void> => {
  console.log('Resetando progresso mensal...');
  
  try {
    // Se Supabase estiver configurado, usar Supabase
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('Usuário não autenticado');
        return;
      }

      const stats = await getUserProgressStats();
      if (!stats) return;

      const { error } = await supabase
        .from('user_progress_stats')
        .update({
          monthly_workouts_completed: 0,
          month_start_date: getMonthStartDate(new Date())
        })
        .eq('id', stats.id);

      if (error) {
        console.warn('Erro ao resetar progresso mensal:', error.message);
        throw new Error('Erro ao resetar progresso mensal');
      } else {
        console.log('Progresso mensal resetado com sucesso');
      }
    } else {
      // Fallback para localStorage apenas se Supabase não estiver configurado
      console.log('Modo offline, resetando localStorage');
      const savedStats = localStorage.getItem('userProgressStats');
      if (savedStats) {
        const stats: UserProgressStats = JSON.parse(savedStats);
        stats.monthly_workouts_completed = 0;
        stats.month_start_date = getMonthStartDate(new Date());
        stats.updated_at = new Date().toISOString();
        
        localStorage.setItem('userProgressStats', JSON.stringify(stats));
        console.log('Progresso mensal resetado no localStorage');
      }
    }
  } catch (error) {
    console.warn('Erro ao resetar progresso mensal:', error);
    throw error;
  }
};

// Função para atualizar metas
export const updateGoals = async (weeklyGoal: number, monthlyGoal: number): Promise<void> => {
  console.log('Atualizando metas...', { weeklyGoal, monthlyGoal });
  
  try {
    // Se Supabase estiver configurado, usar Supabase
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('Usuário não autenticado');
        return;
      }

      const stats = await getUserProgressStats();
      if (!stats) return;

      const { error } = await supabase
        .from('user_progress_stats')
        .update({
          weekly_workouts_goal: weeklyGoal,
          monthly_workouts_goal: monthlyGoal
        })
        .eq('id', stats.id);

      if (error) {
        console.warn('Erro ao atualizar metas:', error.message);
        throw new Error('Erro ao atualizar metas');
      } else {
        console.log('Metas atualizadas com sucesso');
      }
    } else {
      // Fallback para localStorage apenas se Supabase não estiver configurado
      console.log('Modo offline, atualizando localStorage');
      const savedStats = localStorage.getItem('userProgressStats');
      if (savedStats) {
        const stats: UserProgressStats = JSON.parse(savedStats);
        stats.weekly_workouts_goal = weeklyGoal;
        stats.monthly_workouts_goal = monthlyGoal;
        stats.updated_at = new Date().toISOString();
        
        localStorage.setItem('userProgressStats', JSON.stringify(stats));
        console.log('Metas atualizadas no localStorage');
      }
    }
  } catch (error) {
    console.warn('Erro ao atualizar metas:', error);
    throw error;
  }
};

// Função para resetar streak (sequência)
export const resetStreak = async (): Promise<void> => {
  console.log('Resetando sequência...');
  
  try {
    // Se Supabase estiver configurado, usar Supabase
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('Usuário não autenticado');
        return;
      }

      const stats = await getUserProgressStats();
      if (!stats) return;

      const { error } = await supabase
        .from('user_progress_stats')
        .update({
          current_streak: 0
        })
        .eq('id', stats.id);

      if (error) {
        console.warn('Erro ao resetar sequência:', error.message);
        throw new Error('Erro ao resetar sequência');
      } else {
        console.log('Sequência resetada com sucesso');
      }
    } else {
      // Fallback para localStorage apenas se Supabase não estiver configurado
      console.log('Modo offline, resetando localStorage');
      const savedStats = localStorage.getItem('userProgressStats');
      if (savedStats) {
        const stats: UserProgressStats = JSON.parse(savedStats);
        stats.current_streak = 0;
        stats.updated_at = new Date().toISOString();
        
        localStorage.setItem('userProgressStats', JSON.stringify(stats));
        console.log('Sequência resetada no localStorage');
      }
    }
  } catch (error) {
    console.warn('Erro ao resetar sequência:', error);
    throw error;
  }
};