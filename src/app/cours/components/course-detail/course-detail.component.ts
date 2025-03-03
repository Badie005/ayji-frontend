import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarService } from '../../../shared/services/sidebar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  courseId: string | null = null;
  activeTab: string = 'course'; // Default active tab
  visibleSolutions: string[] = []; // Track which solutions are visible
  isSidebarExpanded: boolean = true;
  private sidebarSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    // Get the course ID from the route parameters
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('id');
      // Here you would typically fetch the course data based on the ID
    });

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

  /**
   * Switch between different content tabs (course material, tests, exercises)
   */
  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  /**
   * Toggle visibility of exercise solutions
   */
  toggleSolution(solutionId: string): void {
    if (this.visibleSolutions.includes(solutionId)) {
      // Hide the solution if it's already visible
      this.visibleSolutions = this.visibleSolutions.filter(id => id !== solutionId);
    } else {
      // Show the solution
      this.visibleSolutions.push(solutionId);
    }
  }
}
