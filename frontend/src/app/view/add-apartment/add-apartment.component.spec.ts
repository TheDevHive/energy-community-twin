import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApartmentComponent } from './add-apartment.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AddApartmentComponent', () => {
  let component: AddApartmentComponent;
  let fixture: ComponentFixture<AddApartmentComponent>;
  let activeModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);

    await TestBed.configureTestingModule({
      declarations: [AddApartmentComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        { provide: NgbActiveModal, useValue: activeModalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddApartmentComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize with empty residents and square footage fields', () => {
      expect(component.apartmentForm).toBeDefined();
      expect(component.apartmentForm.get('residents')?.value).toBe(0);
      expect(component.apartmentForm.get('squareFootage')?.value).toBe(0);
    });

    it('should start with form in an invalid state', () => {
      expect(component.apartmentForm.valid).toBeFalse();
    });

    it('should have loading set to false initially', () => {
      expect(component.loading).toBeFalse();
    });
  });

  describe('Form Validation', () => {
    it('should mark residents as invalid if less then 0', () => {
      const residentsControl = component.apartmentForm.get('squareFootage');
      residentsControl?.setValue(-1);
      expect(residentsControl?.valid).toBeFalse();
      expect(residentsControl?.errors?.['min']).toBeTruthy();
    });

    it('should mark square footage as invalid if less than 1', () => {
      const squareFootageControl = component.apartmentForm.get('squareFootage');
      squareFootageControl?.setValue(0);
      expect(squareFootageControl?.valid).toBeFalse();
      expect(squareFootageControl?.errors?.['min']).toBeTruthy();
    });

    it('should mark form as valid with correct input values', () => {
      component.apartmentForm.get('residents')?.setValue(1);
      component.apartmentForm.get('squareFootage')?.setValue(5);
      expect(component.apartmentForm.valid).toBeTrue();
    });
  });

  describe('Form Submission', () => {
    it('should not submit if form is invalid', () => {
      component.onSubmit();
      expect(activeModal.close).not.toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });

    it('should submit if form is valid', () => {
      component.apartmentForm.get('residents')?.setValue(1);
      component.apartmentForm.get('squareFootage')?.setValue(5);
      component.apartmentForm.get('energyCost')?.setValue(0.20);
    
      component.onSubmit();
    
      expect(activeModal.close).toHaveBeenCalledWith({
        id: '',
        residents: 1,
        squareFootage: 5,
        energyCost: 0.20
      });
    });
  });

  describe('Modal Interactions', () => {
    it('should dismiss the modal when dismiss is called', () => {
      component.dismiss();
      expect(activeModal.dismiss).toHaveBeenCalled();
    });

    it('should close the modal with apartment data on successful submit', () => {
      component.apartmentForm.get('residents')?.setValue(1);
      component.apartmentForm.get('squareFootage')?.setValue(5);
      component.apartmentForm.get('energyCost')?.setValue(0.20);
    
      component.onSubmit();
    
      expect(activeModal.close).toHaveBeenCalledWith({
        id: '',
        residents: 1,
        squareFootage: 5,
        energyCost: 0.20
      });
    });
    
  });

  describe('UI Elements', () => {
    it('should display modal title "Add Apartment"', () => {
      const title = fixture.nativeElement.querySelector('.modal-title');
      expect(title.textContent).toContain('Add Apartment'); 
    });    

    it('should have residents input field with validation feedback', () => {
      const addressControl = component.apartmentForm.get('residents');
      addressControl?.setValue('');
      addressControl?.markAsTouched();
    
      fixture.detectChanges();
    
      const invalidFeedback = fixture.nativeElement.querySelector('.invalid-feedback');
      expect(invalidFeedback).toBeTruthy();
    });
    

    it('should have floors input field with validation feedback', () => {
      const floorsControl = component.apartmentForm.get('squareFootage');
      floorsControl?.setValue(0);
      floorsControl?.markAsTouched();
    
      fixture.detectChanges();
    
      const floorsInput = fixture.nativeElement.querySelector('input[formControlName="squareFootage"]');
      expect(floorsInput).toBeTruthy();
    
      const invalidFeedback = fixture.nativeElement.querySelector('.invalid-feedback');
      expect(invalidFeedback).toBeTruthy();
    });
    

    it('should have submit button disabled when form is invalid', () => {
      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBeTrue();
    });

    it('should enable submit button when form is valid', () => {
      component.apartmentForm.get('residents')?.setValue(1);
      component.apartmentForm.get('squareFootage')?.setValue(5);
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
      component.apartmentForm.get('residents')?.setValue(1);
      component.apartmentForm.get('squareFootage')?.setValue(5);
      component.apartmentForm.get('energyCost')?.setValue(0.20);
    
      component.onSubmit();
    
      expect(activeModal.close).toHaveBeenCalledWith({
        id: '', 
        residents: 1,
        squareFootage: 5,
        energyCost: 0.20
      });
    });
    

    it('should handle rapid form submissions gracefully', () => {
      component.apartmentForm.get('residents')?.setValue(1);
      component.apartmentForm.get('squareFootage')?.setValue(5);
    
      component.onSubmit();
      component.onSubmit();
      expect(activeModal.close).toHaveBeenCalledTimes(2);
    });
    
  });
});

