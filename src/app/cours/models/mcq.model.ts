export interface MCQOption {
  id: number;
  text: string;
}

export interface MCQQuestion {
  id: number;
  text: string;
  options: MCQOption[];
  correctAnswerId: number;
  selectedOptionId?: number;
  explanation: string;
}

export interface MCQGroup {
  id: number;
  title: string;
  difficulty: 'facile' | 'facile-moyen' | 'moyen' | 'moyen-difficile' | 'difficile' | 'très-difficile';
  difficultyLevel: number; // 1-6
  questions: MCQQuestion[];
}
