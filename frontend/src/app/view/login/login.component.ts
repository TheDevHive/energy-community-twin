import { Component } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { FormCheck } from '../../FormCheck';

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

      // Email check
      if (email && !FormCheck.checkEmail(email)) {
        emailControl.setErrors({ 'invalidEmail': true });
      } else {
        if (emailControl.hasError('invalidEmail')) {
          emailControl.setErrors(null);
        }
      }

    }
  }

  
  submitForm() {
    //this.success = false;
    //this.serverError = true;

    this.router.navigate(['/']);
  }

}
