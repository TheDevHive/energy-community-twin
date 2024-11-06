import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule to use ngModel
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule for route testing
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router'; // Import Router for route navigation

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        HttpClientModule,
        FormsModule,
        RouterTestingModule.withRoutes([]), // Use RouterTestingModule
      ],
      providers: [AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router); // Inject Router for route manipulation
  });

  it('should show the header outside of the login page', () => {
    // Navigate to a non-login route
    router.navigate(['/some-other-page']).then(() => {
      fixture.detectChanges();
      const headerElement = fixture.nativeElement.querySelector('app-header');
      expect(headerElement).toBeTruthy(); // Header should be present on non-login page
    });
  });

  it('should hide the header on the login page', () => {
    // Navigate to the login page
    router.navigate(['/login']).then(() => {
      fixture.detectChanges();
      const headerElement = fixture.nativeElement.querySelector('app-header');
      expect(headerElement).toBeNull(); // Header should not be present on the login page
    });
  });
});
