import { Component } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  model: NgbDateStruct | undefined;

  credentialsWrong: boolean = false;
  serverError: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    }, { validators: this.customValidation });
  }

  customValidation = (group: FormGroup) => {
    const emailControl = group.get('email');
    const passwordControl = group.get('password');

    if (emailControl && passwordControl) {
      const email = emailControl.value;

      // Email check
      if (email && !this.checkEmail(email)) {
        emailControl.setErrors({ 'invalidEmail': true });
      } else {
        if (emailControl.hasError('invalidEmail')) {
          emailControl.setErrors(null);
        }
      }
    }
  };

  submitForm() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      this.authService.login(email, password).subscribe({
        next: (isLoggedIn) => {
          if (isLoggedIn) {
            // Navigate to the dashboard on successful login
            this.router.navigate(['/']);
          } else {
            // Show credentials wrong message if login fails
            this.credentialsWrong = true;
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          // Show server error message
          this.serverError = true;
        }
      });
    }
  }
  
  checkEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

}
