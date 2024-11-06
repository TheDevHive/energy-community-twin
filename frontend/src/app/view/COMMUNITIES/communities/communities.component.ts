import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunityService } from '../../../services/community.service';
import { Community } from '../../../models/community';
import { AddCommunityComponent } from './../add-community/add-community.component';
import { Router } from '@angular/router';
import { ErrorType } from '../../../models/api-error';

import { COMMUNITIES } from '../../../MOCKS/COMMUNITIES';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

import { ViewChild } from '@angular/core';
import { AlertService } from '../../../services/alert.service';


@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.css']
})
export class CommunitiesComponent implements OnInit, AfterViewInit {
  communities: Community[] = [];
  loading = false;
  error?: { type: ErrorType; message: string };

  displayedColumns: string[] = ['name', 'buildings', 'apartments', 'members', 'energyProduction', 'energyConsumption', 'actions'];
  dataSource: MatTableDataSource<Community>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private communityService: CommunityService,
    private modalService: NgbModal,
    private router: Router,
    private alert: AlertService
  ) {    
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadCommunities();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    this.communities = COMMUNITIES;
    this.dataSource.data = COMMUNITIES;
  }
  
  private createCommunity(communityData: {name: string}): void {
    this.loading = true;
    this.error = undefined;

    this.communityService.createCommunity(communityData).subscribe({
      next: (newCommunity) => {
        this.communities = [...this.communities, newCommunity];
        this.loading = false;
        this.alert.setAlertCommunities('success', `Community <strong>${newCommunity.name}</strong> created successfully`);
      },
      error: (error) => {
        this.error = error;
        console.log(this.error);
        this.loading = false;
        //this.alert.setAlertCommunities('danger', `Failed to create community: <strong>${error.message}</strong>`);
      }
    });
  }

  navigateToCommunity(id: number): void {
    this.router.navigate(['/communities', id]);
  }

  totalEnergyProduction(): number {
    return this.dataSource.filteredData.reduce((sum, community) => sum + community.stats.energyProduction, 0);
  }

  totalEnergyConsumption(): number {
    return this.dataSource.filteredData.reduce((sum, community) => sum + community.stats.energyConsumption, 0);
  }  
  
  totalMembers(): number {
    return this.dataSource.filteredData.reduce((sum, community) => sum + community.stats.members, 0);
  }

  onSortChange(sort: Sort): void {
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = this.communities;
    } else {
      this.dataSource.data = this.communities.slice().sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'name': return this.compare(a.name, b.name, isAsc);
          case 'buildings': return this.compare(a.stats.buildings, b.stats.buildings, isAsc);
          case 'apartments': return this.compare(a.stats.apartments, b.stats.apartments, isAsc);
          case 'members': return this.compare(a.stats.members, b.stats.members, isAsc);
          case 'energyProduction': return this.compare(a.stats.energyProduction, b.stats.energyProduction, isAsc);
          case 'energyConsumption': return this.compare(a.stats.energyConsumption, b.stats.energyConsumption, isAsc);
          default: return 0;
        }
      });
    }
    this.dataSource.paginator = this.paginator;
  }

  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
}