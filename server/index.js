import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('✅ OpenAI configurado com sucesso');
} else {
  console.warn('⚠️ OPENAI_API_KEY não encontrada. Funcionalidade de IA desabilitada.');
}

app.post('/api/generate-workout', async (req, res) => {
  try {
    console.log('🤖 Recebendo solicitação de geração de treino');
    console.log('📋 Preferências:', {
      fitnessLevel: req.body.fitnessLevel,
      duration: req.body.duration,
      goal: req.body.goal,
      equipment: req.body.equipment?.join(', '),
      focusAreas: req.body.focusAreas?.join(', ')
    });

    if (!openai) {
      console.warn('⚠️ OpenAI não configurado, retornando erro');
      return res.status(503).json({
        error: 'Serviço de IA temporariamente indisponível. Configure OPENAI_API_KEY no arquivo .env'
      });
    }

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }

    console.log('🔄 Enviando prompt para OpenAI GPT-3.5-turbo...');
    console.log('📝 Tamanho do prompt:', prompt.length, 'caracteres');

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Você é um personal trainer especialista em criar planos de treino personalizados. Sempre responda APENAS com JSON válido, sem nenhum texto adicional antes ou depois. O JSON deve seguir exatamente a estrutura solicitada.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    console.log('✅ Resposta recebida do OpenAI');
    console.log('📊 Tokens usados:', completion.usage?.total_tokens || 'N/A');

    const workoutString = completion.choices[0].message.content.trim();
    console.log('📝 Primeiros 200 caracteres da resposta:', workoutString.substring(0, 200));

    let workoutJson;
    try {
      workoutJson = JSON.parse(workoutString);
      console.log('✅ JSON parseado com sucesso');
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError.message);
      console.log('📄 Conteúdo completo que falhou:', workoutString);

      const jsonMatch = workoutString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          workoutJson = JSON.parse(jsonMatch[0]);
          console.log('✅ JSON extraído com regex e parseado com sucesso');
        } catch (secondParseError) {
          console.error('❌ Falha na segunda tentativa de parse:', secondParseError.message);
          return res.status(500).json({
            error: 'Resposta da IA não está em formato JSON válido'
          });
        }
      } else {
        console.error('❌ Nenhum JSON encontrado na resposta');
        return res.status(500).json({
          error: 'Nenhum JSON encontrado na resposta da IA'
        });
      }
    }

    if (!workoutJson.name || !workoutJson.exercises || !Array.isArray(workoutJson.exercises)) {
      console.error('❌ Estrutura JSON inválida:', Object.keys(workoutJson));
      return res.status(500).json({
        error: 'Estrutura de treino inválida retornada pela IA'
      });
    }

    if (workoutJson.exercises.length === 0) {
      console.error('❌ Nenhum exercício no treino');
      return res.status(500).json({
        error: 'Treino gerado sem exercícios'
      });
    }

    console.log('✅ Treino gerado com sucesso:', workoutJson.name);
    console.log('💪 Número de exercícios:', workoutJson.exercises.length);

    res.json(workoutJson);
  } catch (error) {
    console.error('❌ Erro ao gerar treino:', error.message);
    console.error('🔍 Stack trace:', error.stack);

    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        error: 'Cota da API OpenAI excedida. Verifique sua conta em platform.openai.com'
      });
    }

    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        error: 'Muitas solicitações. Aguarde um momento e tente novamente.'
      });
    }

    if (error.message?.includes('API key') || error.code === 'invalid_api_key') {
      return res.status(401).json({
        error: 'Chave de API OpenAI inválida. Verifique o arquivo .env'
      });
    }

    res.status(500).json({
      error: 'Erro ao gerar treino com IA. Tente novamente.'
    });
  }
});

// Endpoint de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando!', 
    openaiConfigured: !!openai,
    timestamp: new Date().toISOString()
  });
});

// Endpoint para listar treinos (placeholder)
app.get('/api/workouts', (req, res) => {
  res.json({ message: 'Endpoint de treinos funcionando. Integre com banco de dados.' });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('❌ Erro não tratado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}`);
  if (openai) {
    console.log('🤖 Serviço de IA ativo');
  } else {
    console.log('⚠️ Serviço de IA inativo - configure OPENAI_API_KEY');
  }
});