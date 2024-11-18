import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCommunityComponent } from './add-community.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { of } from 'rxjs';

describe('AddCommunityComponent', () => {
  let component: AddCommunityComponent;
  let fixture: ComponentFixture<AddCommunityComponent>;
  let mockActiveModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    mockActiveModal = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);
    
    await TestBed.configureTestingModule({
      declarations: [AddCommunityComponent],
      imports: [ReactiveFormsModule], // Import ReactiveFormsModule here
      providers: [
        { provide: NgbActiveModal, useValue: mockActiveModal },
        FormBuilder
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should close modal with form value on submit', () => {
    const formValue = {
      name: 'Test Community',
      id: '',
      stats: {
        communityId: '',
        buildings: '',
        apartments: '',
        members: '',
        energyProduction: '',
        energyConsumption: ''
      }
    };

    component.communityForm.setValue({
      name: 'Test Community',
      id: '',
      stats: {
        communityId: '',
        buildings: '',
        apartments: '',
        members: '',
        energyProduction: '',
        energyConsumption: ''
      }
    });

    component.onSubmit();

    // Check if the modal was closed with the correct value
    expect(mockActiveModal.close).toHaveBeenCalledWith(formValue);
  });
});
