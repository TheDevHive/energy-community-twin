import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoginPage: boolean = false;
  isRegisterPage: boolean = false;
  isChangePassPage: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd) // Only listen for NavigationEnd events
      )
      .subscribe(event => {
        // Check if the current route is the login page
        this.isLoginPage = this.router.url === '/login';
        this.isRegisterPage = this.router.url === '/register';
        this.isChangePassPage = this.router.url === '/changePassword';
      });
  }
}
