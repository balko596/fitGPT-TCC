import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Configuração Supabase:', {
  url: supabaseUrl ? 'Configurada' : 'Não configurada',
  key: supabaseAnonKey ? 'Configurada' : 'Não configurada'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variáveis de ambiente do Supabase não encontradas. Usando modo offline.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
)

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && 
         supabaseAnonKey && 
         !supabaseUrl.includes('placeholder') && 
         supabaseAnonKey !== 'placeholder-key';
}

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          age: number | null
          height: number | null
          weight: number | null
          fitness_level: string
          goals: string[] | null
          preferred_workouts: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          avatar_url?: string | null
          age?: number | null
          height?: number | null
          weight?: number | null
          fitness_level?: string
          goals?: string[] | null
          preferred_workouts?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          age?: number | null
          height?: number | null
          weight?: number | null
          fitness_level?: string
          goals?: string[] | null
          preferred_workouts?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      workouts: {
        Row: {
          id: string
          name: string
          difficulty: string
          muscle_groups: string[]
          duration: string
          duration_minutes: number
          calories: number
          equipment: string[]
          exercises: any
          instructions: string | null
          is_custom: boolean | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          difficulty: string
          muscle_groups?: string[]
          duration: string
          duration_minutes: number
          calories: number
          equipment?: string[]
          exercises?: any
          instructions?: string | null
          is_custom?: boolean | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          difficulty?: string
          muscle_groups?: string[]
          duration?: string
          duration_minutes?: number
          calories?: number
          equipment?: string[]
          exercises?: any
          instructions?: string | null
          is_custom?: boolean | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          workout_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workout_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workout_id?: string
          created_at?: string
        }
      }
      user_workout_history: {
        Row: {
          id: string
          user_id: string
          workout_id: string
          completed_at: string
          duration_minutes: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          workout_id: string
          completed_at?: string
          duration_minutes?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          workout_id?: string
          completed_at?: string
          duration_minutes?: number | null
          notes?: string | null
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type WorkoutRow = Database['public']['Tables']['workouts']['Row']
export type UserFavorite = Database['public']['Tables']['user_favorites']['Row']
export type WorkoutHistory = Database['public']['Tables']['user_workout_history']['Row']

// Função para testar conexão
export const testConnection = async () => {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase não configurado, usando modo offline');
      return false;
    }

    console.log('Testando conexão com Supabase...');
    const { data, error } = await supabase.from('workouts').select('count').limit(1)
    
    if (error) {
      console.warn('Erro de conexão com Supabase:', error.message);
      return false;
    }
    
    console.log('Conexão com Supabase estabelecida com sucesso');
    return true;
  } catch (error) {
    console.warn('Erro ao testar conexão:', error);
    return false;
  }
}