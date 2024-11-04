import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCommunityComponent } from './add-community.component';

describe('AddCommunityComponent', () => {
  let component: AddCommunityComponent;
  let fixture: ComponentFixture<AddCommunityComponent>;
  let activeModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    // Create spy for NgbActiveModal
    const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);

    await TestBed.configureTestingModule({
      declarations: [AddCommunityComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        FormBuilder,
        { provide: NgbActiveModal, useValue: activeModalSpy }
      ]
    }).compileComponents();

    activeModal = TestBed.inject(NgbActiveModal) as jasmine.SpyObj<NgbActiveModal>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize with empty form', () => {
      expect(component.communityForm).toBeDefined();
      expect(component.communityForm.get('name')).toBeDefined();
      expect(component.communityForm.get('name')?.value).toBe('');
    });

    it('should start with form in invalid state', () => {
      expect(component.communityForm.valid).toBeFalse();
    });

    it('should initialize with loading false', () => {
      expect(component.loading).toBeFalse();
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      const nameControl = component.communityForm.get('name');
      expect(nameControl?.valid).toBeFalse();
      expect(nameControl?.errors?.['required']).toBeTruthy();
    });

    it('should be valid with name value', () => {
      const nameControl = component.communityForm.get('name');
      nameControl?.setValue('Test Community');
      expect(nameControl?.valid).toBeTrue();
      expect(nameControl?.errors).toBeNull();
    });

    it('should show validation message when name field is touched and empty', () => {
      const nameControl = component.communityForm.get('name');
      nameControl?.markAsTouched();
      fixture.detectChanges();

      const validationMessage = fixture.nativeElement.querySelector('.invalid-feedback');
      expect(validationMessage).toBeTruthy();
      expect(validationMessage.textContent).toContain('Il nome della comunità è obbligatorio');
    });

    it('should not show validation message when name field is untouched', () => {
      const validationMessage = fixture.nativeElement.querySelector('.invalid-feedback');
      expect(validationMessage).toBeFalsy();
    });
  });

  describe('Form Submission', () => {
    it('should not submit if form is invalid', () => {
      component.onSubmit();
      expect(activeModal.close).not.toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });

    it('should submit when form is valid', () => {
      const nameControl = component.communityForm.get('name');
      nameControl?.setValue('Test Community');
      
      component.onSubmit();
      
      expect(activeModal.close).toHaveBeenCalledWith({
        name: 'Test Community'
      });
    });

    it('should set loading state during submission', fakeAsync(() => {
      const nameControl = component.communityForm.get('name');
      nameControl?.setValue('Test Community');
      
      component.onSubmit();
      
      expect(component.loading).toBeTrue();
      tick();
      
      expect(activeModal.close).toHaveBeenCalled();
    }));
  });

  describe('Modal Interaction', () => {
    it('should close modal on dismiss', () => {
      component.dismiss();
      expect(activeModal.dismiss).toHaveBeenCalled();
    });

    it('should close modal with form value on submit', () => {
      const nameControl = component.communityForm.get('name');
      nameControl?.setValue('Test Community');
      
      component.onSubmit();
      
      expect(activeModal.close).toHaveBeenCalledWith({
        name: 'Test Community'
      });
    });
  });

  describe('UI Elements', () => {
    it('should display modal title', () => {
      const title = fixture.nativeElement.querySelector('.modal-title');
      expect(title.textContent).toContain('Crea Nuova Comunità');
    });

    it('should have name input field', () => {
      const nameInput = fixture.nativeElement.querySelector('input[formControlName="name"]');
      expect(nameInput).toBeTruthy();
    });

    it('should have submit button', () => {
      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton).toBeTruthy();
      expect(submitButton.textContent).toContain('Crea Comunità');
    });

    it('should have cancel button', () => {
      const cancelButton = fixture.nativeElement.querySelector('button[type="button"]');
      expect(cancelButton).toBeTruthy();
      cancelButton.click();
      expect(activeModal.dismiss).toHaveBeenCalled();
    });

    it('should show loading spinner when loading', () => {
      component.loading = true;
      fixture.detectChanges();
      
      const spinner = fixture.nativeElement.querySelector('.spinner-border');
      expect(spinner).toBeTruthy();
    });

    it('should disable submit button when form is invalid', () => {
      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBeTrue();
    });

    it('should enable submit button when form is valid', () => {
      const nameControl = component.communityForm.get('name');
      nameControl?.setValue('Test Community');
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBeFalse();
    });
  });

  describe('Form Control States', () => {
    it('should mark name control as touched on blur', () => {
      const nameInput = fixture.nativeElement.querySelector('input[formControlName="name"]');
      nameInput.dispatchEvent(new Event('blur'));
      
      expect(component.communityForm.get('name')?.touched).toBeTrue();
    });

    it('should update form value on input change', () => {
      const nameInput = fixture.nativeElement.querySelector('input[formControlName="name"]');
      nameInput.value = 'Test Community';
      nameInput.dispatchEvent(new Event('input'));
      
      expect(component.communityForm.get('name')?.value).toBe('Test Community');
    });

    it('should clear validation errors when valid input is provided', () => {
      const nameControl = component.communityForm.get('name');
      nameControl?.markAsTouched();
      fixture.detectChanges();
      
      nameControl?.setValue('Test Community');
      fixture.detectChanges();
      
      const validationMessage = fixture.nativeElement.querySelector('.invalid-feedback');
      expect(validationMessage).toBeFalsy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace-only input as invalid', () => {
      const nameControl = component.communityForm.get('name');
      nameControl?.setValue('   ');
      expect(nameControl?.valid).toBeFalse();
    });

    it('should trim whitespace from valid input', () => {
      const nameControl = component.communityForm.get('name');
      nameControl?.setValue('  Test Community  ');
      
      component.onSubmit();
      
      expect(activeModal.close).toHaveBeenCalledWith({
        name: 'Test Community'
      });
    });

    it('should handle rapid form submissions', fakeAsync(() => {
      const nameControl = component.communityForm.get('name');
      nameControl?.setValue('Test Community');
      
      component.onSubmit();
      component.onSubmit(); // Second submission while first is "processing"
      
      expect(activeModal.close).toHaveBeenCalledTimes(1);
    }));
  });
});