import { Component } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//import { AuthService } from '../../../service/auth/auth.service';
import { Router } from '@angular/router';
import { FormCheck } from '../../../FormCheck';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  model: NgbDateStruct | undefined;

  success: boolean = true;
  serverError: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    //private auth: AuthService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    }, { validators: this.customValidation });
  }

  customValidation(group: FormGroup) {
    const emailControl = group.get('email');
    const passwordControl = group.get('password');

    if(emailControl && passwordControl){
      const email = emailControl.value;
      const password = passwordControl.value;

      //Email
      if (email && !FormCheck.checkEmail(email)) {
        emailControl.setErrors({ 'invalidEmail': true });
      } else {
        if (emailControl.hasError('invalidEmail')) {
          emailControl.setErrors(null);
        }
      }

    }
  }

  /*
  submitForm() {
    this.auth.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value, this.loginForm.get('rememberMe')?.value).
      subscribe(
        result => {
          if (result) {
            this.router.navigate(['/']);
          }
          else {
            this.success = false;
          }
        },
        error => {
          this.serverError = true;
        });
  }
  */

}
