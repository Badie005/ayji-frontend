import { Injectable } from '@angular/core';
import { MCQGroup, MCQQuestion } from '../models/mcq.model';
import { CourseProgress, ModuleProgress, PDFProgress, QCMProgress, LegacyCourseProgress } from '../models/progress.model';
import { BehaviorSubject, Observable, of, catchError, switchMap, tap, forkJoin, map } from 'rxjs';
import { ProgressApiService } from './progress-api.service';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  // Clés de stockage pour localStorage avec préfixe pour différencier les utilisateurs
  private readonly COURSE_PROGRESS_KEY_PREFIX = 'AYJI_COURSE_PROGRESS_';
  private readonly LEGACY_PROGRESS_KEY_PREFIX = 'AYJI_COURSE_PROGRESS_LEGACY_';
  
  // Métriques et pondérations pour le calcul de la progression
  private readonly PDF_METRICS = {
    OPEN_WEIGHT: 0.10,           // 10% pour l'ouverture simple
    PAGES_VIEWED_WEIGHT: 0.40,   // 40% pour les pages vues
    TIME_SPENT_WEIGHT: 0.50      // 50% pour le temps passé
  };
  
  private readonly QCM_METRICS = {
    ATTEMPT_WEIGHT: 0.20,         // 20% pour une tentative
    QUESTIONS_ANSWERED_WEIGHT: 0.30, // 30% pour les questions répondues
    COMPLETION_WEIGHT: 0.30,      // 30% pour avoir terminé le QCM
    SCORE_WEIGHT: 0.20           // 20% pour le score obtenu
  };
  
  // Poids par défaut des différents types de contenu
  private readonly DEFAULT_WEIGHTS = {
    COURS_PDF: 0.40,             // 40% pour les cours PDF
    EXERCICES_PDF: 0.15,         // 15% pour les exercices PDF
    CORRECTIONS_PDF: 0.15,       // 15% pour les corrections PDF
    QCM: 0.30                    // 30% pour les QCMs
  };

  // Flux Observable pour permettre aux composants de s'abonner aux changements de progression
  private courseProgressSubject = new BehaviorSubject<Map<string, CourseProgress>>(new Map());
  public courseProgress$ = this.courseProgressSubject.asObservable();
  
  // Indique si la synchronisation avec le serveur est en cours
  private isSyncing: boolean = false;
  
  // Indique si une tentative de synchronisation a échoué
  private syncFailed: boolean = false;
  
  constructor(
    private progressApiService: ProgressApiService,
    private authService: AuthService
  ) {
    // Charger les données de progression au démarrage du service
    this.loadProgressData();
    
    // Essayer de synchroniser avec le serveur si connecté
    this.syncWithServer();
    
    // S'abonner aux changements d'authentification
    this.authService.currentUser$.subscribe(user => {
      if (user && user.token) {
        // Changement d'utilisateur ou connexion :
        // 1) Réinitialiser la carte de progression en mémoire
        this.courseProgressSubject.next(new Map());
        // 2) Recharger les données locales spécifiques à cet utilisateur
        this.loadProgressData();
        // 3) Synchroniser avec le serveur
        this.syncWithServer();
      } else {
        // Déconnexion : vider totalement les données en mémoire
        this.courseProgressSubject.next(new Map());
      }
    });
  }
  
  /**
   * Synchronise les données avec le serveur
   * @returns Observable de la progression synchronisée ou du statut d'erreur
   */
  syncWithServer(): Observable<boolean> {
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.currentUserValue) {
      console.log('Synchronisation impossible : utilisateur non connecté');
      return of(false);
    }
    
    // Éviter les synchronisations simultanées
    if (this.isSyncing) {
      console.log('Synchronisation déjà en cours');
      return of(false);
    }
    
    this.isSyncing = true;
    
    return this.progressApiService.getAllProgress().pipe(
      switchMap(serverProgressList => {
        // Convertir la liste en Map pour faciliter les opérations
        const serverProgressMap = new Map<string, CourseProgress>();
        serverProgressList.forEach(progress => {
          serverProgressMap.set(progress.courseId, progress);
        });
        
        // Récupérer les données locales
        const localProgressMap = this.courseProgressSubject.getValue();
        
        // Fusionner les données locales et distantes
        this.mergeProgressData(localProgressMap, serverProgressMap);
        
        // Sauvegarder les données fusionnées sur le serveur
        return this.saveAllProgressToServer();
      }),
      tap(() => {
        this.isSyncing = false;
        this.syncFailed = false;
        console.log('Synchronisation avec le serveur réussie');
      }),
      catchError(error => {
        this.isSyncing = false;
        this.syncFailed = true;
        console.error('Erreur lors de la synchronisation avec le serveur:', error);
        return of(false);
      })
    );
  }
  
  /**
   * Fusionne les données de progression locales et distantes
   * Stratégie : conserver la version la plus récente ou la plus complète
   * @param localMap Map des données locales
   * @param serverMap Map des données du serveur
   */
  private mergeProgressData(
    localMap: Map<string, CourseProgress>,
    serverMap: Map<string, CourseProgress>
  ): void {
    const mergedMap = new Map<string, CourseProgress>();
    
    // Parcourir toutes les progressions locales
    localMap.forEach((localProgress, courseId) => {
      const serverProgress = serverMap.get(courseId);
      
      if (!serverProgress) {
        // Progression locale seulement, la conserver
        mergedMap.set(courseId, localProgress);
      } else {
        // Progression des deux côtés, fusionner
        const mergedProgress = this.chooseMostRecentProgress(localProgress, serverProgress);
        mergedMap.set(courseId, mergedProgress);
      }
    });
    
    // Ajouter les progressions du serveur non présentes en local
    serverMap.forEach((serverProgress, courseId) => {
      if (!localMap.has(courseId)) {
        mergedMap.set(courseId, serverProgress);
      }
    });
    
    // Mettre à jour le BehaviorSubject
    this.courseProgressSubject.next(mergedMap);
    
    // Sauvegarder les données fusionnées en local
    this.saveAllProgress();
  }
  
  /**
   * Choisit la progression la plus récente ou la plus complète entre deux versions
   * @param local Progression locale
   * @param server Progression du serveur
   * @returns Progression fusionnée
   */
  private chooseMostRecentProgress(local: CourseProgress, server: CourseProgress): CourseProgress {
    const localDate = new Date(local.lastAccessed);
    const serverDate = new Date(server.lastAccessed);
    
    // Si la version locale est plus récente, la préférer
    if (localDate > serverDate) {
      return local;
    }
    
    // Si la version du serveur est plus récente, la préférer
    if (serverDate > localDate) {
      return server;
    }
    
    // Si les dates sont identiques, choisir celle avec le pourcentage de complétion le plus élevé
    return local.completionPercentage >= server.completionPercentage ? local : server;
  }
  
  /**
   * Sauvegarde toutes les données de progression sur le serveur
   * @returns Observable du statut de sauvegarde
   */
  private saveAllProgressToServer(): Observable<boolean> {
    const progressMap = this.courseProgressSubject.getValue();
    const progressArray: CourseProgress[] = [];
    
    // Convertir la Map en tableau pour l'API
    progressMap.forEach(progress => {
      progressArray.push(progress);
    });
    
    // Si aucune donnée à sauvegarder, retourner directement
    if (progressArray.length === 0) {
      return of(true);
    }
    
    // Créer un tableau d'Observables pour chaque progression
    const saveRequests = progressArray.map(progress => 
      this.progressApiService.saveCourseProgress(progress).pipe(
        catchError(error => {
          console.error(`Erreur lors de la sauvegarde de la progression du cours ${progress.courseId}:`, error);
          return of(null); // Retourner null en cas d'erreur pour continuer avec les autres requêtes
        })
      )
    );
    
    // Exécuter toutes les requêtes en parallèle
    return forkJoin(saveRequests).pipe(
      map((results: (CourseProgress | null)[]) => {
        // Vérifier si toutes les sauvegardes ont réussi (aucun null dans les résultats)
        const allSuccess = results.every((result: CourseProgress | null) => result !== null);
        return allSuccess;
      }),
      catchError(error => {
        console.error('Erreur globale lors de la sauvegarde des progressions:', error);
        return of(false);
      })
    );
  }

  /**
   * Obtient la clé de stockage spécifique à l'utilisateur courant
   * @param prefix Le préfixe de la clé
   * @returns La clé complète avec l'ID utilisateur
   */
  private getUserSpecificKey(prefix: string): string {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser._id) {
      return `${prefix}${currentUser._id}`;
    }
    // Fallback pour les utilisateurs non authentifiés (utilise une session temporaire)
    return `${prefix}temp_session`;
  }

  /**
   * Obtient la clé de progression des cours pour l'utilisateur courant
   * @returns La clé de progression
   */
  private getCourseProgressKey(): string {
    return this.getUserSpecificKey(this.COURSE_PROGRESS_KEY_PREFIX);
  }

  /**
   * Obtient la clé de progression légacy pour l'utilisateur courant
   * @returns La clé de progression légacy
   */
  private getLegacyProgressKey(): string {
    return this.getUserSpecificKey(this.LEGACY_PROGRESS_KEY_PREFIX);
  }

  /**
   * Charge les données de progression du stockage local
   */
  private loadProgressData(): void {
    try {
      // Essayer de charger les données du nouveau format
      const progressKey = this.getCourseProgressKey();
      const progressData = localStorage.getItem(progressKey);
      
      if (progressData) {
        const progressMap = new Map<string, CourseProgress>();
        const parsedData = JSON.parse(progressData);
        Object.keys(parsedData).forEach(courseId => {
          progressMap.set(courseId, parsedData[courseId]);
        });
        this.courseProgressSubject.next(progressMap);
      } else {
        // Essayer de charger les données de l'ancien format pour la migration
        this.migrateLegacyData();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de progression:', error);
    }
  }

  /**
   * Migre les données de l'ancien format vers le nouveau format
   */
  private migrateLegacyData(): void {
    try {
      const legacyKey = this.getLegacyProgressKey();
      const legacyData = localStorage.getItem(legacyKey);
      if (legacyData) {
        const legacyProgressList: LegacyCourseProgress[] = JSON.parse(legacyData);
        const progressMap = new Map<string, CourseProgress>();
        
        legacyProgressList.forEach(legacyProgress => {
          // Créer les modules pour le nouveau format
          const modules: ModuleProgress[] = [];
          
          // Créer les QCM progress basés sur les anciens groupes complétés
          const qcmProgressList: QCMProgress[] = legacyProgress.groupsCompleted.map(groupIndex => ({
            groupId: groupIndex,
            groupTitle: `Groupe ${groupIndex + 1}`,
            attempted: true,
            completed: true,
            questionsTotal: 6, // valeur par défaut
            questionsAnswered: 6,
            correctAnswers: 0, // information non disponible dans l'ancien format
            score: 0, // information non disponible dans l'ancien format
            completionPercentage: 100,
            lastAccessed: legacyProgress.lastAccessed
          }));
          
          // Créer un module unique pour tout le cours (simplification pour la migration)
          if (qcmProgressList.length > 0) {
            modules.push({
              moduleId: `${legacyProgress.courseId}-module-1`,
              title: 'Module principal',
              pdfProgressList: [],
              qcmProgressList,
              pdfWeight: this.DEFAULT_WEIGHTS.COURS_PDF + this.DEFAULT_WEIGHTS.EXERCICES_PDF + this.DEFAULT_WEIGHTS.CORRECTIONS_PDF,
              qcmWeight: this.DEFAULT_WEIGHTS.QCM,
              completionPercentage: legacyProgress.completionPercentage,
              lastAccessed: legacyProgress.lastAccessed
            });
          }
          
          // Créer la progression du cours dans le nouveau format
          const courseProgress: CourseProgress = {
            courseId: legacyProgress.courseId,
            title: `Cours ${legacyProgress.courseId}`,
            modules,
            completionPercentage: legacyProgress.completionPercentage,
            lastAccessed: new Date(legacyProgress.lastAccessed)
          };
          
          progressMap.set(legacyProgress.courseId, courseProgress);
        });
        
        // Mettre à jour le BehaviorSubject
        this.courseProgressSubject.next(progressMap);
        
        // Sauvegarder les données migrées dans le nouveau format
        this.saveAllProgress();
      }
    } catch (error) {
      console.error('Erreur lors de la migration des données de progression:', error);
    }
  }
  
  /**
   * Sauvegarde la progression complète dans le localStorage et tente de synchroniser avec le serveur
   * @param syncWithServer Indique si la synchronisation avec le serveur doit être tentée
   */
  private saveAllProgress(syncWithServer: boolean = false): void {
    const progressMap = this.courseProgressSubject.getValue();
    const progressObject: {[key: string]: CourseProgress} = {};
    
    progressMap.forEach((value, key) => {
      progressObject[key] = value;
    });
    
    // Sauvegarder dans le localStorage avec la clé spécifique à l'utilisateur
    const progressKey = this.getCourseProgressKey();
    localStorage.setItem(progressKey, JSON.stringify(progressObject));
    
    // Synchroniser avec le serveur si demandé et si l'utilisateur est connecté
    if (syncWithServer && this.authService.currentUserValue) {
      this.saveAllProgressToServer().subscribe(success => {
        if (success) {
          console.log('Synchronisation des données de progression réussie');
        } else {
          console.warn('Synchronisation des données de progression échouée');
        }
      });
    }
  }

  /**
   * Récupère la progression d'un cours spécifique
   * @param courseId ID du cours
   * @returns Objet de progression ou null si aucune progression n'existe
   */
  getProgress(courseId: string): CourseProgress | null {
    if (!courseId) return null;
    
    const progressMap = this.courseProgressSubject.getValue();
    return progressMap.get(courseId) || null;
  }

  /**
   * Sauvegarde la progression d'un cours (pour compatibilité avec l'ancien système)
   * Cette méthode est maintenue pour la rétrocompatibilité avec le code existant
   * @param courseId ID du cours
   * @param mcqGroups Groupes de QCM avec leurs états
   * @param groupsCompleted Tableau d'état de complétion des groupes
   */
  saveProgress(courseId: string, mcqGroups: MCQGroup[], groupsCompleted: boolean[]): void {
    if (!courseId) return;
    
    // Convertir le tableau de booléens en index de groupes complétés
    const completedGroupsIndexes = groupsCompleted
      .map((isCompleted, index) => isCompleted ? index : -1)
      .filter(index => index !== -1);
      
    // Calculer le pourcentage global
    const completionPercentage = mcqGroups.length > 0 
      ? Math.round((completedGroupsIndexes.length / mcqGroups.length) * 100) 
      : 0;
    
    // Sauvegarder dans l'ancien format pour compatibilité
    const legacyProgress: LegacyCourseProgress = {
      courseId,
      groupsCompleted: completedGroupsIndexes,
      totalGroups: mcqGroups.length,
      completionPercentage,
      lastAccessed: new Date()
    };
    
    // Sauvegarder dans l'ancien format
    this.saveLegacyProgress(legacyProgress);
    
    // Mettre à jour aussi avec le nouveau format
    this.updateQCMProgress(courseId, mcqGroups, groupsCompleted);
    
    // Tenter de synchroniser avec la base de données si l'utilisateur est connecté
    if (this.authService.currentUserValue) {
      // Attendre un court délai pour s'assurer que les données locales sont à jour
      setTimeout(() => {
        this.saveAllProgress(true); // true pour indiquer qu'on veut synchroniser avec le serveur
      }, 500);
    }
    
    console.log(`Progression sauvegardée pour le cours ${courseId}: ${completionPercentage}%`);
  }
  
  /**
   * Met à jour la progression des QCM pour un cours
   * @param courseId ID du cours
   * @param mcqGroups Groupes de QCM
   * @param groupsCompleted État de complétion des groupes
   */
  private updateQCMProgress(courseId: string, mcqGroups: MCQGroup[], groupsCompleted: boolean[]): void {
    // Récupérer la progression actuelle ou en créer une nouvelle
    let courseProgress = this.getProgress(courseId);
    const progressMap = this.courseProgressSubject.getValue();
    
    if (!courseProgress) {
      // Créer une nouvelle progression pour ce cours
      courseProgress = {
        courseId,
        title: `Cours ${courseId}`,
        modules: [],
        completionPercentage: 0,
        lastAccessed: new Date()
      };
    }
    
    // Mettre à jour ou créer le module principal s'il n'existe pas
    let mainModule = courseProgress.modules.find(m => m.moduleId === `${courseId}-module-1`);
    if (!mainModule) {
      mainModule = {
        moduleId: `${courseId}-module-1`,
        title: 'Module principal',
        pdfProgressList: [],
        qcmProgressList: [],
        pdfWeight: this.DEFAULT_WEIGHTS.COURS_PDF + this.DEFAULT_WEIGHTS.EXERCICES_PDF + this.DEFAULT_WEIGHTS.CORRECTIONS_PDF,
        qcmWeight: this.DEFAULT_WEIGHTS.QCM,
        completionPercentage: 0,
        lastAccessed: new Date()
      };
      courseProgress.modules.push(mainModule);
    }
    
    // Mettre à jour les QCM du module
    mcqGroups.forEach((group, index) => {
      const completed = groupsCompleted[index];
      
      // Calculer les métriques détaillées pour ce groupe
      const questionsAnswered = group.questions.filter(q => q.selectedOptionId !== undefined).length;
      const correctAnswers = group.questions.filter(q => q.selectedOptionId === q.correctAnswerId).length;
      const score = group.questions.length > 0 ? Math.round((correctAnswers / group.questions.length) * 100) : 0;
      
      // Calcul de la progression selon les métriques spécifiées
      let progressPercentage = 0;
      if (questionsAnswered > 0) { // Si au moins une question a été répondue (tentative)
        progressPercentage += this.QCM_METRICS.ATTEMPT_WEIGHT * 100;
        // Ajouter pourcentage de questions répondues
        progressPercentage += (this.QCM_METRICS.QUESTIONS_ANSWERED_WEIGHT * (questionsAnswered / group.questions.length) * 100);
        // Ajouter pourcentage pour la complétion
        if (completed) {
          progressPercentage += this.QCM_METRICS.COMPLETION_WEIGHT * 100;
        }
        // Ajouter pourcentage pour le score
        progressPercentage += this.QCM_METRICS.SCORE_WEIGHT * score;
      }
      
      // Trouver le QCM existant ou en créer un nouveau
      let qcmProgress = mainModule.qcmProgressList.find(q => q.groupId === index);
      
      if (!qcmProgress) {
        // Créer un nouveau QCM progress
        qcmProgress = {
          groupId: index,
          groupTitle: group.title || `Groupe ${index + 1}`,
          attempted: questionsAnswered > 0,
          completed,
          questionsTotal: group.questions.length,
          questionsAnswered,
          correctAnswers,
          score,
          completionPercentage: Math.round(progressPercentage),
          lastAccessed: new Date()
        };
        mainModule.qcmProgressList.push(qcmProgress);
      } else {
        // Mettre à jour le QCM progress existant
        qcmProgress.attempted = questionsAnswered > 0;
        qcmProgress.completed = completed;
        qcmProgress.questionsAnswered = questionsAnswered;
        qcmProgress.correctAnswers = correctAnswers;
        qcmProgress.score = score;
        qcmProgress.completionPercentage = Math.round(progressPercentage);
        qcmProgress.lastAccessed = new Date();
      }
    });
    
    // Recalculer la progression du module
    this.recalculateModuleProgress(mainModule);
    
    // Recalculer la progression globale du cours
    this.recalculateCourseProgress(courseProgress);
    
    // Mettre à jour la carte des progressions
    progressMap.set(courseId, courseProgress);
    this.courseProgressSubject.next(progressMap);
    
    // Sauvegarder dans le localStorage
    this.saveAllProgress();
  }

  /**
   * Récupère le tableau des index de groupes complétés pour un cours (compatibilité ancienne version)
   * @param courseId ID du cours
   * @returns Tableau d'index des groupes complétés ou tableau vide
   */
  getCompletedGroupsIndexes(courseId: string): number[] {
    const courseProgress = this.getProgress(courseId);
    if (!courseProgress || !courseProgress.modules.length) return [];
    
    // Chercher les QCM complétés dans tous les modules
    const completedGroups: number[] = [];
    courseProgress.modules.forEach(module => {
      module.qcmProgressList
        .filter(qcm => qcm.completed)
        .forEach(qcm => completedGroups.push(qcm.groupId));
    });
    
    return completedGroups;
  }

  /**
   * Initialise le tableau d'état de complétion des groupes de QCM
   * basé sur les données sauvegardées
   * @param courseId ID du cours
   * @param totalGroups Nombre total de groupes
   * @returns Tableau de booléens indiquant l'état de complétion de chaque groupe
   */
  initializeGroupCompletionStatus(courseId: string, totalGroups: number): boolean[] {
    const completedIndexes = this.getCompletedGroupsIndexes(courseId);
    const groupCompleted = new Array(totalGroups).fill(false);
    
    completedIndexes.forEach(index => {
      if (index >= 0 && index < totalGroups) {
        groupCompleted[index] = true;
      }
    });
    
    return groupCompleted;
  }

  /**
   * Récupère le pourcentage de progression pour un cours
   * @param courseId ID du cours
   * @returns Pourcentage de progression (0-100)
   */
  getProgressPercentage(courseId: string): number {
    const progress = this.getProgress(courseId);
    return progress ? progress.completionPercentage : 0;
  }
  
  /**
   * Initialise une progression vide pour un cours lorsqu'il est ouvert pour la première fois
   * @param courseId ID du cours à initialiser
   */
  initializeEmptyCourseProgress(courseId: string): void {
    if (!courseId) return;
    
    // Vérifier si une progression existe déjà
    if (this.getProgress(courseId)) {
      // La progression existe déjà, ne rien faire
      return;
    }
    
    // Récupérer la carte des progressions
    const progressMap = this.courseProgressSubject.getValue();
    
    // Créer une nouvelle progression vide
    const newProgress: CourseProgress = {
      courseId,
      title: 'Cours ' + courseId, // Titre par défaut qui sera mis à jour lors du chargement du cours
      completionPercentage: 10, // Démarrer à 10% simplement pour avoir ouvert le cours
      lastAccessed: new Date(),
      modules: [
        {
          moduleId: 'module-1',
          title: 'Module 1',
          completionPercentage: 0,
          qcmProgressList: [],
          pdfProgressList: [],
          pdfWeight: 0.6,
          qcmWeight: 0.4,
          lastAccessed: new Date()
        }
      ]
    };
    
    // Ajouter à la carte et notifier les abonnés
    progressMap.set(courseId, newProgress);
    this.courseProgressSubject.next(progressMap);
    
    // Sauvegarder dans le localStorage et tenter de synchroniser avec le serveur si l'utilisateur est connecté
    this.saveAllProgress(this.authService.currentUserValue !== null);
  }
  
  /**
   * Recalcule la progression d'un module en fonction des PDFs et QCMs complétés
   * @param module Module dont la progression doit être recalculée
   */
  private recalculateModuleProgress(module: ModuleProgress): void {
    // Si pas de contenu, progression = 0
    if (!module.pdfProgressList.length && !module.qcmProgressList.length) {
      module.completionPercentage = 0;
      return;
    }
    
    // Pondérations pour ce module selon la formule spécifiée:
    // - 25% pour les PDF de cours
    // - 20% pour les exercices PDF
    // - 15% pour les corrections PDF
    // - 40% pour les QCM
    const COURS_PDF_WEIGHT = 0.25;
    const EXERCICE_PDF_WEIGHT = 0.20;
    const CORRECTION_PDF_WEIGHT = 0.15;
    const QCM_WEIGHT = 0.40;
    
    // Calculer la progression par type de document
    let coursPdfProgress = 0;
    let exercicePdfProgress = 0;
    let correctionPdfProgress = 0;
    let qcmProgress = 0;
    
    // Calculer la progression des PDFs par type
    for (const pdf of module.pdfProgressList) {
      switch (pdf.documentType) {
        case 'cours':
          coursPdfProgress = Math.max(coursPdfProgress, pdf.completionPercentage);
          break;
        case 'exercice':
          exercicePdfProgress = Math.max(exercicePdfProgress, pdf.completionPercentage);
          break;
        case 'correction':
          correctionPdfProgress = Math.max(correctionPdfProgress, pdf.completionPercentage);
          break;
      }
    }
    
    // Calculer la progression des QCM
    if (module.qcmProgressList.length > 0) {
      const completedQcms = module.qcmProgressList.filter(qcm => qcm.completed).length;
      qcmProgress = (completedQcms / module.qcmProgressList.length) * 100;
    }
    
    // Appliquer la formule de progression pondérée
    const totalProgressPercentage = 
      (coursPdfProgress * COURS_PDF_WEIGHT) +
      (exercicePdfProgress * EXERCICE_PDF_WEIGHT) +
      (correctionPdfProgress * CORRECTION_PDF_WEIGHT) +
      (qcmProgress * QCM_WEIGHT);
    
    // Mettre à jour le pourcentage de progression du module
    module.completionPercentage = Math.round(totalProgressPercentage);
    module.lastAccessed = new Date();
    
    console.log(`Progression module ${module.moduleId}:`, {
      coursPdf: coursPdfProgress,
      exercicePdf: exercicePdfProgress,
      correctionPdf: correctionPdfProgress,
      qcm: qcmProgress,
      total: module.completionPercentage
    });
  }
  
  /**
   * Recalcule la progression globale d'un cours selon la formule spécifiée:
   * Progression (%) = 
   * (% cours PDF consultés × 0,25) + 
   * (% exercices PDF consultés × 0,20) + 
   * (% corrections PDF consultées × 0,15) + 
   * (% QCM complétés × 0,40)
   * @param courseProgress Objet de progression du cours à mettre à jour
   */
  private recalculateCourseProgress(courseProgress: CourseProgress): void {
    // Si pas de modules, progression = 0
    if (!courseProgress.modules.length) {
      courseProgress.completionPercentage = 0;
      return;
    }
    
    // Pondérations selon la formule spécifiée
    const COURS_PDF_WEIGHT = 0.25;
    const EXERCICE_PDF_WEIGHT = 0.20;
    const CORRECTION_PDF_WEIGHT = 0.15;
    const QCM_WEIGHT = 0.40;
    
    // Initialiser les variables de progression par type
    let coursPdfProgress = 0;
    let exercicePdfProgress = 0;
    let correctionPdfProgress = 0;
    let qcmProgress = 0;
    let totalQcmGroups = 0;
    let completedQcmGroups = 0;
    
    // Parcourir tous les modules du cours
    for (const module of courseProgress.modules) {
      // Chercher les PDF par type et prendre les valeurs max
      for (const pdf of module.pdfProgressList) {
        switch (pdf.documentType) {
          case 'cours':
            coursPdfProgress = Math.max(coursPdfProgress, pdf.completionPercentage || 0);
            break;
          case 'exercice':
            exercicePdfProgress = Math.max(exercicePdfProgress, pdf.completionPercentage || 0);
            break;
          case 'correction':
            correctionPdfProgress = Math.max(correctionPdfProgress, pdf.completionPercentage || 0);
            break;
        }
      }
      
      // Compter les QCM complétés et le total des QCM
      totalQcmGroups += module.qcmProgressList.length;
      completedQcmGroups += module.qcmProgressList.filter(qcm => qcm.completed).length;
    }
    
    // Calculer le pourcentage de QCM complétés
    if (totalQcmGroups > 0) {
      qcmProgress = (completedQcmGroups / totalQcmGroups) * 100;
    }
    
    // Appliquer la formule de calcul pondéré pour la progression globale
    const totalProgress = 
      (coursPdfProgress * COURS_PDF_WEIGHT) + 
      (exercicePdfProgress * EXERCICE_PDF_WEIGHT) + 
      (correctionPdfProgress * CORRECTION_PDF_WEIGHT) + 
      (qcmProgress * QCM_WEIGHT);
    
    // Mettre à jour le pourcentage de progression du cours
    courseProgress.completionPercentage = Math.round(totalProgress);
    courseProgress.lastAccessed = new Date();
    
    console.log(`Progression du cours ${courseProgress.courseId}:`, {
      coursPdf: coursPdfProgress,
      exercicePdf: exercicePdfProgress,
      correctionPdf: correctionPdfProgress,
      qcm: qcmProgress + '% (Groupes complétés: ' + completedQcmGroups + '/' + totalQcmGroups + ')',
      total: courseProgress.completionPercentage + '%'
    });
  }

  /**
   * Sauvegarde la progression dans l'ancien format (pour compatibilité)
   * @param courseProgress Objet de progression au format legacy
   */
  private saveLegacyProgress(courseProgress: LegacyCourseProgress): void {
    // Récupérer les données existantes avec la clé spécifique à l'utilisateur
    const legacyKey = this.getLegacyProgressKey();
    const legacyData = localStorage.getItem(legacyKey);
    let legacyProgressList: LegacyCourseProgress[] = legacyData ? JSON.parse(legacyData) : [];
    
    // Mettre à jour ou ajouter la progression du cours
    const courseIndex = legacyProgressList.findIndex(p => p.courseId === courseProgress.courseId);
    if (courseIndex !== -1) {
      legacyProgressList[courseIndex] = courseProgress;
    } else {
      legacyProgressList.push(courseProgress);
    }
    
    // Sauvegarder dans le localStorage avec la clé spécifique à l'utilisateur
    localStorage.setItem(legacyKey, JSON.stringify(legacyProgressList));
  }
  
  /**
   * Met à jour la progression d'un document PDF
   * @param courseId ID du cours auquel appartient le document
   * @param moduleId ID du module (optionnel, par défaut 'module-1')
   * @param documentId ID du document PDF
   * @param documentType Type de document (cours, exercice, correction)
   * @param pagesViewed Tableau des numéros de pages consultées
   * @param totalPages Nombre total de pages du document
   * @param timeSpent Temps passé sur le document (en secondes)
   * @param estimatedReadTime Temps de lecture estimé (en secondes)
   * @param lastPosition Dernière page consultée
   */
  updatePDFProgress(
    courseId: string,
    documentId: string,
    documentType: 'cours' | 'exercice' | 'correction',
    pagesViewed: number[],
    totalPages: number,
    timeSpent: number,
    estimatedReadTime: number,
    lastPosition: number,
    moduleId: string = 'module-1'
  ): void {
    if (!courseId || !documentId) return;
    
    // Récupérer la progression actuelle ou en créer une nouvelle
    let courseProgress = this.getProgress(courseId);
    const progressMap = this.courseProgressSubject.getValue();
    
    if (!courseProgress) {
      // Créer une nouvelle progression pour ce cours
      courseProgress = {
        courseId,
        title: `Cours ${courseId}`,
        modules: [],
        completionPercentage: 0,
        lastAccessed: new Date()
      };
    }
    
    // Mettre à jour ou créer le module s'il n'existe pas
    const fullModuleId = `${courseId}-${moduleId}`;
    let module = courseProgress.modules.find(m => m.moduleId === fullModuleId);
    if (!module) {
      module = {
        moduleId: fullModuleId,
        title: moduleId === 'module-1' ? 'Module principal' : `Module ${moduleId}`,
        pdfProgressList: [],
        qcmProgressList: [],
        pdfWeight: this.DEFAULT_WEIGHTS.COURS_PDF + this.DEFAULT_WEIGHTS.EXERCICES_PDF + this.DEFAULT_WEIGHTS.CORRECTIONS_PDF,
        qcmWeight: this.DEFAULT_WEIGHTS.QCM,
        completionPercentage: 0,
        lastAccessed: new Date()
      };
      courseProgress.modules.push(module);
    }
    
    // Calculer la progression selon les métriques spécifiées
    let completionPercentage = 0;
    
    // 1. Ouverture simple (10%)
    completionPercentage += this.PDF_METRICS.OPEN_WEIGHT * 100;
    
    // 2. Consultation partielle basée sur le nombre de pages (40%)
    const uniquePagesViewed = [...new Set(pagesViewed)]; // Éliminer les doublons
    const pagesViewedPercentage = Math.min(uniquePagesViewed.length / totalPages, 1);
    completionPercentage += this.PDF_METRICS.PAGES_VIEWED_WEIGHT * pagesViewedPercentage * 100;
    
    // 3. Temps d'activité par rapport au temps de référence (50%)
    // Si le temps passé est supérieur au temps estimé, on considère 100%
    const timePercentage = Math.min(timeSpent / estimatedReadTime, 1);
    completionPercentage += this.PDF_METRICS.TIME_SPENT_WEIGHT * timePercentage * 100;
    
    // Si l'utilisateur a défilé jusqu'à la dernière page OU a passé au moins 80% du temps estimé
    const isFullyConsulted = lastPosition === totalPages - 1 || timePercentage >= 0.8;
    
    // Créer ou mettre à jour la progression du PDF
    let pdfProgress = module.pdfProgressList.find(p => p.documentId === documentId);
    
    if (!pdfProgress) {
      // Créer une nouvelle progression PDF
      pdfProgress = {
        documentId,
        documentType,
        opened: true,
        pagesViewed: uniquePagesViewed,
        totalPages,
        timeSpent,
        estimatedReadTime,
        lastPosition,
        completionPercentage: Math.round(completionPercentage),
        lastAccessed: new Date()
      };
      module.pdfProgressList.push(pdfProgress);
    } else {
      // Mettre à jour la progression PDF existante
      pdfProgress.opened = true;
      pdfProgress.pagesViewed = [...new Set([...pdfProgress.pagesViewed, ...uniquePagesViewed])]; // Fusionner les pages vues
      pdfProgress.timeSpent += timeSpent; // Cumuler le temps passé
      pdfProgress.lastPosition = lastPosition;
      
      // Recalculer la progression avec les valeurs mises à jour
      let updatedCompletion = this.PDF_METRICS.OPEN_WEIGHT * 100;
      updatedCompletion += this.PDF_METRICS.PAGES_VIEWED_WEIGHT * (pdfProgress.pagesViewed.length / totalPages) * 100;
      updatedCompletion += this.PDF_METRICS.TIME_SPENT_WEIGHT * Math.min(pdfProgress.timeSpent / estimatedReadTime, 1) * 100;
      
      pdfProgress.completionPercentage = Math.round(updatedCompletion);
      pdfProgress.lastAccessed = new Date();
    }
    
    // Si le PDF est considéré comme complètement consulté, fixer à 100%
    if (isFullyConsulted) {
      pdfProgress.completionPercentage = 100;
    }
    
    // Recalculer la progression du module
    this.recalculateModuleProgress(module);
    
    // Recalculer la progression globale du cours
    this.recalculateCourseProgress(courseProgress);
    
    // Mettre à jour la carte des progressions
    progressMap.set(courseId, courseProgress);
    this.courseProgressSubject.next(progressMap);
    
    // Sauvegarder dans le localStorage
    this.saveAllProgress();
  }
  
  /**
   * Enregistre un événement d'ouverture de PDF
   * @param courseId ID du cours
   * @param documentId ID du document PDF
   * @param documentType Type de document
   * @param totalPages Nombre total de pages
   * @param estimatedReadTime Temps de lecture estimé en secondes
   */
  recordPDFOpening(
    courseId: string,
    documentId: string,
    documentType: 'cours' | 'exercice' | 'correction',
    totalPages: number,
    estimatedReadTime: number
  ): void {
    // Pour l'ouverture simple, on considère que l'utilisateur a vu la première page
    this.updatePDFProgress(
      courseId,
      documentId,
      documentType,
      [0], // Première page
      totalPages,
      1, // 1 seconde de temps passé
      estimatedReadTime,
      0 // Position à la première page
    );
  }
  
  /**
   * Enregistre un événement de consultation de page PDF
   * @param courseId ID du cours
   * @param documentId ID du document
   * @param pageNumber Numéro de la page consultée
   * @param timeSpent Temps passé sur la page (en secondes)
   */
  recordPDFPageView(
    courseId: string,
    documentId: string,
    pageNumber: number,
    timeSpent: number = 10 // Valeur par défaut de 10 secondes
  ): void {
    const courseProgress = this.getProgress(courseId);
    if (!courseProgress) return;
    
    // Chercher le document dans tous les modules
    let pdfProgress: PDFProgress | undefined;
    let module: ModuleProgress | undefined;
    
    // Parcourir tous les modules pour trouver le document
    for (const mod of courseProgress.modules) {
      pdfProgress = mod.pdfProgressList.find(p => p.documentId === documentId);
      if (pdfProgress) {
        module = mod;
        break;
      }
    }
    
    if (!pdfProgress || !module) return; // Document non trouvé
    
    // Mettre à jour la progression avec la nouvelle page vue
    this.updatePDFProgress(
      courseId,
      documentId,
      pdfProgress.documentType,
      [...pdfProgress.pagesViewed, pageNumber],
      pdfProgress.totalPages,
      timeSpent,
      pdfProgress.estimatedReadTime,
      pageNumber,
      module.moduleId.replace(`${courseId}-`, '') // Extraire l'ID du module sans le préfixe du cours
    );
  }
  
  /**
   * Marque un document PDF comme entièrement lu
   * @param courseId ID du cours
   * @param documentId ID du document
   */
  markPDFAsFullyRead(courseId: string, documentId: string): void {
    const courseProgress = this.getProgress(courseId);
    if (!courseProgress) return;
    
    // Chercher le document dans tous les modules
    let pdfProgress: PDFProgress | undefined;
    let module: ModuleProgress | undefined;
    
    // Parcourir tous les modules pour trouver le document
    for (const mod of courseProgress.modules) {
      pdfProgress = mod.pdfProgressList.find(p => p.documentId === documentId);
      if (pdfProgress) {
        module = mod;
        break;
      }
    }
    
    if (!pdfProgress || !module) return; // Document non trouvé
    
    // Générer un tableau avec tous les numéros de page
    const allPages = Array.from({length: pdfProgress.totalPages}, (_, i) => i);
    
    // Mettre à jour avec toutes les pages vues et marquer comme lu
    this.updatePDFProgress(
      courseId,
      documentId,
      pdfProgress.documentType,
      allPages,
      pdfProgress.totalPages,
      pdfProgress.estimatedReadTime, // Considérer qu'il a passé le temps estimé
      pdfProgress.estimatedReadTime,
      pdfProgress.totalPages - 1, // Dernière page
      module.moduleId.replace(`${courseId}-`, '') // Extraire l'ID du module sans le préfixe du cours
    );
  }
}
