import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminService } from './admin.service';
import { environment } from '../../environments/environment';
import { Credentials } from '../models/credentials';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  const mockApiUrl = `${environment.API_ENDPOINT}/admin`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService],
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica che non ci siano richieste pendenti
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call /register and return true when registration is successful', () => {
    const mockCredentials: Credentials = { email: 'admin@example.com', password: 'password123' };

    service.register(mockCredentials).subscribe((response) => {
      expect(response).toBe(true);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(true); // Simula una risposta positiva
  });

  it('should handle /register error when registration fails', () => {
    const mockCredentials: Credentials = { email: 'admin@example.com', password: 'password123' };
    const mockErrorMessage = 'Registration failed';

    service.register(mockCredentials).subscribe(
      () => fail('Expected an error, not a response'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.error).toBe(mockErrorMessage);
      }
    );

    const req = httpMock.expectOne(`${mockApiUrl}/register`);
    req.flush(mockErrorMessage, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should call /changePass and return true when password change is successful', () => {
    const mockCredentials: Credentials = { email: 'admin@example.com', password: 'newPassword123' };

    service.changePassword(mockCredentials).subscribe((response) => {
      expect(response).toBe(true);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/changePass`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(true); // Simula una risposta positiva
  });

  it('should handle /changePass error when password change fails', () => {
    const mockCredentials: Credentials = { email: 'admin@example.com', password: 'newPassword123' };
    const mockErrorMessage = 'Password change failed';

    service.changePassword(mockCredentials).subscribe(
      () => fail('Expected an error, not a response'),
      (error) => {
        expect(error.status).toBe(404);
        expect(error.error).toBe(mockErrorMessage);
      }
    );

    const req = httpMock.expectOne(`${mockApiUrl}/changePass`);
    req.flush(mockErrorMessage, { status: 404, statusText: 'Not Found' });
  });

  it('should handle /changePass error when credentials are missing', () => {
    const mockCredentials: Credentials = { email: '', password: '' };
    const mockErrorMessage = 'Bad Request';

    service.changePassword(mockCredentials).subscribe(
      () => fail('Expected an error, not a response'),
      (error) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe('Bad Request');
      }
    );

    const req = httpMock.expectOne(`${mockApiUrl}/changePass`);
    req.flush(mockErrorMessage, { status: 400, statusText: 'Bad Request' });
  });
});
