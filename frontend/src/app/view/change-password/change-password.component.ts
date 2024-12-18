import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { MailService } from '../../services/mail.service';
import { Credentials } from '../../models/credentials';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  currentStep: 'email' | 'verification' | 'resetPassword' = 'email';
  emailForm: FormGroup;
  verificationForm: FormGroup;
  passwordForm: FormGroup;
  message: string = '';
  messageType: 'success' | 'danger' = 'success';

  // New loading property
  loading: boolean = false;

  email!: string;

  private timeoutHandle: any;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private mailService: MailService,
    private router: Router,
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.verificationForm = this.fb.group({
      code1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      code2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      code3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      code4: ['', [Validators.required, Validators.pattern('[0-9]')]],
      code5: ['', [Validators.required, Validators.pattern('[0-9]')]],
    });

    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  showMessage(message: string, type: 'success' | 'danger') {
    this.message = message;
    this.messageType = type;

    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }

    this.timeoutHandle = setTimeout(() => {
      this.message = '';
      this.messageType = 'success';
    }, 7500);
  }

  checkEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  submitEmail() {
    if (this.emailForm.valid) {
      const email = this.emailForm.value.email;

      if (!this.checkEmail(email)) {
        this.showMessage('Invalid email format.', 'danger');
        return;
      }

      // Set loading to true before request
      this.loading = true;

      this.email = email;
      this.mailService.requestAuthCode(email, false).subscribe({
        next: (response: boolean) => {
          if (response) {
            this.changeStep();
            this.showMessage('Verification code sent successfully.', 'success');
          }
          // Set loading back to false
          this.loading = false;
        },
        error: (error) => {
          // Set loading back to false
          this.loading = false;

          if (error.status === 404)
            this.showMessage('This Email is not associated with any account', 'danger');
          else
            this.showMessage('An unexpected error occurred. Please try again.', 'danger');
        }
      });
    }
  }

  changeStep() {
    if (this.currentStep === 'email') {
      this.currentStep = 'verification';
    } else if (this.currentStep === 'verification') {
      this.currentStep = 'resetPassword';
    }
  }
  
  verifyCode() {
    const authCodeObject = this.verificationForm.value;
    const authCodeString = Object.values(authCodeObject).join('');

    if (authCodeString.length < 5) {
      this.showMessage('Please enter all 5 digits of the verification code.', 'danger');
      return;
    }
    const authCode = parseInt(authCodeString, 10);

    // Set loading to true before request
    this.loading = true;

    this.mailService.tryAuthCode(this.email, authCode, false).subscribe({
      next: (response: string) => {
        // Set loading back to false
        this.loading = false;

        switch (response) {
          case 'correct':
            this.changeStep();
            break;
    
          case 'wrong':
            this.showMessage('Incorrect verification code. Please try again.', 'danger');
            break;
    
          case 'removed':
            this.showMessage('Verification code expired or too many attempts. Please request a new code.', 'danger');
            break;
    
          case 'not_requested':
            this.showMessage('Verification code not requested. Please request one.', 'danger');
            break;
    
          default:
            this.showMessage('An unexpected error occurred. Please try again.', 'danger');
            break;
        }
      },
      error: (error) => {
        // Set loading back to false
        this.loading = false;

        switch (error.status) {
          case 400:
            this.showMessage('Email or Authentication Code are missing.', 'danger');
            break;
    
          case 404:
            this.showMessage('This email is not associated with any account.', 'danger');
            break;
    
          default:
            this.showMessage('An unexpected error occurred. Please try again.', 'danger');
            break;
        }
      },
    });
  }

  resetPassword() {
    if (this.passwordForm.valid) {
      const { password } = this.passwordForm.value;

      const credentials: Credentials = {
        email: this.email,
        password: password
      };

      // Set loading to true before request
      this.loading = true;

      this.adminService.changePassword(credentials).subscribe({
        next: (response: boolean) => {
          // Set loading back to false
          this.loading = false;

          if (response) {
            this.showMessage('Registration successful! Redirecting to login...', 'success');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          }
        },
        error: () => {
          // Set loading back to false
          this.loading = false;
          this.showMessage('Failed to reset password. Please try again.', 'danger');
        },
      });
    }
  }

  resendAuthCode() {
    // Set loading to true before request
    this.loading = true;

    this.mailService.requestAuthCode(this.email, false).subscribe({
      next: () => {
        // Set loading back to false
        this.loading = false;
        this.showMessage('Verification code sent successfully.', 'success');
      },
      error: () => {
        // Set loading back to false
        this.loading = false;
        this.showMessage('Failed to resend verification code.', 'danger');
      },
    });
  }

  onPaste(event: ClipboardEvent, startIndex: number): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const pastedText = clipboardData.getData('text');
    if (!pastedText) return;

    const inputFields = ['code1', 'code2', 'code3', 'code4', 'code5'];

    // Populate the inputs starting from the index where paste occurred
    for (let i = 0; i < pastedText.length; i++) {
      const targetIndex = startIndex + i;
      if (targetIndex >= inputFields.length) break;

      const controlName = inputFields[targetIndex];
      this.verificationForm.controls[controlName].setValue(pastedText[i]);
    }
  }
}