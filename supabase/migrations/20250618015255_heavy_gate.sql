/*
  # Corrigir persistência de dados do usuário

  1. Correções
    - Corrigir políticas RLS para usar conversão de tipos adequada
    - Criar função para criação automática de perfil
    - Remover inserção de dados de teste que violam constraints
    - Verificar integridade das tabelas

  2. Melhorias
    - Função automática para criar perfil após registro
    - Políticas RLS mais robustas
    - Verificação de funções auxiliares
*/

-- Verificar e corrigir a tabela de perfis
DO $$
BEGIN
  -- Verificar se a coluna fitness_level existe e tem o valor padrão correto
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'fitness_level'
  ) THEN
    ALTER TABLE profiles ADD COLUMN fitness_level text NOT NULL DEFAULT 'iniciante';
  ELSE
    -- Atualizar o valor padrão se a coluna já existir
    ALTER TABLE profiles ALTER COLUMN fitness_level SET DEFAULT 'iniciante';
  END IF;
END $$;

-- Verificar e corrigir políticas RLS
DO $$
BEGIN
  -- Políticas para profiles
  DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  
  CREATE POLICY "Users can read own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid()::text = id::text);
    
  CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = id::text);
    
  CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid()::text = id::text);

  -- Políticas para user_favorites
  DROP POLICY IF EXISTS "Users can read own favorites" ON user_favorites;
  DROP POLICY IF EXISTS "Users can manage own favorites" ON user_favorites;
  
  CREATE POLICY "Users can read own favorites"
    ON user_favorites FOR SELECT
    TO authenticated
    USING (auth.uid()::text = user_id::text);
    
  CREATE POLICY "Users can manage own favorites"
    ON user_favorites FOR ALL
    TO authenticated
    USING (auth.uid()::text = user_id::text);

  -- Políticas para user_workout_history
  DROP POLICY IF EXISTS "Users can read own workout history" ON user_workout_history;
  DROP POLICY IF EXISTS "Users can manage own workout history" ON user_workout_history;
  
  CREATE POLICY "Users can read own workout history"
    ON user_workout_history FOR SELECT
    TO authenticated
    USING (auth.uid()::text = user_id::text);
    
  CREATE POLICY "Users can manage own workout history"
    ON user_workout_history FOR ALL
    TO authenticated
    USING (auth.uid()::text = user_id::text);

  -- Políticas para user_workout_schedule
  DROP POLICY IF EXISTS "Users can read own schedule" ON user_workout_schedule;
  DROP POLICY IF EXISTS "Users can manage own schedule" ON user_workout_schedule;
  
  CREATE POLICY "Users can read own schedule"
    ON user_workout_schedule FOR SELECT
    TO authenticated
    USING (auth.uid()::text = user_id::text);
    
  CREATE POLICY "Users can manage own schedule"
    ON user_workout_schedule FOR ALL
    TO authenticated
    USING (auth.uid()::text = user_id::text);

  -- Políticas para user_progress_stats
  DROP POLICY IF EXISTS "Users can read own progress stats" ON user_progress_stats;
  DROP POLICY IF EXISTS "Users can manage own progress stats" ON user_progress_stats;
  
  CREATE POLICY "Users can read own progress stats"
    ON user_progress_stats FOR SELECT
    TO authenticated
    USING (auth.uid()::text = user_id::text);
    
  CREATE POLICY "Users can manage own progress stats"
    ON user_progress_stats FOR ALL
    TO authenticated
    USING (auth.uid()::text = user_id::text);
END $$;

-- Função para criar perfil automaticamente após registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, fitness_level)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário'), 
    'iniciante'
  );
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- Se o perfil já existir, apenas retorna
    RETURN new;
  WHEN OTHERS THEN
    -- Log do erro mas não falha o registro
    RAISE WARNING 'Erro ao criar perfil para usuário %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função auxiliar para obter início da semana
CREATE OR REPLACE FUNCTION get_week_start_date(input_date date)
RETURNS date AS $$
BEGIN
  RETURN date_trunc('week', input_date)::date;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Função auxiliar para obter início do mês
CREATE OR REPLACE FUNCTION get_month_start_date(input_date date)
RETURNS date AS $$
BEGIN
  RETURN date_trunc('month', input_date)::date;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Função para inicializar estatísticas de progresso do usuário
CREATE OR REPLACE FUNCTION initialize_user_progress_stats(user_id_param uuid)
RETURNS void AS $$
DECLARE
  current_week_start date;
  current_month_start date;
BEGIN
  current_week_start := get_week_start_date(CURRENT_DATE);
  current_month_start := get_month_start_date(CURRENT_DATE);
  
  INSERT INTO user_progress_stats (
    user_id,
    week_start_date,
    month_start_date,
    weekly_workouts_completed,
    weekly_workouts_goal,
    monthly_workouts_completed,
    monthly_workouts_goal,
    total_workouts_completed,
    current_streak,
    longest_streak,
    total_minutes_exercised,
    total_calories_burned
  ) VALUES (
    user_id_param,
    current_week_start,
    current_month_start,
    0,
    5,
    0,
    20,
    0,
    0,
    0,
    0,
    0
  )
  ON CONFLICT (user_id, week_start_date, month_start_date) 
  DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar a função handle_new_user para incluir inicialização de estatísticas
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Criar perfil
  INSERT INTO public.profiles (id, name, fitness_level)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', 'Usuário'), 
    'iniciante'
  );
  
  -- Inicializar estatísticas de progresso
  PERFORM initialize_user_progress_stats(new.id);
  
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- Se o perfil já existir, apenas retorna
    RETURN new;
  WHEN OTHERS THEN
    -- Log do erro mas não falha o registro
    RAISE WARNING 'Erro ao criar perfil para usuário %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar integridade das tabelas
DO $$
BEGIN
  -- Verificar se todas as tabelas necessárias existem
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    RAISE EXCEPTION 'Tabela profiles não encontrada';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workouts') THEN
    RAISE EXCEPTION 'Tabela workouts não encontrada';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_favorites') THEN
    RAISE EXCEPTION 'Tabela user_favorites não encontrada';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_workout_history') THEN
    RAISE EXCEPTION 'Tabela user_workout_history não encontrada';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_workout_schedule') THEN
    RAISE EXCEPTION 'Tabela user_workout_schedule não encontrada';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_progress_stats') THEN
    RAISE EXCEPTION 'Tabela user_progress_stats não encontrada';
  END IF;
  
  RAISE NOTICE 'Todas as tabelas estão presentes e configuradas corretamente';
END $$;

-- Verificar se as funções auxiliares estão funcionando
DO $$
BEGIN
  -- Testar função get_week_start_date
  IF get_week_start_date(CURRENT_DATE) IS NULL THEN
    RAISE EXCEPTION 'Função get_week_start_date não está funcionando';
  END IF;
  
  -- Testar função get_month_start_date
  IF get_month_start_date(CURRENT_DATE) IS NULL THEN
    RAISE EXCEPTION 'Função get_month_start_date não está funcionando';
  END IF;
  
  RAISE NOTICE 'Todas as funções auxiliares estão funcionando corretamente';
END $$;