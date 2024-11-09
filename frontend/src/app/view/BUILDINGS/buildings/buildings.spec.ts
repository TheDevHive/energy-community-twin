import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BuildingsComponent } from './buildings.component';
import { BuildingService } from '../../../services/building.service';
import { CommunityService } from '../../../services/community.service';
import { AlertService } from '../../../services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BUILDINGS } from '../../../MOCKS/BUILDINGS';
import { COMMUNITIES } from '../../../MOCKS/COMMUNITIES';


// Mock services
class MockBuildingService {
  getStats() {
    return of(BUILDINGS.map(building => building.stats));
  }
  createBuilding(buildingData: any) {
    return of(buildingData);
  }
  updateBuilding(buildingData: any) {
    return of(buildingData);
  }
  removeBuilding(id: number) {
    return of({});
  }
}

class MockCommunityService {
  getCommunity(id: number) {
    return of(COMMUNITIES.find(community => community.id === id));
  }
  getBuildings(communityId: number) {
    return of(BUILDINGS.filter(building => building.community.id === communityId));
  }
}

class MockAlertService {
  setAlertBuildings(type: string, message: string) {}
}

class MockNgbModal {
  open() {
    return {
      result: Promise.resolve(true),
      componentInstance: {},
    };
  }
}

class MockRouter {
  navigate(commands: any[]) {}
}

class MockActivatedRoute {
  paramMap = of({
    get: (key: string) => '1',
  });
}

describe('BuildingsComponent', () => {
  let component: BuildingsComponent;
  let fixture: ComponentFixture<BuildingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildingsComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: BuildingService, useClass: MockBuildingService },
        { provide: CommunityService, useClass: MockCommunityService },
        { provide: AlertService, useClass: MockAlertService },
        { provide: NgbModal, useClass: MockNgbModal },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with community ID from route params', () => {
    expect(component.communityId).toBe(1);
    expect(component.communityName).toBe('Green Energy Community');
  });

  it('should load buildings on initialization', () => {
    expect(component.buildings.length).toBeGreaterThan(0);
    expect(component.dataSource.data).toEqual(BUILDINGS.filter(building => building.community.id === 1));
  });

  // Additional tests using BUILDINGS and COMMUNITIES mocks...
});
