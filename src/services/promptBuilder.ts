interface WorkoutPreferences {
  fitnessLevel: string;
  duration: string;
  goal: string;
  equipment: string[];
  focusAreas: string[];
}

const translateToPortuguese = {
  fitnessLevel: {
    'iniciante': 'iniciante',
    'intermediario': 'intermediário',
    'avancado': 'avançado'
  },
  duration: {
    'curto': '25 minutos',
    'medio': '45 minutos',
    'longo': '65 minutos'
  },
  goal: {
    'forca': 'desenvolvimento de força',
    'hipertrofia': 'ganho de massa muscular (hipertrofia)',
    'resistencia': 'resistência muscular',
    'perda-peso': 'perda de peso e queima de gordura',
    'tonificacao': 'tonificação e definição muscular'
  },
  equipment: {
    'nenhum': 'apenas peso corporal',
    'halteres': 'halteres',
    'barra': 'barra',
    'kettlebell': 'kettlebell',
    'faixas-elasticas': 'faixas elásticas',
    'maquinas': 'máquinas de academia',
    'barra-fixa': 'barra fixa'
  },
  focusAreas: {
    'corpo-todo': 'corpo todo',
    'parte-superior': 'parte superior do corpo',
    'parte-inferior': 'parte inferior do corpo',
    'core': 'core e abdômen',
    'peito': 'peitoral',
    'costas': 'costas',
    'pernas': 'pernas',
    'bracos': 'braços',
    'ombros': 'ombros'
  }
};

export const buildWorkoutPrompt = (preferences: WorkoutPreferences): string => {
  const { fitnessLevel, duration, goal, equipment, focusAreas } = preferences;

  const levelPt = translateToPortuguese.fitnessLevel[fitnessLevel] || fitnessLevel;
  const durationPt = translateToPortuguese.duration[duration] || duration;
  const goalPt = translateToPortuguese.goal[goal] || goal;
  const equipmentPt = equipment
    .map(e => translateToPortuguese.equipment[e] || e)
    .join(', ');
  const focusAreasPt = focusAreas
    .map(a => translateToPortuguese.focusAreas[a] || a)
    .join(', ');

  const prompt = `Crie um plano de treino personalizado com as seguintes características:

PERFIL DO ALUNO:
- Nível de condicionamento: ${levelPt}
- Objetivo principal: ${goalPt}

ESPECIFICAÇÕES DO TREINO:
- Duração total: ${durationPt}
- Equipamentos disponíveis: ${equipmentPt}
- Áreas de foco: ${focusAreasPt}

REQUISITOS:
1. Crie um treino completo e balanceado
2. Inclua 4-6 exercícios diferentes
3. Para cada exercício, especifique:
   - Nome do exercício em português
   - Número de séries (sets)
   - Número de repetições ou tempo (reps)
   - Tempo de descanso (restTime)
   - Instruções detalhadas de execução (instructions)
   - URL de imagem do Pexels relacionada ao exercício (imageUrl) - use URLs válidas do Pexels como: https://images.pexels.com/photos/[ID]/pexels-photo-[ID].jpeg?auto=compress&cs=tinysrgb&w=600

4. Ajuste a intensidade para o nível ${levelPt}:
   ${fitnessLevel === 'iniciante' ? '- Use menos séries e repetições\n   - Inclua mais tempo de descanso\n   - Prefira exercícios mais simples' : ''}
   ${fitnessLevel === 'intermediario' ? '- Use séries e repetições moderadas\n   - Combine exercícios compostos e isolados' : ''}
   ${fitnessLevel === 'avancado' ? '- Use mais séries e repetições\n   - Inclua exercícios mais complexos\n   - Reduza o tempo de descanso' : ''}

5. Foque no objetivo de ${goalPt}:
   ${goal === 'forca' ? '- Use cargas mais pesadas (6-8 reps)\n   - Descanso maior entre séries (90-120 seg)' : ''}
   ${goal === 'hipertrofia' ? '- Use volume moderado (8-12 reps)\n   - Tempo sob tensão maior' : ''}
   ${goal === 'resistencia' ? '- Use mais repetições (15-20 reps)\n   - Menos descanso entre séries (30-45 seg)' : ''}
   ${goal === 'perda-peso' ? '- Inclua elementos de alta intensidade\n   - Minimize o descanso\n   - Foque em exercícios compostos' : ''}
   ${goal === 'tonificacao' ? '- Combine força e resistência (10-15 reps)\n   - Exercícios variados' : ''}

FORMATO DE RESPOSTA (JSON):
Retorne APENAS um objeto JSON válido (sem texto adicional) com esta estrutura exata:

{
  "name": "Nome criativo do treino",
  "difficulty": "${levelPt.charAt(0).toUpperCase() + levelPt.slice(1)}",
  "muscleGroups": ["Grupo1", "Grupo2"],
  "duration": "${durationPt}",
  "durationMinutes": ${duration === 'curto' ? 25 : duration === 'medio' ? 45 : 65},
  "calories": ${duration === 'curto' ? 200 : duration === 'medio' ? 350 : 500},
  "equipment": ["${equipment.map(e => e.charAt(0).toUpperCase() + e.slice(1)).join('", "')}"],
  "exercises": [
    {
      "name": "Nome do exercício",
      "sets": 3,
      "reps": "10-12",
      "restTime": "60 seg",
      "instructions": "Instruções detalhadas de como executar",
      "imageUrl": "https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ],
  "instructions": "Instruções gerais do treino completo"
}

IMPORTANTE:
- Retorne APENAS o JSON, sem texto antes ou depois
- Todos os textos devem estar em português
- Use URLs reais e válidas do Pexels
- Seja criativo com o nome do treino
- As instruções devem ser claras e motivadoras`;

  return prompt;
};
