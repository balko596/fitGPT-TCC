export interface Exercise {
  name: string;
  sets: number;
  reps: string; // Can be "10" or "8-12" or "Until failure"
  restTime: string;
  instructions: string;
  imageUrl?: string;
}

export interface Workout {
  id: string;
  name: string;
  difficulty: string;
  muscleGroups: string[];
  duration: string;
  durationMinutes: number;
  exercises: Exercise[];
  equipment: string[];
  calories: number;
  instructions?: string;
}