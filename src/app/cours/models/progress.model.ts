export interface PDFProgress {
  documentId: string;
  documentType: 'cours' | 'exercice' | 'correction';
  opened: boolean;
  pagesViewed: number[];
  totalPages: number;
  timeSpent: number; // en secondes
  estimatedReadTime: number; // en secondes
  lastPosition: number; // dernière page vue
  completionPercentage: number;
  lastAccessed: Date;
}

export interface QCMProgress {
  groupId: number;
  groupTitle: string;
  attempted: boolean;
  completed: boolean;
  questionsTotal: number;
  questionsAnswered: number;
  correctAnswers: number;
  score: number; // pourcentage de bonnes réponses
  highestScore?: number; // meilleur score obtenu (optionnel)
  completionPercentage: number;
  lastAccessed: Date;
}

export interface ModuleProgress {
  moduleId: string;
  title: string;
  pdfProgressList: PDFProgress[];
  qcmProgressList: QCMProgress[];
  pdfWeight: number; // Pondération des PDF dans le calcul du module
  qcmWeight: number; // Pondération des QCM dans le calcul du module
  completionPercentage: number;
  lastAccessed: Date;
}

export interface CourseProgress {
  courseId: string;
  title: string;
  modules: ModuleProgress[];
  completionPercentage: number;
  lastAccessed: Date;
}

// Interface simplifiée pour la rétrocompatibilité
export interface LegacyCourseProgress {
  courseId: string;
  groupsCompleted: number[];
  totalGroups: number;
  completionPercentage: number;
  lastAccessed: Date;
}
