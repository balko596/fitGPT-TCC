# 📊 Diagrama do Banco de Dados - Workout AI

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              auth.users (Supabase)                          │
│                                   [Sistema]                                 │
└────────────────────────┬───────────────────────────────────┬────────────────┘
                         │                                   │
                         │ (1:1)                             │ (1:N)
                         │                                   │
        ┌────────────────▼──────────────────┐   ┌───────────▼─────────────────────┐
        │         profiles                  │   │        workouts                 │
        ├───────────────────────────────────┤   ├─────────────────────────────────┤
        │ • id (PK, FK → auth.users)        │   │ • id (PK)                       │
        │ • name                            │   │ • name                          │
        │ • avatar_url                      │   │ • difficulty                    │
        │ • age                             │   │ • muscle_groups []              │
        │ • height                          │   │ • duration                      │
        │ • weight                          │   │ • duration_minutes              │
        │ • fitness_level                   │   │ • calories                      │
        │ • goals []                        │   │ • equipment []                  │
        │ • preferred_workouts []           │   │ • exercises (JSONB)             │
        │ • created_at                      │   │ • instructions                  │
        │ • updated_at                      │   │ • is_custom                     │
        └───────────────────────────────────┘   │ • created_by (FK → auth.users)  │
                                                 │ • created_at                    │
                                                 │ • updated_at                    │
                                                 └──────┬──────────────────────────┘
                                                        │
                        ┌───────────────────────────────┼───────────────────────────┐
                        │ (N:M)                         │ (1:N)                     │ (1:N)
                        │                               │                           │
        ┌───────────────▼──────────────────┐   ┌────────▼──────────────────┐   ┌──▼─────────────────────────┐
        │      user_favorites              │   │ user_workout_schedule     │   │  user_workout_history      │
        ├──────────────────────────────────┤   ├───────────────────────────┤   ├────────────────────────────┤
        │ • id (PK)                        │   │ • id (PK)                 │   │ • id (PK)                  │
        │ • user_id (FK → auth.users)      │   │ • user_id (FK → users)    │   │ • user_id (FK → users)     │
        │ • workout_id (FK → workouts)     │   │ • workout_id (FK)         │   │ • workout_id (FK)          │
        │ • created_at                     │   │ • scheduled_date          │   │ • completed_at             │
        └──────────────────────────────────┘   │ • scheduled_time          │   │ • duration_minutes         │
                                                │ • notes                   │   │ • notes                    │
                                                │ • completed               │   └────────────────────────────┘
                                                │ • created_at              │
                                                │ • updated_at              │
                                                └───────────────────────────┘

        ┌────────────────────────────────────────────────────────────────────┐
        │                   user_progress_stats                              │
        ├────────────────────────────────────────────────────────────────────┤
        │ • id (PK)                                                          │
        │ • user_id (FK → auth.users)                                        │
        │ • week_start_date                                                  │
        │ • month_start_date                                                 │
        │ • weekly_workouts_completed / weekly_workouts_goal                 │
        │ • monthly_workouts_completed / monthly_workouts_goal               │
        │ • total_workouts_completed                                         │
        │ • current_streak / longest_streak                                  │
        │ • total_minutes_exercised                                          │
        │ • total_calories_burned                                            │
        │ • created_at / updated_at                                          │
        └────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Descrição das Tabelas

### 🔐 **auth.users** (Gerenciada pelo Supabase)
Sistema de autenticação nativo do Supabase. Armazena credenciais e informações básicas dos usuários.

---

### 👤 **profiles**
Perfil completo do usuário com informações pessoais e preferências de treino.

**Relacionamentos:**
- `1:1` com `auth.users` (cada usuário tem um perfil)

**Campos principais:**
- Dados pessoais: nome, avatar, idade, altura, peso
- Nível de fitness e objetivos
- Preferências de treino

---

### 💪 **workouts**
Biblioteca de treinos (pré-cadastrados ou gerados por IA).

**Relacionamentos:**
- `N:1` com `auth.users` (treinos personalizados criados por usuários)
- `1:N` com `user_favorites`, `user_workout_schedule`, `user_workout_history`

**Campos principais:**
- Informações do treino: nome, dificuldade, duração
- Grupos musculares e equipamentos
- Lista de exercícios (JSONB)
- Flag `is_custom` para treinos personalizados

---

### ⭐ **user_favorites**
Treinos favoritados pelo usuário (relação N:M).

**Relacionamentos:**
- `N:1` com `auth.users`
- `N:1` com `workouts`

---

### 📅 **user_workout_schedule**
Agenda de treinos do usuário.

**Relacionamentos:**
- `N:1` com `auth.users`
- `N:1` com `workouts`

**Campos principais:**
- Data e hora agendadas
- Notas pessoais
- Status de conclusão

---

### 📜 **user_workout_history**
Histórico de treinos completados.

**Relacionamentos:**
- `N:1` com `auth.users`
- `N:1` com `workouts`

**Campos principais:**
- Data de conclusão
- Duração real do treino
- Notas sobre a execução

---

### 📊 **user_progress_stats**
Estatísticas e métricas de progresso do usuário.

**Relacionamentos:**
- `N:1` com `auth.users`

**Métricas rastreadas:**
- Metas semanais e mensais
- Sequências (streaks) de treinos
- Total de minutos exercitados
- Calorias queimadas

---

## 🔒 Segurança (RLS - Row Level Security)

**Todas as tabelas possuem RLS ativado!**

Políticas aplicadas:
- ✅ Usuários podem acessar **apenas seus próprios dados**
- ✅ Treinos públicos são visíveis para todos
- ✅ Treinos personalizados são privados ao criador
- ✅ Operações CRUD restritas por `auth.uid()`

---

## 🔄 Fluxo de Dados Principal

1. **Usuário se registra** → Cria registro em `auth.users` e `profiles`
2. **Navega por treinos** → Lê de `workouts`
3. **Favorita um treino** → Cria registro em `user_favorites`
4. **Agenda um treino** → Cria registro em `user_workout_schedule`
5. **Completa o treino** → Move para `user_workout_history`
6. **Atualiza estatísticas** → `user_progress_stats` é atualizado automaticamente

---

## 🎯 Edge Functions

### **generate-workout**
- Gera treinos personalizados usando OpenAI GPT-3.5
- Insere novos treinos na tabela `workouts` com `is_custom=true`
- Associa ao usuário via `created_by`

---

## 🗂️ Tipos de Dados Especiais

- `JSONB` → `workouts.exercises` (array de objetos com detalhes dos exercícios)
- `ARRAY` → `muscle_groups`, `equipment`, `goals`, `preferred_workouts`
- `timestamptz` → Timestamps com timezone

---

**Total de Tabelas:** 6
**Total de Relacionamentos:** 9
**RLS Ativado:** ✅ 100%
