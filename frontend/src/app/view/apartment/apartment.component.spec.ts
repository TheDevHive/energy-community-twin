import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApartmentComponent } from './apartment.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ApartmentComponent', () => {
  let component: ApartmentComponent;
  let fixture: ComponentFixture<ApartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApartmentComponent],
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
