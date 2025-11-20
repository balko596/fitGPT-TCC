/*
  # Inserir treinos de exemplo

  1. Dados de exemplo
    - Inserir treinos pré-definidos para demonstração
    - Incluir diferentes níveis de dificuldade
    - Variedade de grupos musculares e equipamentos
*/

-- Inserir treinos de exemplo
INSERT INTO workouts (name, difficulty, muscle_groups, duration, duration_minutes, calories, equipment, exercises, instructions, is_custom) VALUES
(
  'Força Corpo Todo',
  'Intermediário',
  ARRAY['Peito', 'Costas', 'Pernas', 'Ombros'],
  '45 min',
  45,
  350,
  ARRAY['Halteres', 'Barra'],
  '[
    {
      "name": "Agachamento com Barra",
      "sets": 4,
      "reps": "8-10",
      "restTime": "90 seg",
      "instructions": "Mantenha o peito erguido e as costas retas. Empurre através dos calcanhares.",
      "imageUrl": "https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Supino",
      "sets": 4,
      "reps": "8-10",
      "restTime": "90 seg",
      "instructions": "Mantenha os pés no chão e um leve arco nas costas.",
      "imageUrl": "https://images.pexels.com/photos/4162494/pexels-photo-4162494.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Remada Curvada",
      "sets": 3,
      "reps": "10-12",
      "restTime": "60 seg",
      "instructions": "Incline-se nos quadris com as costas retas. Puxe a barra até as costelas inferiores.",
      "imageUrl": "https://images.pexels.com/photos/4498482/pexels-photo-4498482.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Desenvolvimento",
      "sets": 3,
      "reps": "8-10",
      "restTime": "60 seg",
      "instructions": "Pressione o peso diretamente acima da cabeça. Mantenha o core contraído.",
      "imageUrl": "https://images.pexels.com/photos/6456300/pexels-photo-6456300.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Levantamento Terra Romeno",
      "sets": 3,
      "reps": "10-12",
      "restTime": "60 seg",
      "instructions": "Incline-se nos quadris, mantendo uma leve flexão nos joelhos. Sinta o alongamento nos isquiotibiais.",
      "imageUrl": "https://images.pexels.com/photos/6551138/pexels-photo-6551138.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ]'::jsonb,
  'Execute cada exercício com a forma adequada, focando nos grupos musculares sendo trabalhados. Respeite os períodos de descanso recomendados entre séries e exercícios.',
  false
),
(
  'HIIT Cardio Explosivo',
  'Avançado',
  ARRAY['Corpo Todo', 'Core'],
  '30 min',
  30,
  400,
  ARRAY['Nenhum'],
  '[
    {
      "name": "Polichinelos",
      "sets": 1,
      "reps": "45 seg",
      "restTime": "15 seg",
      "instructions": "Pule enquanto levanta os braços e afasta as pernas para os lados.",
      "imageUrl": "https://images.pexels.com/photos/4051510/pexels-photo-4051510.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Escalador",
      "sets": 1,
      "reps": "45 seg",
      "restTime": "15 seg",
      "instructions": "Comece em posição de prancha e alterne trazendo os joelhos ao peito.",
      "imageUrl": "https://images.pexels.com/photos/6303739/pexels-photo-6303739.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Burpees",
      "sets": 1,
      "reps": "45 seg",
      "restTime": "15 seg",
      "instructions": "De pé, desça em agachamento, chute os pés para trás, faça uma flexão, pule os pés para frente e salte.",
      "imageUrl": "https://images.pexels.com/photos/6456284/pexels-photo-6456284.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Joelhos Altos",
      "sets": 1,
      "reps": "45 seg",
      "restTime": "15 seg",
      "instructions": "Corra no lugar, elevando os joelhos em direção ao peito.",
      "imageUrl": "https://images.pexels.com/photos/3757379/pexels-photo-3757379.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Prancha com Polichinelos",
      "sets": 1,
      "reps": "45 seg",
      "restTime": "15 seg",
      "instructions": "Comece em posição de prancha e pule os pés para fora e para dentro (como um polichinelo).",
      "imageUrl": "https://images.pexels.com/photos/6551098/pexels-photo-6551098.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Repetir Circuito 3-5 Vezes",
      "sets": 3,
      "reps": "Completar todos",
      "restTime": "60 seg entre circuitos",
      "instructions": "Descanse 60 segundos entre circuitos, depois repita todos os exercícios.",
      "imageUrl": "https://images.pexels.com/photos/3822315/pexels-photo-3822315.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ]'::jsonb,
  'Treino de alta intensidade. Mantenha a intensidade alta durante os períodos de trabalho e use os períodos de descanso para se recuperar.',
  false
),
(
  'Foco Parte Superior',
  'Intermediário',
  ARRAY['Peito', 'Costas', 'Braços', 'Ombros'],
  '50 min',
  50,
  320,
  ARRAY['Halteres', 'Faixas Elásticas'],
  '[
    {
      "name": "Flexões",
      "sets": 3,
      "reps": "10-15",
      "restTime": "60 seg",
      "instructions": "Mantenha o corpo em linha reta da cabeça aos calcanhares. Abaixe o peito até o chão e empurre de volta.",
      "imageUrl": "https://images.pexels.com/photos/4162495/pexels-photo-4162495.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Remada com Halteres",
      "sets": 3,
      "reps": "12 cada lado",
      "restTime": "60 seg",
      "instructions": "Coloque uma mão e joelho no banco. Puxe o halter em direção ao quadril.",
      "imageUrl": "https://images.pexels.com/photos/6454160/pexels-photo-6454160.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Elevação Lateral",
      "sets": 3,
      "reps": "12-15",
      "restTime": "45 seg",
      "instructions": "Mantenha uma leve flexão nos cotovelos. Eleve os halteres até a altura dos ombros.",
      "imageUrl": "https://images.pexels.com/photos/6456228/pexels-photo-6456228.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Rosca Bíceps",
      "sets": 3,
      "reps": "12",
      "restTime": "45 seg",
      "instructions": "Mantenha os cotovelos próximos ao corpo. Curve os pesos em direção aos ombros.",
      "imageUrl": "https://images.pexels.com/photos/6550851/pexels-photo-6550851.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Mergulho para Tríceps",
      "sets": 3,
      "reps": "12-15",
      "restTime": "45 seg",
      "instructions": "Use uma cadeira ou banco. Abaixe o corpo flexionando os cotovelos, depois empurre de volta.",
      "imageUrl": "https://images.pexels.com/photos/4162456/pexels-photo-4162456.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Afastamento com Faixa",
      "sets": 3,
      "reps": "15-20",
      "restTime": "45 seg",
      "instructions": "Segure uma faixa elástica com ambas as mãos. Puxe a faixa separando, apertando as omoplatas.",
      "imageUrl": "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ]'::jsonb,
  'Foque na forma adequada e no controle do movimento. Sinta a contração muscular em cada repetição.',
  false
),
(
  'Treino Iniciante em Casa',
  'Iniciante',
  ARRAY['Corpo Todo'],
  '25 min',
  25,
  200,
  ARRAY['Nenhum'],
  '[
    {
      "name": "Agachamento Livre",
      "sets": 3,
      "reps": "10-12",
      "restTime": "30 seg",
      "instructions": "Fique com os pés na largura dos ombros. Abaixe os quadris como se fosse sentar em uma cadeira, depois volte à posição inicial.",
      "imageUrl": "https://images.pexels.com/photos/6456191/pexels-photo-6456191.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Flexões Modificadas",
      "sets": 3,
      "reps": "8-10",
      "restTime": "30 seg",
      "instructions": "Faça flexões com os joelhos no chão se necessário. Foque na forma adequada.",
      "imageUrl": "https://images.pexels.com/photos/3822319/pexels-photo-3822319.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Ponte de Glúteo",
      "sets": 3,
      "reps": "12-15",
      "restTime": "30 seg",
      "instructions": "Deite-se de costas com joelhos flexionados. Levante os quadris em direção ao teto, apertando os glúteos.",
      "imageUrl": "https://images.pexels.com/photos/4056529/pexels-photo-4056529.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Desenvolvimento em Pé",
      "sets": 3,
      "reps": "12",
      "restTime": "30 seg",
      "instructions": "Use garrafas de água se necessário. Pressione os braços acima da cabeça, depois abaixe de volta.",
      "imageUrl": "https://images.pexels.com/photos/6551175/pexels-photo-6551175.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Bird Dogs",
      "sets": 3,
      "reps": "10 cada lado",
      "restTime": "30 seg",
      "instructions": "Comece de quatro. Estenda o braço oposto e a perna simultaneamente, depois troque de lado.",
      "imageUrl": "https://images.pexels.com/photos/6551166/pexels-photo-6551166.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ]'::jsonb,
  'Perfeito para iniciantes. Foque na forma adequada e progrida gradualmente.',
  false
),
(
  'Destruidor de Core',
  'Intermediário',
  ARRAY['Core', 'Abdômen'],
  '20 min',
  20,
  150,
  ARRAY['Nenhum'],
  '[
    {
      "name": "Prancha",
      "sets": 3,
      "reps": "30-60 seg",
      "restTime": "30 seg",
      "instructions": "Mantenha uma linha reta da cabeça aos calcanhares. Contraia o core e não deixe os quadris caírem.",
      "imageUrl": "https://images.pexels.com/photos/6551082/pexels-photo-6551082.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Rotação Russa",
      "sets": 3,
      "reps": "20 total",
      "restTime": "30 seg",
      "instructions": "Sente-se com joelhos flexionados e calcanhares no chão. Gire o tronco de um lado para o outro.",
      "imageUrl": "https://images.pexels.com/photos/6456169/pexels-photo-6456169.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Bicicleta",
      "sets": 3,
      "reps": "20 total",
      "restTime": "30 seg",
      "instructions": "Deite-se de costas, mãos atrás da cabeça. Traga o cotovelo oposto ao joelho oposto enquanto estende a outra perna.",
      "imageUrl": "https://images.pexels.com/photos/5384538/pexels-photo-5384538.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Escalador",
      "sets": 3,
      "reps": "30 seg",
      "restTime": "30 seg",
      "instructions": "Comece em posição de prancha e alterne trazendo os joelhos ao peito.",
      "imageUrl": "https://images.pexels.com/photos/6303739/pexels-photo-6303739.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Elevação de Pernas",
      "sets": 3,
      "reps": "12-15",
      "restTime": "30 seg",
      "instructions": "Deite-se de costas com pernas retas. Eleve as pernas em direção ao teto, depois abaixe sem tocar o chão.",
      "imageUrl": "https://images.pexels.com/photos/5384503/pexels-photo-5384503.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ]'::jsonb,
  'Treino intenso para o core. Mantenha a respiração controlada e foque na contração abdominal.',
  false
),
(
  'Foco Parte Inferior',
  'Avançado',
  ARRAY['Pernas', 'Glúteos'],
  '40 min',
  40,
  380,
  ARRAY['Halteres', 'Barra'],
  '[
    {
      "name": "Agachamento com Barra nas Costas",
      "sets": 4,
      "reps": "8-10",
      "restTime": "90 seg",
      "instructions": "Mantenha o peito erguido e as costas retas. Abaixe até as coxas ficarem paralelas ao chão.",
      "imageUrl": "https://images.pexels.com/photos/6550828/pexels-photo-6550828.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Levantamento Terra Romeno",
      "sets": 4,
      "reps": "10-12",
      "restTime": "90 seg",
      "instructions": "Incline-se nos quadris com uma leve flexão nos joelhos. Abaixe o peso mantendo as costas retas.",
      "imageUrl": "https://images.pexels.com/photos/6551138/pexels-photo-6551138.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Afundo Caminhando",
      "sets": 3,
      "reps": "12 cada perna",
      "restTime": "60 seg",
      "instructions": "Dê um passo à frente e abaixe o joelho de trás em direção ao chão. Empurre com o pé da frente para dar o próximo passo.",
      "imageUrl": "https://images.pexels.com/photos/9653625/pexels-photo-9653625.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Agachamento Búlgaro com Halteres",
      "sets": 3,
      "reps": "10 cada perna",
      "restTime": "60 seg",
      "instructions": "Coloque o pé de trás em um banco. Abaixe o joelho de trás em direção ao chão, depois empurre de volta.",
      "imageUrl": "https://images.pexels.com/photos/6550853/pexels-photo-6550853.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      "name": "Elevação de Panturrilha",
      "sets": 3,
      "reps": "15-20",
      "restTime": "45 seg",
      "instructions": "Fique com os pés na largura dos quadris. Suba na ponta dos pés, depois abaixe de volta.",
      "imageUrl": "https://images.pexels.com/photos/4164757/pexels-photo-4164757.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ]'::jsonb,
  'Treino intenso para pernas e glúteos. Use cargas adequadas e mantenha a forma correta.',
  false
);