# FitGPT - Planos de Treino com IA

Uma aplicação moderna para geração de planos de treino personalizados usando inteligência artificial.

## 🚀 Funcionalidades

- ✅ **Geração de Treinos com IA** - Treinos personalizados usando GPT
- ✅ **Sistema de Autenticação** - Login seguro com Supabase
- ✅ **Favoritos e Histórico** - Salve seus treinos preferidos
- ✅ **Agenda de Treinos** - Planeje sua semana de exercícios
- ✅ **Acompanhamento de Progresso** - Estatísticas detalhadas
- ✅ **Encontrar Academias** - Localize academias próximas
- ✅ **Modo Offline** - Funciona sem configuração externa

## 🛠️ Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas chaves:

```env
# Supabase (Obrigatório para persistência de dados)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima

# OpenAI (Opcional - para geração de treinos com IA)
OPENAI_API_KEY=sua-chave-openai

# Google Maps (Opcional - para encontrar academias)
VITE_GOOGLE_MAPS_API_KEY=sua-chave-google-maps
```

### 3. Configurar Supabase

#### 3.1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta e um novo projeto
3. Anote a URL e a chave anônima do projeto

#### 3.2. Executar Migrações

No painel do Supabase, vá para "SQL Editor" e execute as migrações na ordem:

1. `supabase/migrations/20250616060350_curly_field.sql`
2. `supabase/migrations/20250616060847_wild_plain.sql`
3. `supabase/migrations/20250618005613_noisy_sky.sql`
4. `supabase/migrations/20250618010200_raspy_gate.sql`
5. `supabase/migrations/20250618015255_heavy_gate.sql`

### 4. Executar a Aplicação

```bash
# Desenvolvimento
npm run dev

# Servidor backend (se usar OpenAI)
npm run server

# Ambos simultaneamente
npm run dev:all
```

## 🔧 Configurações Opcionais

### OpenAI (Geração de Treinos com IA)

Para habilitar a geração de treinos com IA:

1. Crie uma conta na [OpenAI](https://platform.openai.com)
2. Gere uma API key
3. Adicione a chave no arquivo `.env`
4. Execute `npm run server` para o backend

### Google Maps (Encontrar Academias)

Para habilitar a busca de academias:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Ative a Maps JavaScript API
3. Gere uma API key
4. Adicione a chave no arquivo `.env`

## 📱 Como Usar

### Modo Offline (Padrão)

A aplicação funciona completamente offline com:
- Dados de exemplo pré-carregados
- Login de teste: `teste@fitgpt.com` / `123456`
- Geração de treinos usando templates locais

### Modo Online (Com Supabase)

Com Supabase configurado:
- Criação de contas reais
- Sincronização entre dispositivos
- Persistência de dados na nuvem

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Contextos React (Auth, Workout)
├── pages/              # Páginas da aplicação
├── services/           # Serviços (API, Supabase)
├── types/              # Tipos TypeScript
└── lib/                # Configurações (Supabase)

supabase/
└── migrations/         # Migrações do banco de dados

server/
└── index.js           # Servidor Express (OpenAI)
```

## 🚀 Deploy

### Netlify (Recomendado)

1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Vercel

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

## 🔒 Segurança

- ✅ Row Level Security (RLS) habilitado no Supabase
- ✅ Autenticação segura com JWT
- ✅ Validação de dados no frontend e backend
- ✅ Sanitização de inputs

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## 🆘 Suporte

Se encontrar problemas:

1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme que as migrações do Supabase foram executadas
3. Consulte os logs do console para erros específicos
4. Abra uma issue no GitHub com detalhes do problema

---

**Desenvolvido com ❤️ usando React, TypeScript, Tailwind CSS e Supabase**