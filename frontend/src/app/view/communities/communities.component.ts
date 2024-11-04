import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunityService } from './../../services/community.service';
import { Community } from '../../models/community';
import { AddCommunityComponent } from './../add-community/add-community.component';
import { Router } from '@angular/router';
import { ErrorType } from '../../models/api-error';
import { AuthService } from '../../services/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.css']
})
export class CommunitiesComponent implements OnInit, AfterViewInit {
  communities: Community[] = [];
  loading = false;
  error?: { type: ErrorType; message: string };


  constructor(
    private communityService: CommunityService,
    private modalService: NgbModal,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCommunities();
  }

  ngAfterViewInit() {
    // Initialize Bootstrap carousel
    const carousel = document.querySelector('#communitiesCarousel');
    if (carousel) {
      new bootstrap.Carousel(carousel, {
        interval: 5000,
        wrap: true
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openAddCommunityDialog(): void {
    const modalRef = this.modalService.open(AddCommunityComponent, {
      centered: true,
      backdrop: 'static',
      windowClass: 'community-modal'
    });

    modalRef.result.then(
      (result) => {
        if (result) {
          this.createCommunity(result);
        }
      },
      (reason) => {
        // Modal dismissed
      }
    );
  }

  private loadCommunities(): void {
    this.loading = true;
    this.error = undefined;
    this.communityService.getCommunities().subscribe({
      next: (communities) => {
        this.communities = communities;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  private createCommunity(communityData: {name: string}): void {
    this.loading = true;
    this.error = undefined;

    this.communityService.createCommunity(communityData).subscribe({
      next: (newCommunity) => {
        this.communities = [...this.communities, newCommunity];
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        console.log(this.error);
        this.loading = false;
      }
    });
  }


  navigateToCommunity(id: number): void {
    this.router.navigate(['/communities', id]);
  }

  // Helper method to chunk array for carousel
  chunk(arr: any[], size: number): any[] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
      arr.slice(i * size, i * size + size)
    );
  }
}