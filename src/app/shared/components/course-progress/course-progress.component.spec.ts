import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseProgressComponent } from './course-progress.component';
import { ProgressionService } from '../../../services/progression.service';
import { AuthService } from '../../../services/auth.service';
import { of } from 'rxjs';
import { Progression } from '../../../core/models/progression.model';

describe('CourseProgressComponent', () => {
  let component: CourseProgressComponent;
  let fixture: ComponentFixture<CourseProgressComponent>;
  let progressionServiceSpy: jasmine.SpyObj<ProgressionService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    progressionServiceSpy = jasmine.createSpyObj('ProgressionService', ['getCourseProgression', 'updateProgression']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isLoggedIn']);
    
    await TestBed.configureTestingModule({
      imports: [ CourseProgressComponent ],
      providers: [
        { provide: ProgressionService, useValue: progressionServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseProgressComponent);
    component = fixture.componentInstance;
    
    // Mock de l'authentification
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getCurrentUser.and.returnValue(of({ _id: 'test-user-id', name: 'Test User' }));
    
    // Mock d'une progression
    const mockProgression: Progression = {
      _id: 'test-progression-id',
      user: 'test-user-id',
      course: 'test-course-id',
      completed: false,
      progress: 50,
      lastAccessed: new Date()
    };
    
    progressionServiceSpy.getCourseProgression.and.returnValue(of(mockProgression));
    progressionServiceSpy.updateProgression.and.returnValue(of(mockProgression));
    
    // Définir l'ID du cours
    component.courseId = 'test-course-id';
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data and progression on init', () => {
    component.ngOnInit();
    expect(authServiceSpy.isLoggedIn).toHaveBeenCalled();
    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    // Après un certain délai, getCourseProgression sera appelé une fois que l'ID utilisateur est récupéré
    expect(progressionServiceSpy.getCourseProgression).toHaveBeenCalledWith('default_user_id', 'test-course-id');
  });

  it('should update progress correctly', () => {
    // D'abord définir la progression dans le composant
    component.progression = {
      _id: 'test-progression-id',
      user: 'test-user-id',
      course: 'test-course-id',
      completed: false,
      progress: 50,
      lastAccessed: new Date()
    };
    
    component.updateProgress(75);
    expect(progressionServiceSpy.updateProgression).toHaveBeenCalledWith(
      'test-progression-id', 
      jasmine.objectContaining({
        progress: 75,
        completed: false,
        lastAccessed: jasmine.any(Date)
      })
    );
  });

  it('should mark as completed when progress is 100%', () => {
    // D'abord définir la progression dans le composant
    component.progression = {
      _id: 'test-progression-id',
      user: 'test-user-id',
      course: 'test-course-id',
      completed: false,
      progress: 50,
      lastAccessed: new Date()
    };
    
    component.updateProgress(100);
    expect(progressionServiceSpy.updateProgression).toHaveBeenCalledWith(
      'test-progression-id', 
      jasmine.objectContaining({
        progress: 100,
        completed: true,
        lastAccessed: jasmine.any(Date)
      })
    );
  });
});
