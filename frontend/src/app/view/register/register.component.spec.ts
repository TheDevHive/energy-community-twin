import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { MailService } from '../../services/mail.service';
import { AdminService } from '../../services/admin.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let mailService: jasmine.SpyObj<MailService>;
  let adminService: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    mailService = jasmine.createSpyObj('MailService', ['requestAuthCode', 'tryAuthCode']);
    adminService = jasmine.createSpyObj('AdminService', ['register']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: MailService, useValue: mailService },
        { provide: AdminService, useValue: adminService },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle 400 error on submitForm', () => {
    // Mock the requestAuthCode method to throw a 400 error
    mailService.requestAuthCode.and.returnValue(throwError({ status: 400 }));
  
    // Set valid form values
    component.registerForm.setValue({
      email: 'invalid@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    });
  
    // Call the submitForm method
    component.submitForm();
  
    // Verify the correct error message and type are set
    expect(component.message).toBe('Email is missing or invalid.');
    expect(component.messageType).toBe('danger');
  });
  

  it('should call tryAuthCode and handle success', () => {
    mailService.tryAuthCode.and.returnValue(of('correct'));
    adminService.register.and.returnValue(of(true));

    component.verificationForm.setValue({
      code1: '1',
      code2: '2',
      code3: '3',
      code4: '4',
      code5: '5',
    });
    component.credentials = { email: 'test@example.com', password: 'password123' };
    component.tryAuthCode();

    expect(mailService.tryAuthCode).toHaveBeenCalledWith('test@example.com', 12345, true);
    expect(adminService.register).toHaveBeenCalled();
  });

  it('should show error message if verification code is wrong', () => {
    mailService.tryAuthCode.and.returnValue(of('wrong'));

    component.verificationForm.setValue({
      code1: '1',
      code2: '2',
      code3: '3',
      code4: '4',
      code5: '5',
    });
    component.credentials = { email: 'test@example.com', password: 'password123' };
    component.tryAuthCode();

    expect(component.message).toBe('Incorrect verification code. Please try again.');
    expect(component.messageType).toBe('danger');
  });

  it('should redirect after successful registration', (done) => {
    mailService.tryAuthCode.and.returnValue(of('correct'));
    adminService.register.and.returnValue(of(true));

    component.credentials = { email: 'test@example.com', password: 'password123' };
    component.verificationForm.setValue({
      code1: '1',
      code2: '2',
      code3: '3',
      code4: '4',
      code5: '5',
    });

    component.tryAuthCode();
    setTimeout(() => {
      expect(component.message).toBe('Registration successful! Redirecting to login...');
      done();
    }, 2000);
  });
});
