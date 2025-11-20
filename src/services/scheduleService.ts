import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface ScheduleEntry {
  id: string;
  user_id: string;
  workout_id: string;
  scheduled_date: string;
  scheduled_time?: string;
  notes?: string;
  completed: boolean;
  created_at: string;
  workout?: {
    name: string;
    duration: string;
    difficulty: string;
  };
}

// Função para salvar agendamento
export const saveScheduleEntry = async (
  workoutId: string, 
  scheduledDate: string, 
  scheduledTime?: string, 
  notes?: string
): Promise<ScheduleEntry> => {
  console.log('📅 Salvando agendamento:', { workoutId, scheduledDate, scheduledTime });
  
  try {
    // Se Supabase estiver configurado, usar Supabase
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('user_workout_schedule')
        .insert({
          user_id: user.id,
          workout_id: workoutId,
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          notes: notes
        })
        .select()
        .single();

      if (error) {
        console.warn('⚠️ Erro ao salvar agendamento no Supabase:', error.message);
        throw new Error('Erro ao salvar agendamento');
      }

      console.log('✅ Agendamento salvo no Supabase');
      return data;
    } else {
      // Fallback para localStorage apenas se Supabase não estiver configurado
      console.log('👤 Modo offline, salvando no localStorage');
      const savedSchedule = localStorage.getItem('workoutSchedule');
      let schedule: ScheduleEntry[] = savedSchedule ? JSON.parse(savedSchedule) : [];
      
      const newEntry: ScheduleEntry = {
        id: Date.now().toString(),
        user_id: 'local-user',
        workout_id: workoutId,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        notes: notes,
        completed: false,
        created_at: new Date().toISOString()
      };
      
      schedule.push(newEntry);
      localStorage.setItem('workoutSchedule', JSON.stringify(schedule));
      console.log('✅ Agendamento salvo no localStorage');
      return newEntry;
    }
  } catch (error) {
    console.warn('⚠️ Erro ao salvar agendamento:', error);
    throw error;
  }
};

// Função para buscar agendamentos
export const fetchScheduleEntries = async (startDate?: string, endDate?: string): Promise<ScheduleEntry[]> => {
  console.log('📅 Carregando agendamentos...');
  
  try {
    // Se Supabase estiver configurado, usar Supabase
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('👤 Usuário não autenticado');
        return [];
      }

      let query = supabase
        .from('user_workout_schedule')
        .select(`
          *,
          workouts (
            name,
            duration,
            difficulty
          )
        `)
        .eq('user_id', user.id);

      if (startDate && endDate) {
        query = query.gte('scheduled_date', startDate).lte('scheduled_date', endDate);
      }

      const { data, error } = await query.order('scheduled_date', { ascending: true });

      if (error) {
        console.warn('⚠️ Erro ao buscar agendamentos do Supabase:', error.message);
        return [];
      }

      console.log('✅ Agendamentos carregados do Supabase:', data?.length || 0);
      return data || [];
    } else {
      // Fallback para localStorage apenas se Supabase não estiver configurado
      console.log('👤 Modo offline, usando localStorage');
      const savedSchedule = localStorage.getItem('workoutSchedule');
      let schedule: ScheduleEntry[] = savedSchedule ? JSON.parse(savedSchedule) : [];
      
      // Filtrar por data se especificado
      if (startDate && endDate) {
        schedule = schedule.filter(entry => 
          entry.scheduled_date >= startDate && entry.scheduled_date <= endDate
        );
      }
      
      return schedule;
    }
  } catch (error) {
    console.warn('⚠️ Erro ao carregar agendamentos:', error);
    return [];
  }
};

// Função para marcar agendamento como concluído
export const markScheduleEntryCompleted = async (entryId: string): Promise<void> => {
  console.log('✅ Marcando agendamento como concluído:', entryId);
  
  try {
    // Se Supabase estiver configurado, usar Supabase
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('user_workout_schedule')
        .update({ completed: true })
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (error) {
        console.warn('⚠️ Erro ao atualizar agendamento no Supabase:', error.message);
        throw new Error('Erro ao atualizar agendamento');
      }
      
      console.log('✅ Agendamento atualizado no Supabase');
    } else {
      // Fallback para localStorage apenas se Supabase não estiver configurado
      console.log('👤 Modo offline, atualizando localStorage');
      const savedSchedule = localStorage.getItem('workoutSchedule');
      let schedule: ScheduleEntry[] = savedSchedule ? JSON.parse(savedSchedule) : [];
      
      schedule = schedule.map(entry => 
        entry.id === entryId ? { ...entry, completed: true } : entry
      );
      
      localStorage.setItem('workoutSchedule', JSON.stringify(schedule));
      console.log('✅ Agendamento atualizado no localStorage');
    }
  } catch (error) {
    console.warn('⚠️ Erro ao atualizar agendamento:', error);
    throw error;
  }
};

// Função para remover agendamento
export const removeScheduleEntry = async (entryId: string): Promise<void> => {
  console.log('🗑️ Removendo agendamento:', entryId);
  
  try {
    // Se Supabase estiver configurado, usar Supabase
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('user_workout_schedule')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (error) {
        console.warn('⚠️ Erro ao remover agendamento do Supabase:', error.message);
        throw new Error('Erro ao remover agendamento');
      }
      
      console.log('✅ Agendamento removido do Supabase');
    } else {
      // Fallback para localStorage apenas se Supabase não estiver configurado
      console.log('👤 Modo offline, removendo do localStorage');
      const savedSchedule = localStorage.getItem('workoutSchedule');
      let schedule: ScheduleEntry[] = savedSchedule ? JSON.parse(savedSchedule) : [];
      
      schedule = schedule.filter(entry => entry.id !== entryId);
      localStorage.setItem('workoutSchedule', JSON.stringify(schedule));
      console.log('✅ Agendamento removido do localStorage');
    }
  } catch (error) {
    console.warn('⚠️ Erro ao remover agendamento:', error);
    throw error;
  }
};