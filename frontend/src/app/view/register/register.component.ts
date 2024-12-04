import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MailService } from '../../services/mail.service';
import { AdminService } from '../../services/admin.service';
import { Credentials } from '../../models/credentials';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  verificationForm: FormGroup;
  serverError: boolean = false;
  authCodeSended: boolean = false;
  message: string = '';
  messageType: 'success' | 'danger' = 'success';

  private timeoutHandle: any;

  credentials!: Credentials;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private mailService: MailService,
    private adminService: AdminService
  ) {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.customValidation });

    this.verificationForm = this.fb.group({
      code1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      code2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      code3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      code4: ['', [Validators.required, Validators.pattern('[0-9]')]],
      code5: ['', [Validators.required, Validators.pattern('[0-9]')]]
    });
  }

  customValidation = (group: FormGroup) => {
    const emailControl = group.get('email');
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');

    if (emailControl && !this.checkEmail(emailControl.value)) {
      emailControl.setErrors({ 'invalidEmail': true });
    }

    if (passwordControl && confirmPasswordControl && 
        passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ 'passwordMismatch': true });
    } else if (confirmPasswordControl?.hasError('passwordMismatch')) {
      confirmPasswordControl.setErrors(null);
    }
  };

  submitForm() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
  
      this.credentials = {
        email: email,
        password: password,
      };
  
      this.mailService.requestAuthCode(email).subscribe({
        next: (response: boolean) => {
          if (response) {
            this.authCodeSended = true;
            this.registerForm.reset(); // Pulisce il modulo
          } else {
            console.log('Internal Server Error');
          }
        },
        error: (error) => {
          if (error.status === 400) {
            this.showMessage('Email is missing or invalid.', 'danger');
          } else if (error.status === 409) {
            this.showMessage('Conflict: Email already exists.', 'danger');
          } else {
            this.showMessage('An unexpected error occurred.', 'danger');
          }
        },
      });
    }
  }
  

  resendAuthCode() {
    this.mailService.requestAuthCode(this.credentials.email).subscribe({
      next: (response: boolean) => {
        if (response) {
          console.log('Auth code resent successfully');
        }
      },
      error: (error) => {
        console.error('Failed to resend auth code:', error);
      }
    });
  }

  tryAuthCode() {
    const authCodeObject = this.verificationForm.value;
    const authCodeString = Object.values(authCodeObject).join('');
    
    if (authCodeString.length < 5) {
      console.log('Incomplete verification code');
      this.showMessage('Please enter all 5 digits of the verification code.', 'danger');
      return;
    }
  
    const authCode = parseInt(authCodeString, 10);
    
    console.log('Auth Code as Integer:', authCode);
    console.log(this.credentials.email);
    
    this.mailService.tryAuthCode(this.credentials.email, authCode).subscribe({
      next: (response: string) => {
        if (response) {
          switch (response) {
            case 'correct':
              this.registerAdmin();
              break;
  
            case 'not_requested':
              console.error('Verification code not requested for this email.');
              this.showMessage('Verification code not requested. Please register again.', 'danger');
              break;
  
            case 'removed':
              console.error('Verification code expired.');
              this.showMessage('Verification code expired or too many attempts. Please request a new code.', 'danger');
              break;
  
            case 'wrong':
              console.error('Incorrect verification code.');
              this.showMessage('Incorrect verification code. Please try again.', 'danger');
              break;
  
            default:
              console.error(`Unhandled response: ${response}`);
              this.showMessage('An unexpected error occurred. Please try again.', 'danger');
              break;
          }
        } else {
          console.error('Empty response from server.');
          this.showMessage('An unexpected error occurred. Please try again.', 'danger');
        }
      },
      error: (error) => {
        switch (error.status) {
          case 400:
            console.error('Bad Request: Email or Authentication Code are missing.');
            this.showMessage('Email or Authentication Code are missing.', 'danger');
            break;
  
          case 409:
            console.error('Conflict: Email already registered.');
            this.showMessage('This email is already registered.', 'danger');
            break;
  
          default:
            console.error('Unexpected error:', error);
            this.showMessage('An unexpected error occurred. Please try again.', 'danger');
            break;
        }
      }
    });
  }
  
  
  registerAdmin() {
    this.adminService.register(this.credentials).subscribe({
      next: (outcome: boolean) => {
        console.log('Registration successful.');
        this.showMessage('Registration successful! Redirecting to login...', 'success');
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: () => {
        console.error('Error during registration.');
        this.showMessage('An error occurred during registration. Please try again.', 'danger');
      }
    });
  }
  

  checkEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }


  showMessage(message: string, type: 'success' | 'danger') {
    this.message = message;
    this.messageType = type;

    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }

    this.timeoutHandle = setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  
}
