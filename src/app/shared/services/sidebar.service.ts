import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarStateSubject = new BehaviorSubject<boolean>(true);
  public sidebarState$: Observable<boolean> = this.sidebarStateSubject.asObservable();

  constructor() {
    // Initialize from localStorage if available
    const savedState = localStorage.getItem('sidebarExpanded');
    if (savedState !== null) {
      this.sidebarStateSubject.next(savedState === 'true');
    }
  }

  public toggleSidebar(): void {
    const currentState = this.sidebarStateSubject.value;
    this.sidebarStateSubject.next(!currentState);
    localStorage.setItem('sidebarExpanded', String(!currentState));
  }

  public setSidebarState(isExpanded: boolean): void {
    this.sidebarStateSubject.next(isExpanded);
    localStorage.setItem('sidebarExpanded', String(isExpanded));
  }

  public setSidebarStateWithoutSaving(isExpanded: boolean): void {
    this.sidebarStateSubject.next(isExpanded);
  }
}