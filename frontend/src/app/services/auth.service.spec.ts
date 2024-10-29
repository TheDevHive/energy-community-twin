import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    const mockAuthToken = {
      token: 'mock-jwt-token',
      role: 'USER'
    };

    it('should successfully login and store token', () => {
      service.login(testEmail, testPassword).subscribe(result => {
        expect(result).toBe(true);
        expect(localStorage.getItem('authToken')).toBe(mockAuthToken.token);
        expect(localStorage.getItem('authRole')).toBe(mockAuthToken.role);
      });

      const req = httpTestingController.expectOne(`${environment.API_ENDPOINT}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: testEmail, password: testPassword });
      
      req.flush(mockAuthToken);
    });

    it('should return false on 401 unauthorized', () => {
      service.login(testEmail, testPassword).subscribe(result => {
        expect(result).toBe(false);
        expect(localStorage.getItem('authToken')).toBeNull();
        expect(localStorage.getItem('authRole')).toBeNull();
      });

      const req = httpTestingController.expectOne(`${environment.API_ENDPOINT}/login`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should return false on 404 not found', () => {
      service.login(testEmail, testPassword).subscribe(result => {
        expect(result).toBe(false);
        expect(localStorage.getItem('authToken')).toBeNull();
        expect(localStorage.getItem('authRole')).toBeNull();
      });

      const req = httpTestingController.expectOne(`${environment.API_ENDPOINT}/login`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should throw error on other HTTP errors', (done) => {
      service.login(testEmail, testPassword).subscribe({
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(localStorage.getItem('authToken')).toBeNull();
          expect(localStorage.getItem('authRole')).toBeNull();
          done();
        }
      });

      const req = httpTestingController.expectOne(`${environment.API_ENDPOINT}/login`);
      req.flush('Server Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('logout', () => {
    it('should clear token and role from localStorage', () => {
      // Setup initial state
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem('authRole', 'USER');

      service.logout();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('authRole')).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('authToken', 'test-token');
      // Re-create service to load from localStorage
      service = TestBed.inject(AuthService);
      
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getHeaders', () => {
    it('should return headers with Authorization token', () => {
      const testToken = 'test-token';
      localStorage.setItem('authToken', testToken);
      // Re-create service to load from localStorage
      service = TestBed.inject(AuthService);

      const headers = service.getHeaders();
      expect(headers.get('Authorization')).toBe(`Basic ${testToken}`);
    });

    it('should return headers with empty Authorization when no token exists', () => {
      const headers = service.getHeaders();
      expect(headers.get('Authorization')).toBe('Basic ');
    });
  });

  describe('Constructor', () => {
    it('should restore auth state from localStorage on initialization', () => {
      const testToken = 'test-token';
      const testRole = 'USER';
      
      localStorage.setItem('authToken', testToken);
      localStorage.setItem('authRole', testRole);
      
      // Re-create service to test constructor
      service = TestBed.inject(AuthService);
      
      expect(service.isAuthenticated()).toBe(true);
      expect(service.getHeaders().get('Authorization')).toBe(`Basic ${testToken}`);
    });

    it('should initialize without auth state when localStorage is empty', () => {
      // Re-create service to test constructor
      service = TestBed.inject(AuthService);
      
      expect(service.isAuthenticated()).toBe(false);
      expect(service.getHeaders().get('Authorization')).toBe('Basic ');
    });
  });
});