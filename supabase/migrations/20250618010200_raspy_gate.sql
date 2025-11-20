/*
  # Sistema de Progresso do Usuário

  1. Nova Tabela
    - `user_progress_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `week_start_date` (date)
      - `month_start_date` (date)
      - `weekly_workouts_completed` (integer)
      - `weekly_workouts_goal` (integer)
      - `monthly_workouts_completed` (integer)
      - `monthly_workouts_goal` (integer)
      - `total_workouts_completed` (integer)
      - `current_streak` (integer)
      - `longest_streak` (integer)
      - `total_minutes_exercised` (integer)
      - `total_calories_burned` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela
    - Políticas para usuários gerenciarem seus próprios dados

  3. Índices
    - Índices para melhor performance nas consultas
*/

-- Criar tabela de estatísticas de progresso do usuário
CREATE TABLE IF NOT EXISTS user_progress_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date date NOT NULL,
  month_start_date date NOT NULL,
  weekly_workouts_completed integer DEFAULT 0,
  weekly_workouts_goal integer DEFAULT 5,
  monthly_workouts_completed integer DEFAULT 0,
  monthly_workouts_goal integer DEFAULT 20,
  total_workouts_completed integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  total_minutes_exercised integer DEFAULT 0,
  total_calories_burned integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, week_start_date, month_start_date)
);

-- Habilitar Row Level Security
ALTER TABLE user_progress_stats ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can read own progress stats"
  ON user_progress_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress stats"
  ON user_progress_stats
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_progress_stats_user_id ON user_progress_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_stats_week ON user_progress_stats(week_start_date);
CREATE INDEX IF NOT EXISTS idx_user_progress_stats_month ON user_progress_stats(month_start_date);
CREATE INDEX IF NOT EXISTS idx_user_progress_stats_user_week ON user_progress_stats(user_id, week_start_date);
CREATE INDEX IF NOT EXISTS idx_user_progress_stats_user_month ON user_progress_stats(user_id, month_start_date);

-- Criar trigger para updated_at
CREATE TRIGGER update_user_progress_stats_updated_at 
  BEFORE UPDATE ON user_progress_stats 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular início da semana (segunda-feira)
CREATE OR REPLACE FUNCTION get_week_start_date(input_date date)
RETURNS date AS $$
BEGIN
  RETURN input_date - INTERVAL '1 day' * (EXTRACT(DOW FROM input_date) - 1);
END;
$$ LANGUAGE plpgsql;

-- Função para calcular início do mês
CREATE OR REPLACE FUNCTION get_month_start_date(input_date date)
RETURNS date AS $$
BEGIN
  RETURN date_trunc('month', input_date)::date;
END;
$$ LANGUAGE plpgsql;