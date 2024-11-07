import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommunitiesComponent } from './communities.component';
import { CommunityService } from '../../../services/community.service';
import { Community } from '../../../models/community';
import { AddCommunityComponent } from '../add-community/add-community.component';
import { ChunkPipe } from '../../../pipes/chunk.pipe';
import { ErrorType } from '../../../models/api-error';
import { HttpClientModule } from '@angular/common/http';
import { ApiResponseService } from '../../../services/api-response.service';
import { ErrorService } from '../../../services/error.service';
import { ErrorModalService } from '../../../services/error-modal.service';
import { AlertComponent } from '../../SHARED/alert/alert.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

describe('CommunitiesComponent', () => {
  let component: CommunitiesComponent;
  let fixture: ComponentFixture<CommunitiesComponent>;
  let communityService: jasmine.SpyObj<CommunityService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let router: Router;
  let mockModalRef: any;

  const mockCommunities: Community[] = [
    {
      id: 1,
      name: 'Community 1',
      admin: { id: 1, email: 'admin1@test.com' },
      stats: {
        communityId: 1,
        buildings: 5,
        apartments: 25,
        members: 100,
        energyProduction: 5000,
        energyConsumption: 4500
      }
    },
    {
      id: 2,
      name: 'Community 2',
      admin: { id: 2, email: 'admin2@test.com' },
      stats: {
        communityId: 2,
        buildings: 3,
        apartments: 12,
        members: 50,
        energyProduction: 2000,
        energyConsumption: 1500
      }
    }
  ];

  beforeEach(async () => {
    // Create spies for services
    const communityServiceSpy = jasmine.createSpyObj('CommunityService', [
      'getCommunities',
      'createCommunity',
      'getStats'
    ]);
    communityServiceSpy.getCommunities.and.returnValue(of(mockCommunities));
    communityServiceSpy.getStats.and.returnValue(of([
      {
        communityId: 1,
        buildings: 5,
        apartments: 25,
        members: 100,
        energyProduction: 5000,
        energyConsumption: 4500
      },
      {
        communityId: 2,
        buildings: 3,
        apartments: 12,
        members: 50,
        energyProduction: 2000,
        energyConsumption: 1500
      }
    ]));

    mockModalRef = {
      componentInstance: {},
      result: Promise.resolve(),
      close: jasmine.createSpy('close'),
      dismiss: jasmine.createSpy('dismiss')
    };

    const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    modalServiceSpy.open.and.returnValue(mockModalRef);

    const errorServiceSpy = jasmine.createSpyObj('ErrorService', ['handleError']);
    const errorModalServiceSpy = jasmine.createSpyObj('ErrorModalService', ['showError']);

    await TestBed.configureTestingModule({
      declarations: [
        CommunitiesComponent,
        ChunkPipe,
        AddCommunityComponent,
        AlertComponent
      ],
      imports: [
        BrowserModule,
        RouterTestingModule,
        NgbModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule
      ],
      providers: [
        { provide: CommunityService, useValue: communityServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: ErrorService, useValue: errorServiceSpy },
        { provide: ErrorModalService, useValue: errorModalServiceSpy },
        ApiResponseService,
        ChunkPipe
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  afterEach(() => {
    fixture.destroy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitiesComponent);
    component = fixture.componentInstance;
    communityService = TestBed.inject(CommunityService) as jasmine.SpyObj<CommunityService>;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty communities array', () => {
    expect(component.communities).toBeDefined();
    expect(Array.isArray(component.communities)).toBeTruthy();
  });

  it('should load communities on init', () => {
    component.ngOnInit();
    expect(communityService.getCommunities).toHaveBeenCalled();
    expect(component.communities).toEqual(mockCommunities);
  });

  describe('navigateToCommunity', () => {
    it('should navigate to community detail page', () => {
      const communityId = 1;
      component.navigateToCommunity(communityId);
      expect(router.navigate).toHaveBeenCalledWith(['/communities', communityId]);
    });
  });

  describe('openAddCommunityDialog', () => {
    it('should open add community modal', fakeAsync(() => {
      component.openAddCommunityDialog();
      expect(modalService.open).toHaveBeenCalledWith(
        AddCommunityComponent,
        {
          centered: true,
          backdrop: 'static',
          windowClass: 'community-modal'
        }
      );
    }));

    it('should handle successful community creation', (done) => {
      const newCommunity: Community = {
        id: 3,
        name: 'New Community',
        admin: { id: 1, email: 'admin@test.com' },
        stats: {
          communityId: 3,
          buildings: 0,
          apartments: 0,
          members: 0,
          energyProduction: 0,
          energyConsumption: 0
        }
      };
    
      communityService.createCommunity.and.returnValue(of(newCommunity));
      mockModalRef.result = Promise.resolve({ name: 'New Community' });
    
      component.openAddCommunityDialog();
      mockModalRef.result.then(() => {
        expect(component.communities).toContain(newCommunity);
        done();  // Signal completion
      });
    });
    
  });
});