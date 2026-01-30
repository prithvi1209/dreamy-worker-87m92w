export interface User {
  id: string;
  email: string;
  phone: string;
  createdAt: string;
}

export type FlashcardType =
  | "basic"
  | "application"
  | "quiz"
  | "mcq"
  | "fill-blank";

export interface Flashcard {
  id: string;
  type: FlashcardType;
  front: string;
  back: string;
  topic?: string;
  tags?: string[];
  difficulty?: "easy" | "medium" | "hard";
  options?: string[]; // For MCQ
  correctAnswer?: string; // For MCQ and Fill-in-blank
  explanation?: string;
}

export interface FlashcardCollection {
  id: string;
  name: string;
  description?: string;
  flashcards: Flashcard[];
  createdAt: string;
  updatedAt: string;
  revisionSchedule?: {
    interval: number; // in days
    nextRevision: string;
    lastRevised?: string;
  };
  isLocked?: boolean;
  lockedUntil?: string;
  tags?: string[];
}

export interface GenerationOptions {
  includeBasic: boolean;
  includeApplication: boolean;
  includeQuiz: boolean;
  includeMCQ: boolean;
  includeFillBlank: boolean;
  numberOfCards: number;
  difficulty: "easy" | "medium" | "hard" | "mixed";
}
