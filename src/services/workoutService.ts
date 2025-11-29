import { supabase, testConnection, isSupabaseConfigured } from '../lib/supabase';
import { Workout } from '../types/Workout';
import { updateProgressAfterWorkout } from './progressService';
import { buildWorkoutPrompt } from './promptBuilder';

// Mock data robusto como fallback APENAS quando Supabase não estiver configurado
const mockWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Treino de Força Completo',
    difficulty: 'Intermediário',
    muscleGroups: ['Peito', 'Costas', 'Pernas', 'Ombros'],
    duration: '45 min',
    durationMinutes: 45,
    calories: 350,
    equipment: ['Halteres', 'Barra'],
    exercises: [
      {
        name: 'Agachamento com Barra',
        sets: 4,
        reps: '8-10',
        restTime: '90 seg',
        instructions: 'Mantenha o peito erguido e as costas retas. Empurre através dos calcanhares.',
        imageUrl: 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Supino',
        sets: 4,
        reps: '8-10',
        restTime: '90 seg',
        instructions: 'Mantenha os pés no chão e um leve arco nas costas.',
        imageUrl: 'https://images.pexels.com/photos/4162494/pexels-photo-4162494.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Remada Curvada',
        sets: 3,
        reps: '10-12',
        restTime: '60 seg',
        instructions: 'Incline-se nos quadris com as costas retas. Puxe a barra até as costelas inferiores.',
        imageUrl: 'https://images.pexels.com/photos/4498482/pexels-photo-4498482.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Desenvolvimento',
        sets: 3,
        reps: '8-10',
        restTime: '60 seg',
        instructions: 'Pressione o peso diretamente acima da cabeça. Mantenha o core contraído.',
        imageUrl: 'https://images.pexels.com/photos/6456300/pexels-photo-6456300.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ],
    instructions: 'Execute cada exercício com a forma adequada, focando nos grupos musculares sendo trabalhados.'
  },
  {
    id: '2',
    name: 'HIIT Cardio Explosivo',
    difficulty: 'Avançado',
    muscleGroups: ['Corpo Todo', 'Core'],
    duration: '30 min',
    durationMinutes: 30,
    calories: 400,
    equipment: ['Nenhum'],
    exercises: [
      {
        name: 'Burpees',
        sets: 4,
        reps: '30 seg',
        restTime: '30 seg',
        instructions: 'Execute o movimento completo: agachamento, prancha, flexão, salto.',
        imageUrl: 'https://images.pexels.com/photos/4162582/pexels-photo-4162582.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Mountain Climbers',
        sets: 4,
        reps: '30 seg',
        restTime: '30 seg',
        instructions: 'Alterne as pernas rapidamente mantendo a posição de prancha.',
        imageUrl: 'https://images.pexels.com/photos/4162498/pexels-photo-4162498.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Polichinelos',
        sets: 4,
        reps: '30 seg',
        restTime: '30 seg',
        instructions: 'Pule enquanto levanta os braços e afasta as pernas para os lados.',
        imageUrl: 'https://images.pexels.com/photos/4051510/pexels-photo-4051510.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Joelhos Altos',
        sets: 4,
        reps: '30 seg',
        restTime: '30 seg',
        instructions: 'Corra no lugar, elevando os joelhos em direção ao peito.',
        imageUrl: 'https://images.pexels.com/photos/3757379/pexels-photo-3757379.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ],
    instructions: 'Treino HIIT de alta intensidade para queima de gordura e condicionamento cardiovascular.'
  },
  {
    id: '3',
    name: 'Treino Iniciante em Casa',
    difficulty: 'Iniciante',
    muscleGroups: ['Corpo Todo'],
    duration: '25 min',
    durationMinutes: 25,
    calories: 200,
    equipment: ['Nenhum'],
    exercises: [
      {
        name: 'Agachamento Livre',
        sets: 3,
        reps: '10-12',
        restTime: '30 seg',
        instructions: 'Fique com os pés na largura dos ombros. Abaixe os quadris como se fosse sentar em uma cadeira.',
        imageUrl: 'https://images.pexels.com/photos/6456191/pexels-photo-6456191.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Flexões Modificadas',
        sets: 3,
        reps: '8-10',
        restTime: '30 seg',
        instructions: 'Faça flexões com os joelhos no chão se necessário. Foque na forma adequada.',
        imageUrl: 'https://images.pexels.com/photos/3822319/pexels-photo-3822319.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Ponte de Glúteo',
        sets: 3,
        reps: '12-15',
        restTime: '30 seg',
        instructions: 'Deite-se de costas com joelhos flexionados. Levante os quadris em direção ao teto.',
        imageUrl: 'https://images.pexels.com/photos/4056529/pexels-photo-4056529.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Desenvolvimento em Pé',
        sets: 3,
        reps: '12',
        restTime: '30 seg',
        instructions: 'Use garrafas de água se necessário. Pressione os braços acima da cabeça.',
        imageUrl: 'https://images.pexels.com/photos/6551175/pexels-photo-6551175.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ],
    instructions: 'Perfeito para iniciantes. Foque na forma adequada e progrida gradualmente.'
  },
  {
    id: '4',
    name: 'Destruidor de Core',
    difficulty: 'Intermediário',
    muscleGroups: ['Core', 'Abdômen'],
    duration: '20 min',
    durationMinutes: 20,
    calories: 150,
    equipment: ['Nenhum'],
    exercises: [
      {
        name: 'Prancha',
        sets: 3,
        reps: '30-60 seg',
        restTime: '30 seg',
        instructions: 'Mantenha uma linha reta da cabeça aos calcanhares. Contraia o core.',
        imageUrl: 'https://images.pexels.com/photos/6551082/pexels-photo-6551082.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Rotação Russa',
        sets: 3,
        reps: '20 total',
        restTime: '30 seg',
        instructions: 'Sente-se com joelhos flexionados. Gire o tronco de um lado para o outro.',
        imageUrl: 'https://images.pexels.com/photos/6456169/pexels-photo-6456169.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Bicicleta',
        sets: 3,
        reps: '20 total',
        restTime: '30 seg',
        instructions: 'Traga o cotovelo oposto ao joelho oposto enquanto estende a outra perna.',
        imageUrl: 'https://images.pexels.com/photos/5384538/pexels-photo-5384538.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Elevação de Pernas',
        sets: 3,
        reps: '12-15',
        restTime: '30 seg',
        instructions: 'Eleve as pernas em direção ao teto, depois abaixe sem tocar o chão.',
        imageUrl: 'https://images.pexels.com/photos/5384503/pexels-photo-5384503.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ],
    instructions: 'Treino intenso para o core. Mantenha a respiração controlada.'
  },
  {
    id: '5',
    name: 'Força Parte Superior',
    difficulty: 'Intermediário',
    muscleGroups: ['Peito', 'Costas', 'Braços', 'Ombros'],
    duration: '40 min',
    durationMinutes: 40,
    calories: 300,
    equipment: ['Halteres'],
    exercises: [
      {
        name: 'Flexões',
        sets: 3,
        reps: '10-15',
        restTime: '60 seg',
        instructions: 'Mantenha o corpo em linha reta da cabeça aos calcanhares.',
        imageUrl: 'https://images.pexels.com/photos/4162495/pexels-photo-4162495.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Remada com Halteres',
        sets: 3,
        reps: '12 cada lado',
        restTime: '60 seg',
        instructions: 'Coloque uma mão e joelho no banco. Puxe o halter em direção ao quadril.',
        imageUrl: 'https://images.pexels.com/photos/6454160/pexels-photo-6454160.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Elevação Lateral',
        sets: 3,
        reps: '12-15',
        restTime: '45 seg',
        instructions: 'Mantenha uma leve flexão nos cotovelos. Eleve os halteres até a altura dos ombros.',
        imageUrl: 'https://images.pexels.com/photos/6456228/pexels-photo-6456228.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Rosca Bíceps',
        sets: 3,
        reps: '12',
        restTime: '45 seg',
        instructions: 'Mantenha os cotovelos próximos ao corpo. Curve os pesos em direção aos ombros.',
        imageUrl: 'https://images.pexels.com/photos/6550851/pexels-photo-6550851.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ],
    instructions: 'Foque na forma adequada e no controle do movimento.'
  },
  {
    id: '6',
    name: 'Pernas e Glúteos',
    difficulty: 'Avançado',
    muscleGroups: ['Pernas', 'Glúteos'],
    duration: '50 min',
    durationMinutes: 50,
    calories: 450,
    equipment: ['Halteres', 'Barra'],
    exercises: [
      {
        name: 'Agachamento com Peso',
        sets: 4,
        reps: '8-12',
        restTime: '90 seg',
        instructions: 'Mantenha o peito erguido e desça até as coxas ficarem paralelas ao chão.',
        imageUrl: 'https://images.pexels.com/photos/6550828/pexels-photo-6550828.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Afundo',
        sets: 3,
        reps: '12 cada perna',
        restTime: '60 seg',
        instructions: 'Dê um passo à frente e abaixe o joelho de trás em direção ao chão.',
        imageUrl: 'https://images.pexels.com/photos/9653625/pexels-photo-9653625.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Ponte de Glúteo com Peso',
        sets: 3,
        reps: '15-20',
        restTime: '45 seg',
        instructions: 'Coloque peso sobre os quadris e contraia os glúteos no topo.',
        imageUrl: 'https://images.pexels.com/photos/4056529/pexels-photo-4056529.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        name: 'Elevação de Panturrilha',
        sets: 3,
        reps: '15-20',
        restTime: '30 seg',
        instructions: 'Suba na ponta dos pés e desça controladamente.',
        imageUrl: 'https://images.pexels.com/photos/4164757/pexels-photo-4164757.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ],
    instructions: 'Treino intenso para pernas e glúteos. Use cargas adequadas.'
  }
];

// Converter dados do Supabase para o tipo Workout
const convertSupabaseToWorkout = (data: any): Workout => {
  return {
    id: data.id,
    name: data.name,
    difficulty: data.difficulty,
    muscleGroups: data.muscle_groups || [],
    duration: data.duration,
    durationMinutes: data.duration_minutes,
    calories: data.calories,
    equipment: data.equipment || [],
    exercises: data.exercises || [],
    instructions: data.instructions
  };
};

// Converter tipo Workout para dados do Supabase
const convertWorkoutToSupabase = (workout: Partial<Workout>, userId?: string) => {
  return {
    name: workout.name,
    difficulty: workout.difficulty,
    muscle_groups: workout.muscleGroups,
    duration: workout.duration,
    duration_minutes: workout.durationMinutes,
    calories: workout.calories,
    equipment: workout.equipment,
    exercises: workout.exercises,
    instructions: workout.instructions,
    is_custom: true,
    created_by: userId
  };
};

export const fetchWorkouts = async (): Promise<Workout[]> => {
  console.log('🔄 Iniciando carregamento de treinos...');
  
  try {
    // Se Supabase estiver configurado, tentar usar Supabase primeiro
    if (isSupabaseConfigured()) {
      console.log('🔗 Tentando carregar treinos do Supabase...');
      
      try {
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('⚠️ Erro ao buscar treinos do Supabase:', error.message);
          // Não lançar erro, usar fallback
        } else if (data && data.length > 0) {
          console.log('✅ Treinos carregados do Supabase:', data.length);
          return data.map(convertSupabaseToWorkout);
        } else {
          console.log('📭 Nenhum treino encontrado no Supabase, usando dados mock');
        }
      } catch (supabaseError) {
        console.warn('⚠️ Erro de conexão com Supabase:', supabaseError);
        // Continuar para fallback
      }
    }
    
    // Fallback para dados mock
    console.log('🎯 Usando dados mock (modo offline)');
    return mockWorkouts;
    
  } catch (error) {
    console.error('❌ Erro geral ao carregar treinos:', error);
    
    // Sempre retornar dados mock como último recurso
    console.log('🔄 Retornando dados mock como fallback final');
    return mockWorkouts;
  }
};

export const fetchWorkoutById = async (id: string): Promise<Workout> => {
  console.log('🔍 Buscando treino por ID:', id);
  
  try {
    // Se Supabase estiver configurado, buscar no Supabase primeiro
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          console.log('✅ Treino encontrado no Supabase');
          return convertSupabaseToWorkout(data);
        }
        
        if (error && error.code !== 'PGRST116') {
          console.warn('⚠️ Erro ao buscar treino no Supabase:', error.message);
        }
      } catch (supabaseError) {
        console.warn('⚠️ Erro de conexão ao buscar treino:', supabaseError);
      }
    }

    // Fallback para dados mock
    console.log('🔄 Buscando nos dados mock...');
    const mockWorkout = mockWorkouts.find(w => w.id === id);
    if (mockWorkout) {
      console.log('✅ Treino encontrado nos dados mock');
      return mockWorkout;
    }

    throw new Error('Treino não encontrado');
  } catch (error) {
    console.error('❌ Erro ao carregar treino:', error);
    throw error;
  }
};

// Templates de exercícios por categoria
const exerciseTemplates = {
  'corpo-todo': [
    {
      name: 'Burpees',
      sets: 3,
      reps: '10-12',
      restTime: '60 seg',
      instructions: 'Execute o movimento completo: agachamento, prancha, flexão, salto.',
      imageUrl: 'https://images.pexels.com/photos/4162582/pexels-photo-4162582.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: 'Agachamento',
      sets: 3,
      reps: '12-15',
      restTime: '45 seg',
      instructions: 'Mantenha o peito erguido e desça até os quadris ficarem paralelos ao chão.',
      imageUrl: 'https://images.pexels.com/photos/4162498/pexels-photo-4162498.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: 'Flexões',
      sets: 3,
      reps: '8-12',
      restTime: '45 seg',
      instructions: 'Mantenha o corpo em linha reta e desça o peito até próximo ao chão.',
      imageUrl: 'https://images.pexels.com/photos/4162589/pexels-photo-4162589.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: 'Prancha',
      sets: 3,
      reps: '30-45 seg',
      restTime: '30 seg',
      instructions: 'Mantenha uma linha reta da cabeça aos calcanhares.',
      imageUrl: 'https://images.pexels.com/photos/3823189/pexels-photo-3823189.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ],
  'parte-superior': [
    {
      name: 'Flexões',
      sets: 3,
      reps: '10-15',
      restTime: '60 seg',
      instructions: 'Foque na contração do peitoral e tríceps.',
      imageUrl: 'https://images.pexels.com/photos/4162582/pexels-photo-4162582.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: 'Mergulho para Tríceps',
      sets: 3,
      reps: '8-12',
      restTime: '45 seg',
      instructions: 'Use uma cadeira ou banco, focando no tríceps.',
      imageUrl: 'https://images.pexels.com/photos/4162498/pexels-photo-4162498.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: 'Pike Push-ups',
      sets: 3,
      reps: '8-10',
      restTime: '60 seg',
      instructions: 'Posição de V invertido, focando nos ombros.',
      imageUrl: 'https://images.pexels.com/photos/4162589/pexels-photo-4162589.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ],
  'parte-inferior': [
    {
      name: 'Agachamento',
      sets: 4,
      reps: '12-15',
      restTime: '60 seg',
      instructions: 'Foque nos quadríceps e glúteos.',
      imageUrl: 'https://images.pexels.com/photos/4162582/pexels-photo-4162582.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: 'Afundo',
      sets: 3,
      reps: '10 cada perna',
      restTime: '45 seg',
      instructions: 'Alterne as pernas, mantendo o equilíbrio.',
      imageUrl: 'https://images.pexels.com/photos/4162498/pexels-photo-4162498.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: 'Ponte de Glúteo',
      sets: 3,
      reps: '15-20',
      restTime: '30 seg',
      instructions: 'Contraia os glúteos no topo do movimento.',
      imageUrl: 'https://images.pexels.com/photos/4162589/pexels-photo-4162589.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: 'Elevação de Panturrilha',
      sets: 3,
      reps: '15-20',
      restTime: '30 seg',
      instructions: 'Suba na ponta dos pés e desça controladamente.',
      imageUrl: 'https://images.pexels.com/photos/3823189/pexels-photo-3823189.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ],
  'core': [
    {
      name: 'Prancha',
      sets: 3,
      reps: '30-60 seg',
      restTime: '30 seg',
      instructions: 'Mantenha o core contraído e respiração controlada.',
      imageUrl: 'https://images.pexels.com/photos/4162582/pexels-photo-4162582.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: 'Bicicleta',
      sets: 3,
      reps: '20 total',
      restTime: '30 seg',
      instructions: 'Alterne cotovelo com joelho oposto.',
      imageUrl: 'https://images.pexels.com/photos/4162498/pexels-photo-4162498.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: 'Rotação Russa',
      sets: 3,
      reps: '15-20',
      restTime: '30 seg',
      instructions: 'Gire o tronco de um lado para o outro.',
      imageUrl: 'https://images.pexels.com/photos/4162589/pexels-photo-4162589.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      name: 'Mountain Climbers',
      sets: 3,
      reps: '30 seg',
      restTime: '30 seg',
      instructions: 'Alterne as pernas rapidamente em posição de prancha.',
      imageUrl: 'https://images.pexels.com/photos/3823189/pexels-photo-3823189.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ]
};

const generateWorkoutWithAI = async (preferences: any): Promise<any> => {
  console.log('🤖 Chamando API do GPT para gerar treino...');

  let userProfile = null;

  try {
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('age, height, weight, fitness_level, goals')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          userProfile = profile;
          console.log('✅ Perfil do usuário carregado para personalização');
        }
      }
    }
  } catch (error) {
    console.warn('⚠️ Erro ao buscar perfil do usuário, continuando sem perfil:', error);
  }

  const preferencesWithProfile = {
    ...preferences,
    userProfile
  };

  const prompt = buildWorkoutPrompt(preferencesWithProfile);

  // Em produção, usa Supabase Edge Function. Em desenvolvimento, usa servidor local
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const isDevelopment = import.meta.env.DEV;

  const apiUrl = isDevelopment
    ? (import.meta.env.VITE_API_URL || 'http://localhost:5000')
    : `${supabaseUrl}/functions/v1/generate-workout`;

  console.log('📡 URL da API:', apiUrl);
  console.log('🌍 Ambiente:', isDevelopment ? 'Desenvolvimento' : 'Produção');

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Em produção (Edge Function), adiciona a chave anon do Supabase
    if (!isDevelopment) {
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      headers['Authorization'] = `Bearer ${anonKey}`;
      console.log('🔑 Usando autenticação Supabase para Edge Function');
    }

    const endpoint = isDevelopment ? `${apiUrl}/api/generate-workout` : apiUrl;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        prompt,
        fitnessLevel: preferences.fitnessLevel,
        duration: preferences.duration,
        goal: preferences.goal,
        equipment: preferences.equipment,
        focusAreas: preferences.focusAreas
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Erro da API:', errorData);
      const apiError = errorData.error || 'Erro ao gerar treino com IA';

      // Propagar mensagem de erro que inclui "cota" ou "quota" para ativar o fallback
      throw new Error(apiError);
    }

    const workoutData = await response.json();
    console.log('✅ Treino gerado pela IA:', workoutData.name);

    return workoutData;
  } catch (error) {
    console.error('❌ Erro ao conectar com a API:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      if (isDevelopment) {
        throw new Error('⚠️ SERVIDOR BACKEND NÃO ESTÁ RODANDO!\n\nPara gerar treinos com IA, você precisa rodar:\nnpm run dev:all\n\nOU em outro terminal:\nnpm run server');
      } else {
        throw new Error('⚠️ Erro ao conectar com o serviço de IA. Tente novamente em alguns instantes.');
      }
    }
    throw error;
  }
};

const generateWorkoutWithTemplates = (preferences: any): any => {
  console.log('📋 Gerando treino com templates locais...');

  const { fitnessLevel, duration, goal, equipment, focusAreas } = preferences;

  const durationConfig = {
    'curto': { minutes: 25, calories: 200 },
    'medio': { minutes: 45, calories: 350 },
    'longo': { minutes: 65, calories: 500 }
  };

  const config = durationConfig[duration] || durationConfig['medio'];

  const primaryFocus = focusAreas[0] || 'corpo-todo';
  let selectedExercises = exerciseTemplates[primaryFocus] || exerciseTemplates['corpo-todo'];

  selectedExercises = selectedExercises.map(exercise => {
    let adjustedExercise = { ...exercise };

    if (fitnessLevel === 'iniciante') {
      adjustedExercise.sets = Math.max(2, exercise.sets - 1);
      adjustedExercise.reps = exercise.reps.includes('-')
        ? exercise.reps.split('-')[0] + '-' + (parseInt(exercise.reps.split('-')[1]) - 2)
        : exercise.reps;
    } else if (fitnessLevel === 'avancado') {
      adjustedExercise.sets = exercise.sets + 1;
      adjustedExercise.reps = exercise.reps.includes('-')
        ? (parseInt(exercise.reps.split('-')[0]) + 2) + '-' + (parseInt(exercise.reps.split('-')[1]) + 3)
        : exercise.reps;
    }

    return adjustedExercise;
  });

  return {
    name: `Treino ${focusAreas.map(area =>
      area.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
    ).join(' e ')} - ${fitnessLevel.charAt(0).toUpperCase() + fitnessLevel.slice(1)}`,
    difficulty: fitnessLevel.charAt(0).toUpperCase() + fitnessLevel.slice(1),
    muscleGroups: focusAreas.map((area: string) =>
      area.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
    ),
    duration: `${config.minutes} min`,
    durationMinutes: config.minutes,
    calories: config.calories,
    equipment: equipment.map((e: string) => e.charAt(0).toUpperCase() + e.slice(1)),
    exercises: selectedExercises,
    instructions: `Treino personalizado gerado para ${fitnessLevel} focando em ${focusAreas.join(', ')}. Execute cada exercício com forma adequada e respeite os períodos de descanso.`
  };
};

export const generateCustomWorkout = async (preferences: any): Promise<Workout> => {
  console.log('🎨 Gerando treino personalizado com IA:', preferences);

  try {
    const generatedWorkout = await generateWorkoutWithAI(preferences);
    console.log('✅ Treino gerado com IA:', generatedWorkout.name);

    try {
      if (isSupabaseConfigured()) {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          console.log('💾 Salvando treino no Supabase...');
          const { data, error } = await supabase
            .from('workouts')
            .insert(convertWorkoutToSupabase(generatedWorkout, user.id))
            .select()
            .single();

          if (!error && data) {
            console.log('✅ Treino salvo no Supabase com sucesso');
            return convertSupabaseToWorkout(data);
          } else {
            console.warn('⚠️ Erro ao salvar no Supabase:', error?.message);
          }
        }
      }
    } catch (supabaseError) {
      console.warn('⚠️ Erro ao salvar no Supabase:', supabaseError);
    }

    const localWorkout: Workout = {
      id: Date.now().toString(),
      ...generatedWorkout
    };

    console.log('🎯 Treino criado:', localWorkout.name);
    return localWorkout;
  } catch (error) {
    console.error('❌ Erro ao gerar treino personalizado:', error);

    // Se o erro for relacionado à cota ou créditos da OpenAI, usar fallback de templates
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes('cota') || errorMessage.includes('quota') || errorMessage.includes('créditos')) {
      console.warn('⚠️ API OpenAI sem créditos. Usando templates locais como fallback...');

      try {
        const generatedWorkout = generateWorkoutWithTemplates(preferences);
        console.log('✅ Treino gerado com templates:', generatedWorkout.name);

        const localWorkout: Workout = {
          id: Date.now().toString(),
          ...generatedWorkout
        };

        return localWorkout;
      } catch (templateError) {
        console.error('❌ Erro ao gerar treino com templates:', templateError);
        throw new Error('Não foi possível gerar o treino. Tente novamente mais tarde.');
      }
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Erro ao gerar treino com IA. Verifique se o servidor backend está rodando (npm run server).');
  }
};

// Funções para favoritos
export const fetchUserFavorites = async (): Promise<string[]> => {
  console.log('⭐ Carregando favoritos...');
  
  try {
    // Se Supabase estiver configurado, usar Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('👤 Usuário não autenticado');
          return [];
        }

        const { data, error } = await supabase
          .from('user_favorites')
          .select('workout_id')
          .eq('user_id', user.id);

        if (error) {
          console.warn('⚠️ Erro ao buscar favoritos do Supabase:', error.message);
        } else {
          console.log('✅ Favoritos carregados do Supabase:', data?.length || 0);
          return data ? data.map(fav => fav.workout_id) : [];
        }
      } catch (supabaseError) {
        console.warn('⚠️ Erro de conexão ao buscar favoritos:', supabaseError);
      }
    }
    
    // Fallback para localStorage
    console.log('👤 Modo offline, usando localStorage');
    const savedFavorites = localStorage.getItem('workoutFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
    
  } catch (error) {
    console.warn('⚠️ Erro ao carregar favoritos:', error);
    const savedFavorites = localStorage.getItem('workoutFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  }
};

export const toggleFavorite = async (workoutId: string): Promise<boolean> => {
  console.log('💫 Alternando favorito:', workoutId);
  
  try {
    // Se Supabase estiver configurado, usar Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('👤 Usuário não autenticado, usando localStorage');
          // Fallback para localStorage se não autenticado
        } else {
          // Verificar se já é favorito
          const { data: existing } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('workout_id', workoutId)
            .maybeSingle();

          if (existing) {
            // Remover dos favoritos
            const { error } = await supabase
              .from('user_favorites')
              .delete()
              .eq('user_id', user.id)
              .eq('workout_id', workoutId);

            if (error) {
              console.warn('⚠️ Erro ao remover favorito do Supabase:', error.message);
            } else {
              console.log('✅ Favorito removido');
              return false;
            }
          } else {
            // Adicionar aos favoritos
            const { error } = await supabase
              .from('user_favorites')
              .insert({
                user_id: user.id,
                workout_id: workoutId
              });

            if (error) {
              console.warn('⚠️ Erro ao adicionar favorito no Supabase:', error.message);
            } else {
              console.log('✅ Favorito adicionado');
              return true;
            }
          }
        }
      } catch (supabaseError) {
        console.warn('⚠️ Erro de conexão ao alterar favorito:', supabaseError);
      }
    }
    
    // Fallback para localStorage
    console.log('👤 Modo offline, usando localStorage');
    const savedFavorites = localStorage.getItem('workoutFavorites');
    let favorites: string[] = savedFavorites ? JSON.parse(savedFavorites) : [];
    
    const isFavorite = favorites.includes(workoutId);
    
    if (isFavorite) {
      favorites = favorites.filter(id => id !== workoutId);
    } else {
      favorites.push(workoutId);
    }
    
    localStorage.setItem('workoutFavorites', JSON.stringify(favorites));
    console.log('✅ Favorito atualizado no localStorage');
    return !isFavorite;
    
  } catch (error) {
    console.warn('⚠️ Erro ao alterar favorito:', error);
    throw error;
  }
};

// Função para salvar histórico de treinos
export const saveWorkoutHistory = async (workoutId: string, durationMinutes?: number, notes?: string): Promise<void> => {
  console.log('📝 Salvando histórico de treino:', workoutId);
  
  try {
    // Se Supabase estiver configurado, usar Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('👤 Usuário não autenticado, usando localStorage');
        } else {
          const { error } = await supabase
            .from('user_workout_history')
            .insert({
              user_id: user.id,
              workout_id: workoutId,
              duration_minutes: durationMinutes,
              notes: notes
            });

          if (error) {
            console.warn('⚠️ Erro ao salvar histórico no Supabase:', error.message);
          } else {
            console.log('✅ Histórico salvo no Supabase');
            
            // Atualizar progresso após salvar histórico
            const workout = await fetchWorkoutById(workoutId);
            await updateProgressAfterWorkout(durationMinutes || workout.durationMinutes, workout.calories);
            return;
          }
        }
      } catch (supabaseError) {
        console.warn('⚠️ Erro de conexão ao salvar histórico:', supabaseError);
      }
    }
    
    // Fallback para localStorage
    console.log('👤 Modo offline, salvando no localStorage');
    const savedHistory = localStorage.getItem('workoutHistory');
    let history: any[] = savedHistory ? JSON.parse(savedHistory) : [];
    
    history.push({
      id: Date.now().toString(),
      workout_id: workoutId,
      completed_at: new Date().toISOString(),
      duration_minutes: durationMinutes,
      notes: notes
    });
    
    localStorage.setItem('workoutHistory', JSON.stringify(history));
    console.log('✅ Histórico salvo no localStorage');

    // Atualizar progresso após salvar histórico
    const workout = await fetchWorkoutById(workoutId);
    await updateProgressAfterWorkout(durationMinutes || workout.durationMinutes, workout.calories);
    
  } catch (error) {
    console.warn('⚠️ Erro ao salvar histórico:', error);
    throw error;
  }
};

// Função para buscar histórico de treinos
export const fetchWorkoutHistory = async (): Promise<any[]> => {
  console.log('📊 Carregando histórico de treinos...');
  
  try {
    // Se Supabase estiver configurado, usar Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('👤 Usuário não autenticado');
          return [];
        }

        const { data, error } = await supabase
          .from('user_workout_history')
          .select(`
            *,
            workouts (
              name,
              duration,
              calories
            )
          `)
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (error) {
          console.warn('⚠️ Erro ao buscar histórico do Supabase:', error.message);
        } else {
          console.log('✅ Histórico carregado do Supabase:', data?.length || 0);
          return data || [];
        }
      } catch (supabaseError) {
        console.warn('⚠️ Erro de conexão ao buscar histórico:', supabaseError);
      }
    }
    
    // Fallback para localStorage
    console.log('👤 Modo offline, usando localStorage');
    const savedHistory = localStorage.getItem('workoutHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
    
  } catch (error) {
    console.warn('⚠️ Erro ao carregar histórico:', error);
    return [];
  }
};