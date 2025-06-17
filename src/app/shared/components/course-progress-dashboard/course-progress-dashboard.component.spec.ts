import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseProgressDashboardComponent } from './course-progress-dashboard.component';
import { ProgressionService } from '../../../services/progression.service';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('CourseProgressDashboardComponent', () => {
  let component: CourseProgressDashboardComponent;
  let fixture: ComponentFixture<CourseProgressDashboardComponent>;
  let progressionServiceSpy: jasmine.SpyObj<ProgressionService>;
  let courseServiceSpy: jasmine.SpyObj<CourseService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    progressionServiceSpy = jasmine.createSpyObj('ProgressionService', ['getUserProgressions']);
    courseServiceSpy = jasmine.createSpyObj('CourseService', ['getCourseById']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'isLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    await TestBed.configureTestingModule({
      imports: [ CourseProgressDashboardComponent ],
      providers: [
        { provide: ProgressionService, useValue: progressionServiceSpy },
        { provide: CourseService, useValue: courseServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseProgressDashboardComponent);
    component = fixture.componentInstance;
    
    // Mock de l'authentification
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getCurrentUser.and.returnValue(of({ _id: 'test-user-id', name: 'Test User' }));
    
    // Mock des progressions
    progressionServiceSpy.getUserProgressions.and.returnValue(of([{
      _id: 'prog1',
      user: 'test-user-id',
      course: 'course1',
      completed: false,
      progress: 50,
      lastAccessed: new Date()
    }, {
      _id: 'prog2',
      user: 'test-user-id',
      course: 'course2',
      completed: true,
      progress: 100,
      lastAccessed: new Date()
    }]));
    
    // Mock des cours
    courseServiceSpy.getCourseById.and.callFake((id) => {
      if (id === 'course1') {
        return of({
          _id: 'course1',
          id: 'course1',
          title: 'Cours 1',
          description: 'Description du cours 1',
          subject: 'subject1'
        });
      } else if (id === 'course2') {
        return of({
          _id: 'course2',
          id: 'course2',
          title: 'Cours 2',
          description: 'Description du cours 2',
          subject: 'subject1'
        });
      }
      return of(null);
    });
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data and progressions on init', () => {
    component.ngOnInit();
    expect(authServiceSpy.isLoggedIn).toHaveBeenCalled();
    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
  });

  it('should separate completed and in-progress courses', () => {
    component.ngOnInit();
    
    // Attendre que les observables soient complu00e9tu00e9s
    fixture.whenStable().then(() => {
      expect(component.inProgressCourses.length).toBe(1);
      expect(component.completedCourses.length).toBe(1);
      expect(component.inProgressCourses[0].course.title).toBe('Cours 1');
      expect(component.completedCourses[0].course.title).toBe('Cours 2');
    });
  });

  it('should navigate to course when continueCourse is called', () => {
    component.continueCourse('course1');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/cours', 'course1']);
  });

  it('should return appropriate progress class based on percentage', () => {
    expect(component.getProgressClass(100)).toBe('bg-success');
    expect(component.getProgressClass(80)).toBe('bg-info');
    expect(component.getProgressClass(60)).toBe('bg-primary');
    expect(component.getProgressClass(30)).toBe('bg-warning');
    expect(component.getProgressClass(10)).toBe('bg-danger');
  });
});
