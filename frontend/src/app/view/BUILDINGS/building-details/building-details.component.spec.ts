import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AlertComponent } from '../../SHARED/alert/alert.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';



import { BuildingDetailsComponent } from './building-details.component';

describe('BuildingDetailsComponent', () => {
  let component: BuildingDetailsComponent;
  let fixture: ComponentFixture<BuildingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuildingDetailsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule], // Import RouterTestingModule
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (param: string) => 'someValue' // Mock any necessary route parameters here
            })
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Add CUSTOM_ELEMENTS_SCHEMA
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
