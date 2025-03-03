import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../../shared/services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './course-list.component.html',
  styleUrls: ["./course-list.component.css"]
})
export class CourseListComponent implements OnInit, OnDestroy {
  isSidebarExpanded: boolean = true;
  private sidebarSubscription: Subscription | undefined;
  
  // Données de cours avec pourcentage de progression
  courses = [
    {
      id: 1,
      title: 'Introduction aux systèmes réseaux',
      progress: 80
    },
    {
      id: 2,
      title: 'Protocoles de communication',
      progress: 30
    },
    {
      id: 3,
      title: 'Sécurité des réseaux',
      progress: 50
    },
    {
      id: 4,
      title: 'Configuration avancée',
      progress: 80
    }
  ];

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    // Subscribe to sidebar state changes
    this.sidebarSubscription = this.sidebarService.sidebarState$.subscribe(
      expanded => {
        this.isSidebarExpanded = expanded;
      }
    );
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }
}
