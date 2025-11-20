/*
  # Create workout application database schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `avatar_url` (text, optional)
      - `age` (integer, optional)
      - `height` (integer, optional)
      - `weight` (integer, optional)
      - `fitness_level` (text)
      - `goals` (text array)
      - `preferred_workouts` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `workouts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `difficulty` (text)
      - `muscle_groups` (text array)
      - `duration` (text)
      - `duration_minutes` (integer)
      - `calories` (integer)
      - `equipment` (text array)
      - `exercises` (jsonb)
      - `instructions` (text, optional)
      - `is_custom` (boolean)
      - `created_by` (uuid, optional, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `workout_id` (uuid, references workouts)
      - `created_at` (timestamp)
    
    - `user_workout_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `workout_id` (uuid, references workouts)
      - `completed_at` (timestamp)
      - `duration_minutes` (integer, optional)
      - `notes` (text, optional)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Allow public read access to workouts table
    - Allow authenticated users to create custom workouts

  3. Sample Data
    - Insert some sample workouts to get started
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text,
  age integer,
  height integer,
  weight integer,
  fitness_level text NOT NULL DEFAULT 'beginner',
  goals text[] DEFAULT '{}',
  preferred_workouts text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  difficulty text NOT NULL,
  muscle_groups text[] NOT NULL DEFAULT '{}',
  duration text NOT NULL,
  duration_minutes integer NOT NULL,
  calories integer NOT NULL,
  equipment text[] NOT NULL DEFAULT '{}',
  exercises jsonb NOT NULL DEFAULT '[]',
  instructions text,
  is_custom boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id uuid NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, workout_id)
);

-- Create user_workout_history table
CREATE TABLE IF NOT EXISTS user_workout_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id uuid NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now() NOT NULL,
  duration_minutes integer,
  notes text
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workout_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Workouts policies
CREATE POLICY "Anyone can read workouts"
  ON workouts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create custom workouts"
  ON workouts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own custom workouts"
  ON workouts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own custom workouts"
  ON workouts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- User favorites policies
CREATE POLICY "Users can read own favorites"
  ON user_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites"
  ON user_favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- User workout history policies
CREATE POLICY "Users can read own workout history"
  ON user_workout_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own workout history"
  ON user_workout_history
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workouts_difficulty ON workouts(difficulty);
CREATE INDEX IF NOT EXISTS idx_workouts_muscle_groups ON workouts USING GIN(muscle_groups);
CREATE INDEX IF NOT EXISTS idx_workouts_equipment ON workouts USING GIN(equipment);
CREATE INDEX IF NOT EXISTS idx_workouts_created_by ON workouts(created_by);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_workout_id ON user_favorites(workout_id);
CREATE INDEX IF NOT EXISTS idx_user_workout_history_user_id ON user_workout_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workout_history_workout_id ON user_workout_history(workout_id);

-- Insert sample workouts
INSERT INTO workouts (name, difficulty, muscle_groups, duration, duration_minutes, calories, equipment, exercises, instructions, is_custom) VALUES
(
  'Treino de Força Completo',
  'Intermediário',
  ARRAY['Peito', 'Costas', 'Pernas', 'Ombros'],
  '45 min',
  45,
  350,
  ARRAY['Halteres', 'Barra'],
  '[
    {
      "name": "Supino com Halteres",
      "sets": 4,
      "reps": "8-10",
      "restTime": "90 seg",
      "instructions": "Deite-se no banco e execute o movimento controlado, focando na contração do peitoral.",
      "imageUrl": "https://images.pexels.com/photos/4162582/pexels-photo-4162582.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Remada Curvada",
      "sets": 4,
      "reps": "8-10",
      "restTime": "90 seg",
      "instructions": "Mantenha as costas retas e puxe a barra em direção ao abdômen.",
      "imageUrl": "https://images.pexels.com/photos/4162498/pexels-photo-4162498.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Agachamento",
      "sets": 4,
      "reps": "10-12",
      "restTime": "2 min",
      "instructions": "Desça até os quadris ficarem paralelos ao chão, mantendo o peso nos calcanhares.",
      "imageUrl": "https://images.pexels.com/photos/4162589/pexels-photo-4162589.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Desenvolvimento com Halteres",
      "sets": 3,
      "reps": "10-12",
      "restTime": "75 seg",
      "instructions": "Pressione os halteres acima da cabeça, mantendo o core contraído.",
      "imageUrl": "https://images.pexels.com/photos/3823189/pexels-photo-3823189.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ]'::jsonb,
  'Treino completo focado no desenvolvimento de força em todos os grupos musculares principais. Execute com carga adequada e forme perfeita.',
  false
),
(
  'HIIT Cardio Intenso',
  'Avançado',
  ARRAY['Cardio', 'Core'],
  '25 min',
  25,
  300,
  ARRAY['Peso corporal'],
  '[
    {
      "name": "Burpees",
      "sets": 4,
      "reps": "30 seg",
      "restTime": "30 seg",
      "instructions": "Execute o movimento completo: agachamento, prancha, flexão, salto.",
      "imageUrl": "https://images.pexels.com/photos/4162582/pexels-photo-4162582.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Mountain Climbers",
      "sets": 4,
      "reps": "30 seg",
      "restTime": "30 seg",
      "instructions": "Alterne as pernas rapidamente mantendo a posição de prancha.",
      "imageUrl": "https://images.pexels.com/photos/4162498/pexels-photo-4162498.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Jump Squats",
      "sets": 4,
      "reps": "30 seg",
      "restTime": "30 seg",
      "instructions": "Agache e salte explosivamente, aterrissando suavemente.",
      "imageUrl": "https://images.pexels.com/photos/4162589/pexels-photo-4162589.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Prancha Dinâmica",
      "sets": 4,
      "reps": "30 seg",
      "restTime": "30 seg",
      "instructions": "Alterne entre prancha alta e baixa mantendo o core contraído.",
      "imageUrl": "https://images.pexels.com/photos/3823189/pexels-photo-3823189.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ]'::jsonb,
  'Treino HIIT de alta intensidade para queima de gordura e condicionamento cardiovascular. Mantenha a intensidade alta durante os intervalos de trabalho.',
  false
),
(
  'Yoga Flow Relaxante',
  'Iniciante',
  ARRAY['Flexibilidade', 'Core'],
  '30 min',
  30,
  150,
  ARRAY['Tapete de yoga'],
  '[
    {
      "name": "Saudação ao Sol",
      "sets": 3,
      "reps": "5 respirações",
      "restTime": "30 seg",
      "instructions": "Flua através das posições sincronizando com a respiração.",
      "imageUrl": "https://images.pexels.com/photos/4162582/pexels-photo-4162582.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Guerreiro I",
      "sets": 2,
      "reps": "5 respirações cada lado",
      "restTime": "15 seg",
      "instructions": "Mantenha a posição com força e equilíbrio, respirando profundamente.",
      "imageUrl": "https://images.pexels.com/photos/4162498/pexels-photo-4162498.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Cachorro Olhando para Baixo",
      "sets": 3,
      "reps": "8 respirações",
      "restTime": "30 seg",
      "instructions": "Alongue a coluna e fortaleça braços e ombros.",
      "imageUrl": "https://images.pexels.com/photos/4162589/pexels-photo-4162589.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Posição da Criança",
      "sets": 1,
      "reps": "10 respirações",
      "restTime": "0",
      "instructions": "Relaxe completamente e foque na respiração profunda.",
      "imageUrl": "https://images.pexels.com/photos/3823189/pexels-photo-3823189.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ]'::jsonb,
  'Sequência de yoga suave para relaxamento, flexibilidade e conexão mente-corpo. Foque na respiração e nos movimentos fluidos.',
  false
),
(
  'Treino de Braços e Ombros',
  'Intermediário',
  ARRAY['Braços', 'Ombros'],
  '35 min',
  35,
  250,
  ARRAY['Halteres', 'Cabo'],
  '[
    {
      "name": "Rosca Bíceps",
      "sets": 4,
      "reps": "10-12",
      "restTime": "60 seg",
      "instructions": "Contraia o bíceps no topo do movimento, descendo controladamente.",
      "imageUrl": "https://images.pexels.com/photos/4162582/pexels-photo-4162582.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Tríceps Testa",
      "sets": 4,
      "reps": "10-12",
      "restTime": "60 seg",
      "instructions": "Mantenha os cotovelos fixos e estenda apenas o antebraço.",
      "imageUrl": "https://images.pexels.com/photos/4162498/pexels-photo-4162498.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Elevação Lateral",
      "sets": 3,
      "reps": "12-15",
      "restTime": "45 seg",
      "instructions": "Eleve os braços lateralmente até a altura dos ombros.",
      "imageUrl": "https://images.pexels.com/photos/4162589/pexels-photo-4162589.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Desenvolvimento Arnold",
      "sets": 3,
      "reps": "10-12",
      "restTime": "75 seg",
      "instructions": "Rotacione os punhos durante o movimento de desenvolvimento.",
      "imageUrl": "https://images.pexels.com/photos/3823189/pexels-photo-3823189.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ]'::jsonb,
  'Treino focado no desenvolvimento de braços e ombros com exercícios isolados e compostos. Mantenha a forma adequada em todos os movimentos.',
  false
);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();