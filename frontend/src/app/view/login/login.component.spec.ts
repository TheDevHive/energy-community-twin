import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should show an error when email is invalid', () => {
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue('invalid-email');
    emailControl.markAsTouched();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.invalid-feedback')?.textContent).toContain('Enter a valid email');
  });

  it('should not show an error when email is valid', () => {
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue('test@example.com');
    emailControl.markAsTouched();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.invalid-feedback')).toBeNull();
  });

  it('should show the credentials error message', () => {
    component.credentialsWrong = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.alert-danger')?.textContent).toContain('Incorrect email or password');
  });

  it('should show the server error message', () => {
    component.serverError = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.alert-danger')?.textContent).toContain('Login error');
  });

  it('should navigate on successful login', () => {
    spyOn(router, 'navigate');
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    component.submitForm();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not navigate if the form is invalid', () => {
    spyOn(router, 'navigate');
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    component.submitForm();

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
