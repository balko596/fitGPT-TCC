/*
  # Adicionar tabela de agendamento de treinos

  1. Nova Tabela
    - `user_workout_schedule`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `workout_id` (uuid, references workouts)
      - `scheduled_date` (date)
      - `scheduled_time` (time, optional)
      - `notes` (text, optional)
      - `completed` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Habilitar RLS na tabela
    - Adicionar políticas para usuários autenticados gerenciarem seus próprios agendamentos

  3. Índices
    - Índice para user_id
    - Índice para scheduled_date
    - Índice composto para user_id e scheduled_date
*/

-- Criar tabela de agendamento de treinos
CREATE TABLE IF NOT EXISTS user_workout_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id uuid NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  scheduled_date date NOT NULL,
  scheduled_time time,
  notes text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE user_workout_schedule ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can read own schedule"
  ON user_workout_schedule
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own schedule"
  ON user_workout_schedule
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_workout_schedule_user_id ON user_workout_schedule(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workout_schedule_date ON user_workout_schedule(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_user_workout_schedule_user_date ON user_workout_schedule(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_user_workout_schedule_workout_id ON user_workout_schedule(workout_id);

-- Criar trigger para updated_at
CREATE TRIGGER update_user_workout_schedule_updated_at 
  BEFORE UPDATE ON user_workout_schedule 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();