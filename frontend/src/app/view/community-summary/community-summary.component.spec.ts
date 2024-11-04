import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitySummaryComponent } from './community-summary.component';

describe('CommunitySummaryComponent', () => {
  let component: CommunitySummaryComponent;
  let fixture: ComponentFixture<CommunitySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunitySummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunitySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
