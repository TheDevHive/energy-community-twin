import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MailService } from './mail.service';
import { environment } from '../../environments/environment';

describe('MailService', () => {
  let service: MailService;
  let httpMock: HttpTestingController;

  const mockApiUrl = `${environment.API_ENDPOINT}/api/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MailService],
    });
    service = TestBed.inject(MailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call requestAuthCode and return true on success', () => {
    const mockMail = 'test@example.com';
    const isRegister = true;

    service.requestAuthCode(mockMail, isRegister).subscribe((response) => {
      expect(response).toBe(true);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/${isRegister}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(mockMail);
    req.flush(true); // Simula una risposta positiva
  });

  it('should handle conflict when email already exists during registration', () => {
    const mockMail = 'test@example.com';
    const isRegister = true;

    service.requestAuthCode(mockMail, isRegister).subscribe(
      () => fail('Expected an error, not a response'),
      (error) => {
        expect(error.status).toBe(409); // CONFLICT
        expect(error.statusText).toBe('Conflict');
      }
    );

    const req = httpMock.expectOne(`${mockApiUrl}/${isRegister}`);
    req.flush(null, { status: 409, statusText: 'Conflict' });
  });

  it('should handle not found when email does not exist during login', () => {
    const mockMail = 'test@example.com';
    const isRegister = false;

    service.requestAuthCode(mockMail, isRegister).subscribe(
      () => fail('Expected an error, not a response'),
      (error) => {
        expect(error.status).toBe(404); // NOT_FOUND
        expect(error.statusText).toBe('Not Found');
      }
    );

    const req = httpMock.expectOne(`${mockApiUrl}/${isRegister}`);
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });

  it('should call tryAuthCode and return a string on success', () => {
    const mockMail = 'test@example.com';
    const mockAuthCode = 123456;
    const isRegister = true;
    const mockResponse = 'Auth code verified successfully';

    service.tryAuthCode(mockMail, mockAuthCode, isRegister).subscribe((response) => {
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${mockApiUrl}/try/${mockAuthCode}/${isRegister}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(mockMail);
    req.flush(mockResponse, { headers: { 'Content-Type': 'text/plain' } }); // Simula una risposta positiva
  });

  it('should handle conflict when email exists during tryAuthCode with register flag', () => {
    const mockMail = 'test@example.com';
    const mockAuthCode = 123456;
    const isRegister = true;

    service.tryAuthCode(mockMail, mockAuthCode, isRegister).subscribe(
      () => fail('Expected an error, not a response'),
      (error) => {
        expect(error.status).toBe(409); // CONFLICT
        expect(error.statusText).toBe('Conflict');
      }
    );

    const req = httpMock.expectOne(`${mockApiUrl}/try/${mockAuthCode}/${isRegister}`);
    req.flush(null, { status: 409, statusText: 'Conflict' });
  });

  it('should handle not found when email does not exist during tryAuthCode with login flag', () => {
    const mockMail = 'test@example.com';
    const mockAuthCode = 123456;
    const isRegister = false;

    service.tryAuthCode(mockMail, mockAuthCode, isRegister).subscribe(
      () => fail('Expected an error, not a response'),
      (error) => {
        expect(error.status).toBe(404); // NOT_FOUND
        expect(error.statusText).toBe('Not Found');
      }
    );

    const req = httpMock.expectOne(`${mockApiUrl}/try/${mockAuthCode}/${isRegister}`);
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });

});
