// header.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

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
    private authService: AuthService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.loadEmail();
  }

  loadEmail(): void {
    this.authService.getCredentials().subscribe(
      (creds) => {
        this.userEmail = creds.email;
        this.userInitials = this.getInitials(this.userEmail);
      },
      (error) => {
        console.error('Failed to load user email:', error);
      }
    );
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
    const modalRef = this.modalService.open(ConfirmationDialogComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.componentInstance.title = 'Confirm Logout';
    modalRef.componentInstance.message = 'Are you sure you want to log out?';
    modalRef.componentInstance.confirmText = 'Logout';
    modalRef.componentInstance.cancelText = 'Cancel';
    modalRef.componentInstance.color = 'red';

    modalRef.result.then(
      (confirmed) => {
        if (confirmed) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      },
      () => {
        // Handle dismissal (optional)
      }
    );
  }
}