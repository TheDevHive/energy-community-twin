import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewTemplateComponent } from './overview-template.component';
import { CommunityService } from '../../services/community.service';
import { BuildingService } from '../../services/building.service';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { Community } from '../../models/community';
import { Building } from '../../models/building';
import { Apartment } from '../../models/apartment';
import { AddBuildingComponent } from '../add-building/add-building.component';
import { CommunitySummaryComponent } from '../community-summary/community-summary.component';


describe('OverviewTemplateComponent', () => {
  let component: OverviewTemplateComponent;
  let fixture: ComponentFixture<OverviewTemplateComponent>;
  let communityServiceSpy: jasmine.SpyObj<CommunityService>;
  let buildingServiceSpy: jasmine.SpyObj<BuildingService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let modalServiceSpy: jasmine.SpyObj<NgbModal>;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    communityServiceSpy = jasmine.createSpyObj('CommunityService', ['getCommunity', 'getBuildings']);
    buildingServiceSpy = jasmine.createSpyObj('BuildingService', ['getApartments', 'createBuilding']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    const activatedRouteStub = {
      paramMap: of({
        get: (param: string) => (param === 'id' ? '1' : null),
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [
        OverviewTemplateComponent,
        CommunitySummaryComponent, // Add the component to declarations
      ],
      imports: [HttpClientModule],
      providers: [
        { provide: CommunityService, useValue: communityServiceSpy },
        { provide: BuildingService, useValue: buildingServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load community and buildings if no building ID is provided', () => {
      const mockAdmin = { id: 1, email: 'admin@example.com' };
      const mockCommunity: Community = {
        id: 1,
        name: 'Test Community',
        admin: mockAdmin,
        stats: {
          communityId: 1,
          buildings: 1,
          apartments: 0,
          members: 0,
          energyProduction: 0,
          energyConsumption: 0,
        },
      };
      const mockBuildings: Building[] = [
        {
          id: 1,
          community: mockCommunity,
          address: '123 Main St',
          floors: 3,
        },
      ];

      communityServiceSpy.getCommunity.and.returnValue(of(mockCommunity));
      communityServiceSpy.getBuildings.and.returnValue(of(mockBuildings));

      component.ngOnInit();

      expect(communityServiceSpy.getCommunity).toHaveBeenCalledWith(1);
      expect(communityServiceSpy.getBuildings).toHaveBeenCalledWith(1);
      expect(component.currentCommunity).toEqual(mockCommunity);
      expect(component.buildings).toEqual(mockBuildings);
      expect(component.currentVisualization).toBe('Community');
    });
  });

  describe('no buildings message', () => {
    /*
    it('should show message when there are no buildings', () => {
      // Ensure the component's state reflects no buildings
      component.buildings = [];
      component.currentVisualization = 'Community'; // Make sure the visualization is set to 'Community'
      fixture.detectChanges(); // Trigger change detection to update the template
  
      // Now query for the message element
      const messageElement = fixture.nativeElement.querySelector('.no-buildings-message');
      expect(messageElement).toBeTruthy(); // Check that the element exists
      expect(messageElement.textContent).toContain('No buildings registered to this community');
    });
    */

    it('should not show message when there is at least one building', () => {
      component.buildings = [
        {
          id: 1,
          community: { id: 1, name: 'Test Community', admin: { id: 1, email: 'admin@example.com' }, stats: { communityId:1, buildings: 1, apartments: 0, members: 0, energyProduction: 0, energyConsumption: 0 } },
          address: '123 Main St',
          floors: 3,
        },
      ];
      fixture.detectChanges(); // Update the template
      const messageElement = fixture.nativeElement.querySelector('.no-buildings-message');
      expect(messageElement).toBeNull();
    });
  });

  describe('logout', () => {
    it('should call authService.logout and navigate to /login', () => {
      component.logout();
      expect(authServiceSpy.logout).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('goBack', () => {
    it('should call location.back', () => {
      component.goBack();
      expect(locationSpy.back).toHaveBeenCalled();
    });
  });

  describe('addCard', () => {
    it('should open modal and create a building on success', async () => {
      const mockCommunity: Community = {
        id: 1,
        name: 'Test Community',
        admin: { id: 1, email: 'admin@example.com' },
        stats: {
          communityId: 1,
          buildings: 1,
          apartments: 0,
          members: 0,
          energyProduction: 0,
          energyConsumption: 0,
        },
      };
      component.currentCommunity = mockCommunity;

      const mockBuilding: Partial<Building> = {
        address: '456 Elm St',
        floors: 2,
      };
      const newBuilding: Building = {
        ...mockBuilding,
        id: 2,
        community: mockCommunity,
      } as Building;

      modalServiceSpy.open.and.returnValue({
        result: Promise.resolve(mockBuilding),
      } as any);

      buildingServiceSpy.createBuilding.and.returnValue(of(newBuilding));

      await component.addCard();

      expect(modalServiceSpy.open).toHaveBeenCalledWith(AddBuildingComponent);
      expect(buildingServiceSpy.createBuilding).toHaveBeenCalledWith(mockBuilding);
      expect(component.buildings).toContain(newBuilding);
    });

    it('should handle modal dismissal gracefully', async () => {
      modalServiceSpy.open.and.returnValue({
        result: Promise.reject('dismissed'),
      } as any);

      await component.addCard();

      expect(modalServiceSpy.open).toHaveBeenCalledWith(AddBuildingComponent);
    });
  });

  describe('changeVisualization', () => {
    it('should navigate to building view if currentVisualization is "Community"', () => {
      component.currentVisualization = 'Community';
      component.currentCommunity = { id: 1, name: 'Test Community', admin: { id: 1, email: 'admin@example.com' }, stats: { communityId:1, buildings: 1, apartments: 0, members: 0, energyProduction: 0, energyConsumption: 0 } };

      component.changeVisualization(2);

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/communities', 1, 'buildings', 2]);
    });
  });
});

