import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, delay, finalize, map, tap } from 'rxjs/operators';

/**
 * Interface for tracking loading states by key
 */
export interface LoadingState {
  [key: string]: boolean;
}

/**
 * Interface for a pending request with optional context
 */
export interface PendingRequest {
  key: string;
  context?: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Track global loading state
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();
  
  // Track loading states by key (e.g., for specific components or requests)
  private loadingStateSubject = new BehaviorSubject<LoadingState>({});
  public loadingState$ = this.loadingStateSubject.asObservable();
  
  // Track pending requests
  private pendingRequests: PendingRequest[] = [];
  
  // Minimum duration for loading indicator to avoid flicker
  private minLoadingTime = 300;
  
  // Notification for long-running requests
  private longRunningRequestSubject = new Subject<PendingRequest>();
  public longRunningRequest$ = this.longRunningRequestSubject
    .pipe(
      debounceTime(5000), // Only notify after 5 seconds
      tap(request => {
        console.warn(`Long-running request: ${request.key} (${request.context || 'unknown'}) - ${new Date().getTime() - request.timestamp}ms`);
      })
    );
  
  constructor() { 
    // Monitor long running requests
    this.longRunningRequest$.subscribe();
  }
  
  /**
   * Set the global loading state
   * @param isLoading New loading state
   */
  public setLoading(isLoading: boolean): void {
    this.isLoadingSubject.next(isLoading);
  }
  
  /**
   * Track loading state for a specific key
   * @param key Unique identifier for the loading operation
   * @param isLoading Loading state
   * @param context Optional context information
   */
  public setLoadingState(key: string, isLoading: boolean, context?: string): void {
    const currentState = this.loadingStateSubject.value;
    
    if (isLoading) {
      // Add to pending requests
      this.pendingRequests.push({
        key,
        context,
        timestamp: new Date().getTime()
      });
      
      // Check for long-running requests
      setTimeout(() => {
        const request = this.pendingRequests.find(r => r.key === key);
        if (request) {
          this.longRunningRequestSubject.next(request);
        }
      }, 5000);
    } else {
      // Remove from pending requests
      this.pendingRequests = this.pendingRequests.filter(r => r.key !== key);
    }
    
    // Update the loading state for this specific key
    this.loadingStateSubject.next({
      ...currentState,
      [key]: isLoading
    });
    
    // Update global loading state if any keys are loading
    this.updateGlobalLoadingState();
  }
  
  /**
   * Check if a specific key is in loading state
   * @param key The key to check
   * @returns Observable of loading state
   */
  public isLoadingByKey(key: string): Observable<boolean> {
    return this.loadingState$.pipe(
      map(state => !!state[key])
    );
  }
  
  /**
   * Create an RxJS operator to handle loading state for async operations
   * @param key Unique identifier for the loading operation
   * @param context Optional context information
   * @returns RxJS operator
   */
  public withLoading<T>(key: string, context?: string) {
    return (source: Observable<T>) => {
      return new Observable<T>(observer => {
        const startTime = new Date().getTime();
        this.setLoadingState(key, true, context);
        
        return source.pipe(
          // Ensure loading indicator shows for at least minLoadingTime to avoid flicker
          finalize(() => {
            const elapsedTime = new Date().getTime() - startTime;
            const remainingTime = Math.max(0, this.minLoadingTime - elapsedTime);
            
            setTimeout(() => {
              this.setLoadingState(key, false, context);
            }, remainingTime);
          })
        ).subscribe({
          next: value => observer.next(value),
          error: err => observer.error(err),
          complete: () => observer.complete()
        });
      });
    };
  }
  
  /**
   * Update the global loading state based on individual keys
   */
  private updateGlobalLoadingState(): void {
    const anyLoading = Object.values(this.loadingStateSubject.value).some(state => state);
    this.isLoadingSubject.next(anyLoading);
  }
  
  /**
   * Get all currently pending requests
   * @returns Array of pending requests
   */
  public getPendingRequests(): PendingRequest[] {
    return [...this.pendingRequests];
  }
}
