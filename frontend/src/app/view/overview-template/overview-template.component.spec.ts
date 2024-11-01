import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewTemplateComponent } from './overview-template.component';

describe('OverviewTemplateComponent', () => {
  let component: OverviewTemplateComponent;
  let fixture: ComponentFixture<OverviewTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverviewTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
