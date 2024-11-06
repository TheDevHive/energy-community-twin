// header.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userEmail: string = '';
  userInitials: string = '';
  searchQuery: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Assuming your AuthService has a method to get the current user's email
    this.userEmail = "a@a.com"; // this.authService.getCurrentUserEmail();
    this.userInitials = this.getInitials(this.userEmail);
  }

  getInitials(email: string): string {
    if (!email) return '';
    return email
      .split('@')[0] // Get the part before @
      .split(/[._-]/) // Split by common username separators
      .map(part => part[0]?.toUpperCase() || '') // Get first letter of each part
      .slice(0, 2) // Take first two initials
      .join('');
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Implement your search logic here
      console.log('Searching for:', this.searchQuery);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}