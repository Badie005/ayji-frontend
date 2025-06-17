import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MCQGroup, MCQQuestion } from '../../models/mcq.model';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-mcq-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mcq-viewer.component.html',
  styleUrls: ['./mcq-viewer.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition(':enter', [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class McqViewerComponent implements OnInit {
  @Input() mcqGroups: MCQGroup[] = [];
  @Input() courseId: string = '';
  @Output() updateProgress = new EventEmitter<number>();

  // UI State
  activeGroupIndex: number = 0;
  activeQuestionIndex: number = 0;
  groupCompleted: boolean[] = [];
  showResults: boolean = false;
  viewMode: 'start' | 'quiz' | 'results' = 'start';

  // Stats
  totalCorrect: number = 0;
  totalQuestions: number = 0;
  scorePercentage: number = 0;

  constructor(private progressService: ProgressService) { }

  ngOnInit(): void {
    if (this.mcqGroups?.length && this.courseId) {
      // Récupérer la progression sauvegardée du localStorage
      this.groupCompleted = this.progressService.initializeGroupCompletionStatus(
        this.courseId, 
        this.mcqGroups.length
      );
      
      // Calculer le nombre total de questions
      this.calculateTotalQuestions();
      
      // Émettre la progression actuelle pour mettre à jour l'interface
      const progressPercentage = this.progressService.getProgressPercentage(this.courseId);
      this.updateProgress.emit(progressPercentage);
      
      console.log(`Progression chargée pour le cours ${this.courseId}: ${progressPercentage}%`);
    }
  }

  private calculateTotalQuestions(): void {
    this.totalQuestions = this.mcqGroups.reduce((total, group) => total + group.questions.length, 0);
  }

  startMcq(groupIndex: number): void {
    this.activeGroupIndex = groupIndex;
    this.activeQuestionIndex = 0;
    this.viewMode = 'quiz';
  }

  selectAnswer(question: MCQQuestion, optionId: number): void {
    question.selectedOptionId = optionId;
  }

  isOptionSelected(question: MCQQuestion, optionId: number): boolean {
    return question.selectedOptionId === optionId;
  }

  nextQuestion(): void {
    const currentGroup = this.mcqGroups[this.activeGroupIndex];
    
    if (this.activeQuestionIndex < currentGroup.questions.length - 1) {
      // Move to next question in the current group
      this.activeQuestionIndex++;
    } else {
      // Current group completed
      this.groupCompleted[this.activeGroupIndex] = true;
      
      // Calculer le score du groupe et afficher les résultats
      this.calculateGroupScore(this.activeGroupIndex);
      this.viewMode = 'results';
      
      // Sauvegarder la progression
      this.saveUserProgress();
    }
  }
  
  /**
   * Sauvegarde la progression de l'utilisateur et met à jour l'interface
   */
  private saveUserProgress(): void {
    if (!this.courseId) return;
    
    // Enregistrer la progression dans le localStorage
    this.progressService.saveProgress(this.courseId, this.mcqGroups, this.groupCompleted);
    
    // Calculer et émettre le pourcentage de progression
    const completedGroups = this.groupCompleted.filter(Boolean).length;
    const progressPercentage = Math.round((completedGroups / this.mcqGroups.length) * 100);
    this.updateProgress.emit(progressPercentage);
  }

  previousQuestion(): void {
    if (this.activeQuestionIndex > 0) {
      this.activeQuestionIndex--;
    }
  }

  calculateGroupProgress(groupIndex: number): number {
    const group = this.mcqGroups[groupIndex];
    const answeredQuestions = group.questions.filter(q => q.selectedOptionId !== undefined).length;
    return Math.round((answeredQuestions / group.questions.length) * 100);
  }

  isGroupComplete(groupIndex: number): boolean {
    return this.groupCompleted[groupIndex];
  }

  showGroupResults(groupIndex: number): void {
    this.activeGroupIndex = groupIndex;
    this.calculateGroupScore(groupIndex);
    this.viewMode = 'results';
  }

  backToGroups(): void {
    this.viewMode = 'start';
  }
  
  restartQuiz(): void {
    // Réinitialiser les réponses sélectionnées pour ce groupe
    const currentGroup = this.mcqGroups[this.activeGroupIndex];
    currentGroup.questions.forEach(question => {
      question.selectedOptionId = undefined;
    });
    
    // Si le groupe était marqué comme complété, le marquer comme non complété
    if (this.groupCompleted[this.activeGroupIndex]) {
      this.groupCompleted[this.activeGroupIndex] = false;
      
      // Sauvegarder la progression mise à jour
      this.saveUserProgress();
    }
    
    // Revenir à la première question du groupe
    this.activeQuestionIndex = 0;
    
    // Changer le mode de vue pour recommencer le quiz
    this.viewMode = 'quiz';
  }

  calculateGroupScore(groupIndex: number): void {
    const group = this.mcqGroups[groupIndex];
    let correct = 0;
    
    group.questions.forEach(question => {
      if (question.selectedOptionId === question.correctAnswerId) {
        correct++;
      }
    });
    
    this.totalCorrect = correct;
    this.scorePercentage = Math.round((correct / group.questions.length) * 100);
  }

  getGroupClass(difficulty: string): string {
    switch(difficulty) {
      case 'facile': return 'group-easy';
      case 'facile-moyen': return 'group-easy-medium';
      case 'moyen': return 'group-medium';
      case 'moyen-difficile': return 'group-medium-hard';
      case 'difficile': return 'group-hard';
      case 'très-difficile': return 'group-very-hard';
      default: return '';
    }
  }

  getDifficultyLabel(difficulty: string): string {
    switch(difficulty) {
      case 'facile': return 'Facile';
      case 'facile-moyen': return 'Facile-Moyen';
      case 'moyen': return 'Moyen';
      case 'moyen-difficile': return 'Moyen-Difficile';
      case 'difficile': return 'Difficile';
      case 'très-difficile': return 'Très Difficile';
      default: return '';
    }
  }

  isAllGroupsCompleted(): boolean {
    return this.groupCompleted.every(Boolean) && this.groupCompleted.length > 0;
  }

  // Helper for score indication
  getScoreClass(score: number): string {
    if (score < 40) return 'score-low';
    if (score < 70) return 'score-medium';
    return 'score-high';
  }

  // Determine if a question is answered correctly
  isCorrectAnswer(question: MCQQuestion): boolean {
    return question.selectedOptionId !== undefined && question.selectedOptionId === question.correctAnswerId;
  }

  // Determine if a specific option is the correct answer
  isCorrectOption(question: MCQQuestion, optionId: number): boolean {
    return optionId === question.correctAnswerId;
  }
}
