import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { ChangePasswordComponent } from './change-password.component';
import { MailService } from '../../services/mail.service';
import { AdminService } from '../../services/admin.service';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let mailService: jasmine.SpyObj<MailService>;
  let adminService: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    mailService = jasmine.createSpyObj('MailService', ['requestAuthCode', 'tryAuthCode']);
    adminService = jasmine.createSpyObj('AdminService', ['changePassword']);

    await TestBed.configureTestingModule({
      declarations: [ChangePasswordComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: MailService, useValue: mailService },
        { provide: AdminService, useValue: adminService },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle 400 error on submitEmail', () => {
    mailService.requestAuthCode.and.returnValue(throwError({ status: 400 }));

    component.emailForm.setValue({ email: 'invalid@example.com' });

    component.submitEmail();

    expect(component.message).toBe('An unexpected error occurred. Please try again.');
    expect(component.messageType).toBe('danger');
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
    component.email = 'test@example.com';
    component.verifyCode();

    expect(component.message).toBe('Incorrect verification code. Please try again.');
    expect(component.messageType).toBe('danger');
  });

  it('should reset password and handle success', () => {
    adminService.changePassword.and.returnValue(of(true));

    component.email = 'test@example.com';
    component.passwordForm.setValue({
      password: 'password123',
      confirmPassword: 'password123',
    });

    component.resetPassword();

    expect(adminService.changePassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(component.message).toBe('Registration successful! Redirecting to login...');
  });

  it('should handle resetPassword error', () => {
    adminService.changePassword.and.returnValue(throwError({}));

    component.email = 'test@example.com';
    component.passwordForm.setValue({
      password: 'password123',
      confirmPassword: 'password123',
    });

    component.resetPassword();

    expect(component.message).toBe('Failed to reset password. Please try again.');
    expect(component.messageType).toBe('danger');
  });
});
