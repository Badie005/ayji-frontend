import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from '../../../core/models/course.model';
import { CourseManagementService } from '../../services/course-management.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';
  searchTerm = '';
  totalCourses = 0;
  duplicateCourses: { title: string, count: number, ids: string[] }[] = [];
  hasDuplicateOrders = false;

  constructor(
    private courseService: CourseManagementService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getCourses().subscribe({
      next: (courses: Course[]) => {
        this.courses = courses.sort((a: Course, b: Course) => (a.order || 0) - (b.order || 0));
        this.filteredCourses = [...this.courses];
        this.totalCourses = this.courses.length;
        this.loading = false;
        
        // Vérifier les doublons de titres
        this.checkForDuplicateTitles();
        
        // Vérifier les doublons d'ordre
        this.checkForDuplicateOrders();
      },
      error: (error: any) => {
        this.errorMessage = `Une erreur est survenue lors du chargement des cours: ${error.message}`;
        this.loading = false;
        console.error('Erreur de chargement des cours:', error);
      }
    });
  }

  checkForDuplicateTitles(): void {
    const titleCounts: { [title: string]: { count: number, ids: string[] } } = {};
    
    // Compter les occurrences de chaque titre
    this.courses.forEach(course => {
      const title = course.title.toLowerCase().trim();
      if (!titleCounts[title]) {
        titleCounts[title] = { count: 0, ids: [] };
      }
      titleCounts[title].count++;
      titleCounts[title].ids.push(course._id);
    });
    
    // Filtrer pour ne garder que les titres qui apparaissent plusieurs fois
    this.duplicateCourses = Object.keys(titleCounts)
      .filter(title => titleCounts[title].count > 1)
      .map(title => ({
        title: title,
        count: titleCounts[title].count,
        ids: titleCounts[title].ids
      }));
  }
  
  checkForDuplicateOrders(): void {
    const orderCounts: { [order: number]: number } = {};
    
    // Compter les occurrences de chaque ordre
    this.courses.forEach(course => {
      const order = course.order || 0;
      if (!orderCounts[order]) {
        orderCounts[order] = 0;
      }
      orderCounts[order]++;
    });
    
    // Vérifier s'il y a des ordres qui apparaissent plusieurs fois
    this.hasDuplicateOrders = Object.values(orderCounts).some(count => count > 1);
  }
  
  reorganizeCourseOrders(): void {
    if (confirm('Voulez-vous réorganiser automatiquement l\'ordre d\'affichage des cours? Cela modifiera la valeur de l\'ordre pour tous les cours.')) {
      // Trier les cours par titre pour grouper les titres similaires
      const sortedCourses = [...this.courses].sort((a, b) => {
        // D'abord par ordre actuel pour préserver l'ordre relatif quand possible
        const orderDiff = (a.order || 0) - (b.order || 0);
        if (orderDiff !== 0) return orderDiff;
        
        // Ensuite par titre pour regrouper les cours similaires
        return a.title.localeCompare(b.title);
      });
      
      // Attribuer de nouveaux ordres séquentiels
      const updates = sortedCourses.map((course, index) => {
        return {
          id: course._id,
          updates: { order: index + 1 } // Commencer à 1 au lieu de 0
        };
      });
      
      // Mettre à jour chaque cours avec son nouvel ordre
      this.loading = true;
      this.errorMessage = '';
      let completedUpdates = 0;
      
      updates.forEach(update => {
        this.courseService.updateCourse(update.id, update.updates).subscribe({
          next: () => {
            completedUpdates++;
            if (completedUpdates === updates.length) {
              // Tous les cours ont été mis à jour, recharger la liste
              this.loadCourses();
              alert('Réorganisation terminée ! Tous les cours ont maintenant un ordre unique.');
            }
          },
          error: (error: any) => {
            this.errorMessage = `Erreur lors de la réorganisation: ${error.message}`;
            this.loading = false;
          }
        });
      });
    }
  }
  
  suggestTitleFixes(): void {
    if (this.duplicateCourses.length === 0) {
      alert('Aucun doublon de titre détecté.');
      return;
    }
    
    if (confirm('Voulez-vous résoudre les doublons de titres? Cette action vous montrera les cours en double pour que vous puissiez les modifier ou les supprimer.')) {
      // Pour chaque groupe de titre en double, on crée une liste de suggestions
      let message = 'Cours avec des titres identiques:\n\n';
      
      this.duplicateCourses.forEach(dup => {
        message += `${dup.count} cours intitulés "${dup.title}":\n`;
        
        // Trouver les cours correspondant à ce titre
        const coursesWithTitle = this.courses.filter(c => 
          c.title.toLowerCase().trim() === dup.title.toLowerCase().trim()
        );
        
        // Ajouter des informations sur chaque cours
        coursesWithTitle.forEach((course, index) => {
          message += `- Cours #${index+1}: Ordre ${course.order || 0}, `;
          if (course.description) {
            message += `Description: "${course.description.substring(0, 50)}${course.description.length > 50 ? '...' : ''}", `;
          }
          message += `ID: ${course._id}\n`;
        });
        
        message += '\n';
      });
      
      message += 'Suggestions pour résoudre les doublons:\n';
      message += '1. Utilisez le bouton "Modifier" sur chaque cours pour changer son titre\n';
      message += '2. Supprimez les cours réellement en double avec le bouton "Supprimer"\n';
      message += '3. Ajoutez des numéros ou précisions dans les titres (ex: "Introduction - Partie 1")\n\n';
      message += 'Voulez-vous également réorganiser les ordres d\'affichage?';
      
      if (confirm(message)) {
        // Si l'utilisateur veut aussi réorganiser les ordres
        this.reorganizeCourseOrders();
      }
    }
  }

  searchCourses(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
    this.applyFilters();
  }
  
  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  applyFilters(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCourses = [...this.courses];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredCourses = this.courses.filter(course => 
      course.title.toLowerCase().includes(searchTermLower) ||
      (course.description && course.description.toLowerCase().includes(searchTermLower))
    );
  }

  getCourseOrderClass(course: Course): string {
    // Vérifier si cet ordre est dupliqué
    const sameOrderCourses = this.courses.filter(c => (c.order || 0) === (course.order || 0));
    return sameOrderCourses.length > 1 ? 'duplicate-order' : '';
  }
  
  getCourseTitleClass(course: Course): string {
    // Vérifier si ce titre est dupliqué
    const sameTitleCourses = this.courses.filter(c => 
      c.title.toLowerCase().trim() === course.title.toLowerCase().trim() && c._id !== course._id
    );
    return sameTitleCourses.length > 0 ? 'duplicate-title' : '';
  }

  addNewCourse(): void {
    this.router.navigate(['/admin/courses/new']);
  }

  editCourse(course: Course): void {
    this.router.navigate(['/admin/courses/edit', course._id]);
  }

  viewCourseDetails(course: Course): void {
    this.router.navigate(['/admin/courses/details', course._id]);
  }

  deleteCourse(course: Course): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le cours "${course.title}" ?`)) {
      this.loading = true;
      this.courseService.deleteCourse(course._id).subscribe({
        next: () => {
          this.loadCourses();
          this.successMessage = 'Cours supprimé avec succès !';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error: any) => {
          this.errorMessage = `Erreur lors de la suppression du cours: ${error.message}`;
          this.loading = false;
        }
      });
    }
  }

  showOrderingHelp(): void {
    const helpMessage = `
Guide d'organisation des cours:

1. Chaque cours possède un numéro d'ordre unique qui détermine sa position dans la liste.
   
2. Un numéro d'ordre plus petit (ex: 1) signifie que le cours apparaîtra avant un cours avec un numéro plus grand (ex: 2).

3. Les problèmes suivants peuvent être résolus automatiquement:
   - Plusieurs cours avec le même numéro d'ordre (doublons d'ordre)
   - Cours sans numéro d'ordre (affichés comme #0)
   
4. Comment résoudre ces problèmes:
   - Utilisez le bouton "Réorganiser automatiquement" pour attribuer des ordres séquentiels à tous les cours
   - Ou modifiez manuellement l'ordre de chaque cours via le bouton "Modifier"
   
5. Les numéros d'ordre sont réorganisés pour commencer à 1 et augmenter de 1 pour chaque cours.

6. Pour la gestion des doublons de titres, utilisez le bouton "Résoudre les doublons" pour identifier et gérer les cours ayant des titres identiques.
    `;
    
    alert(helpMessage);
  }
}
