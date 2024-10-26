import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in successfully with correct credentials', (done) => {
    service.login('user@example.com', 'password123').subscribe(isLoggedIn => {
      expect(isLoggedIn).toBeTrue();
      expect(service.isAuthenticated()).toBeTrue();
      done();
    });

    const req = httpTestingController.expectOne('api/login');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });
  });

  it('should fail login with incorrect credentials', (done) => {
    service.login('user@example.com', 'wrongpassword').subscribe({
      next: () => fail('Expected login to fail'),
      error: (error) => {
        expect(error.message).toContain('Login failed due to server error');
        expect(service.isAuthenticated()).toBeFalse();
        done();
      }
    });

    const req = httpTestingController.expectOne('api/login');
    expect(req.request.method).toBe('POST');
    req.flush({ success: false }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle server error during login', (done) => {
    service.login('user@example.com', 'password123').subscribe({
      next: () => fail('Expected login to fail due to server error'),
      error: (error) => {
        expect(error.message).toContain('Login failed due to server error');
        expect(service.isAuthenticated()).toBeFalse();
        done();
      }
    });

    const req = httpTestingController.expectOne('api/login');
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('Network error'));
  });
});
