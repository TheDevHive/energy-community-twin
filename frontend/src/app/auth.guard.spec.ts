import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './services/auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;
  let router: Router;
  
  beforeEach(() => {
    // Create a mock AuthService
    const authServiceMock = {
      isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(false) // Change to true for success
    };
    
    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };
    
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
    
    authGuard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });
  
  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });
  
  it('should activate if user is authenticated', () => {
    authService.isAuthenticated = jasmine.createSpy('isAuthenticated').and.returnValue(true);
    const canActivate = authGuard.canActivate();
    
    expect(canActivate).toBe(true);
  });
  
  it('should not activate if user is not authenticated and navigate to login', () => {
    authService.isAuthenticated = jasmine.createSpy('isAuthenticated').and.returnValue(false);
    const canActivate = authGuard.canActivate();
    
    expect(canActivate).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']); // Adjust the route if necessary
  });
});
