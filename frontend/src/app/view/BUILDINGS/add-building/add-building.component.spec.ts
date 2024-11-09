import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddBuildingComponent } from './add-building.component';
import { Building } from '../../../models/building';

describe('AddBuildingComponent', () => {
  let component: AddBuildingComponent;
  let fixture: ComponentFixture<AddBuildingComponent>;
  let activeModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);

    await TestBed.configureTestingModule({
      declarations: [AddBuildingComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        { provide: NgbActiveModal, useValue: activeModalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddBuildingComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize with empty address and floors fields', () => {
      expect(component.buildingForm).toBeDefined();
      expect(component.buildingForm.get('address')?.value).toBe('');
      expect(component.buildingForm.get('floors')?.value).toBe(0);
    });

    it('should start with form in an invalid state', () => {
      expect(component.buildingForm.valid).toBeFalse();
    });

    it('should have loading set to false initially', () => {
      expect(component.loading).toBeFalse();
    });
  });

  describe('Form Validation', () => {
    it('should mark address as invalid if empty or whitespace', () => {
      const addressControl = component.buildingForm.get('address');
      addressControl?.setValue('');
      expect(addressControl?.valid).toBeFalse();
      expect(addressControl?.errors?.['required']).toBeTruthy();

      addressControl?.setValue('   ');
      expect(addressControl?.valid).toBeFalse();
      expect(addressControl?.errors?.['whitespace']).toBeTruthy();
    });

    it('should mark floors as invalid if less than 1', () => {
      const floorsControl = component.buildingForm.get('floors');
      floorsControl?.setValue(0);
      expect(floorsControl?.valid).toBeFalse();
      expect(floorsControl?.errors?.['min']).toBeTruthy();
    });

    it('should mark form as valid with correct input values', () => {
      component.buildingForm.get('address')?.setValue('123 Main St');
      component.buildingForm.get('floors')?.setValue(5);
      expect(component.buildingForm.valid).toBeTrue();
    });
  });

  describe('Form Submission', () => {
    it('should not submit if form is invalid', () => {
      component.onSubmit();
      expect(activeModal.close).not.toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });

    it('should submit if form is valid', () => {
      component.buildingForm.get('address')?.setValue('123 Main St');
      component.buildingForm.get('floors')?.setValue(5);
    
      component.onSubmit();
    
      expect(activeModal.close).toHaveBeenCalledWith({
        id: '',  // Include id as an empty string to match the component's output
        address: '123 Main St',
        floors: 5
      });
    });
  });

  describe('Modal Interactions', () => {
    it('should dismiss the modal when dismiss is called', () => {
      component.dismiss();
      expect(activeModal.dismiss).toHaveBeenCalled();
    });

    it('should close the modal with building data on successful submit', () => {
      component.buildingForm.get('address')?.setValue('123 Main St');
      component.buildingForm.get('floors')?.setValue(5);
    
      component.onSubmit();
    
      expect(activeModal.close).toHaveBeenCalledWith({
        id: '',  // Include id as an empty string
        address: '123 Main St',
        floors: 5
      });
    });
    
  });

  describe('UI Elements', () => {
    it('should display modal title "Add Building"', () => {
      const title = fixture.nativeElement.querySelector('.modal-title');
      expect(title.textContent).toContain('Add Building');  // Adjust expected value
    });    

    it('should have address input field with validation feedback', () => {
      const addressControl = component.buildingForm.get('address');
      addressControl?.setValue('');
      addressControl?.markAsTouched();
    
      fixture.detectChanges();
    
      const invalidFeedback = fixture.nativeElement.querySelector('.invalid-feedback');
      expect(invalidFeedback).toBeTruthy();
    });
    

    it('should have floors input field with validation feedback', () => {
      const floorsControl = component.buildingForm.get('floors');
      floorsControl?.setValue(0);
      floorsControl?.markAsTouched();
    
      fixture.detectChanges();
    
      const floorsInput = fixture.nativeElement.querySelector('input[formControlName="floors"]');
      expect(floorsInput).toBeTruthy();
    
      const invalidFeedback = fixture.nativeElement.querySelector('.invalid-feedback');
      expect(invalidFeedback).toBeTruthy();
    });
    

    it('should have submit button disabled when form is invalid', () => {
      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBeTrue();
    });

    it('should enable submit button when form is valid', () => {
      component.buildingForm.get('address')?.setValue('123 Main St');
      component.buildingForm.get('floors')?.setValue(5);
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBeFalse();
    });

    it('should show loading spinner when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('.spinner-border');
      expect(spinner).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should trim whitespace from address input on submit', () => {
      component.buildingForm.get('address')?.setValue('  123 Main St  ');
      component.buildingForm.get('floors')?.setValue(5);
    
      component.onSubmit();
    
      expect(activeModal.close).toHaveBeenCalledWith({
        id: '',  // Include id as an empty string
        address: '123 Main St',
        floors: 5
      });
    });
    

    it('should handle rapid form submissions gracefully', () => {
      component.buildingForm.get('address')?.setValue('123 Main St');
      component.buildingForm.get('floors')?.setValue(5);
    
      component.onSubmit();
      component.onSubmit();
      expect(activeModal.close).toHaveBeenCalledTimes(2);
    });
    
  });
});
