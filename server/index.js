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

// Endpoint para gerar treino com GPT
app.post('/api/generate-workout', async (req, res) => {
  try {
    console.log('🤖 Recebendo solicitação de geração de treino:', req.body);
    
    if (!openai) {
      console.warn('⚠️ OpenAI não configurado, retornando erro');
      return res.status(503).json({ 
        error: 'Serviço de IA temporariamente indisponível. Configure OPENAI_API_KEY.' 
      });
    }
    
    const { prompt, fitnessLevel, duration, goal, equipment, focusAreas } = req.body;
    
    // Validar campos obrigatórios
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }
    
    console.log('🔄 Enviando prompt para OpenAI...');
    
    // Chamar OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Você é um personal trainer especialista em criar planos de treino personalizados. Sempre responda apenas com JSON válido, sem texto adicional.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 1500,
    });
    
    console.log('✅ Resposta recebida do OpenAI');
    
    // Parse da resposta
    const workoutString = completion.choices[0].message.content;
    console.log('📝 Conteúdo da resposta:', workoutString);
    
    let workoutJson;
    try {
      workoutJson = JSON.parse(workoutString);
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError);
      console.log('📄 Conteúdo que falhou no parse:', workoutString);
      
      // Tentar extrair JSON da resposta se houver texto extra
      const jsonMatch = workoutString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          workoutJson = JSON.parse(jsonMatch[0]);
          console.log('✅ JSON extraído com sucesso');
        } catch (secondParseError) {
          console.error('❌ Falha na segunda tentativa de parse:', secondParseError);
          throw new Error('Resposta da IA não está em formato JSON válido');
        }
      } else {
        throw new Error('Nenhum JSON encontrado na resposta da IA');
      }
    }
    
    // Validar estrutura do JSON
    if (!workoutJson.name || !workoutJson.exercises || !Array.isArray(workoutJson.exercises)) {
      console.error('❌ Estrutura JSON inválida:', workoutJson);
      throw new Error('Estrutura de treino inválida retornada pela IA');
    }
    
    console.log('✅ Treino gerado com sucesso:', workoutJson.name);
    
    res.json(workoutJson);
  } catch (error) {
    console.error('❌ Erro ao gerar treino:', error);
    
    // Retornar erro específico baseado no tipo
    if (error.code === 'insufficient_quota') {
      res.status(429).json({ 
        error: 'Cota da API OpenAI excedida. Tente novamente mais tarde.' 
      });
    } else if (error.code === 'rate_limit_exceeded') {
      res.status(429).json({ 
        error: 'Muitas solicitações. Aguarde um momento e tente novamente.' 
      });
    } else if (error.message?.includes('API key')) {
      res.status(401).json({ 
        error: 'Erro de autenticação com a API de IA.' 
      });
    } else {
      res.status(500).json({ 
        error: 'Erro interno do servidor ao gerar treino. Tente novamente.' 
      });
    }
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