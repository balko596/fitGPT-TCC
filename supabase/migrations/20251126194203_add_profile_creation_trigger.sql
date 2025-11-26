/*
  # Adicionar trigger para criar perfil automaticamente

  1. Mudanças
    - Cria função para criar perfil automaticamente quando usuário é registrado
    - Adiciona trigger que executa a função quando novo usuário é criado em auth.users
  
  2. Benefícios
    - Perfis são criados automaticamente no registro
    - Não é necessário código adicional no frontend
    - Dados do usuário (nome do metadata) são copiados para o perfil
*/

-- Criar função que cria perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url, fitness_level)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    'https://ui-avatars.com/api/?name=' || COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario') || '&background=3B82F6&color=fff',
    'iniciante'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger que executa a função quando novo usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();