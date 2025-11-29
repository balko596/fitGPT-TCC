import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "npm:openai@4.17.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface WorkoutRequest {
  prompt: string;
  fitnessLevel?: string;
  duration?: string;
  goal?: string;
  equipment?: string[];
  focusAreas?: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Chave da API OpenAI não configurada" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const openai = new OpenAI({ apiKey });
    const body: WorkoutRequest = await req.json();

    const systemPrompt = `Você é um personal trainer especializado. Gere treinos no formato JSON EXATO abaixo.

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional antes ou depois.

Formato obrigatório:
{
  "name": "Nome do Treino",
  "description": "Descrição detalhada",
  "difficulty": "iniciante" | "intermediario" | "avancado",
  "duration": 20-60 (minutos),
  "category": "forca" | "cardio" | "flexibilidade" | "hiit",
  "exercises": [
    {
      "name": "Nome do exercício",
      "sets": número,
      "reps": "número de repetições ou tempo",
      "rest": "tempo de descanso",
      "instructions": "Instruções detalhadas"
    }
  ]
}`;

    const userPrompt = `${body.prompt}

Nível: ${body.fitnessLevel || 'intermediario'}
Duração: ${body.duration || 'medio'}
Objetivo: ${body.goal || 'saude'}
Equipamentos: ${body.equipment?.join(', ') || 'nenhum'}
Áreas de foco: ${body.focusAreas?.join(', ') || 'corpo todo'}

Retorne APENAS o JSON do treino, sem texto adicional.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "Resposta vazia da IA" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let workout;
    try {
      const cleanedContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      workout = JSON.parse(cleanedContent);

      if (!workout.name || !workout.exercises || !Array.isArray(workout.exercises)) {
        throw new Error("Estrutura inválida");
      }

      if (workout.exercises.length === 0) {
        throw new Error("Nenhum exercício retornado");
      }

      workout.exercises.forEach((ex: any, index: number) => {
        if (!ex.name || !ex.instructions) {
          throw new Error(`Exercício ${index + 1} está incompleto`);
        }
      });

    } catch (parseError) {
      console.error("Erro ao validar treino:", parseError);
      console.error("Conteúdo recebido:", content);

      return new Response(
        JSON.stringify({
          error: "Estrutura de treino inválida retornada pela IA",
          details: parseError instanceof Error ? parseError.message : "Erro desconhecido"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(workout), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Erro na função:", error);

    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";

    if (errorMessage.includes("quota") || errorMessage.includes("billing")) {
      return new Response(
        JSON.stringify({ error: "Cota da API OpenAI excedida. Verifique sua conta em platform.openai.com" }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
