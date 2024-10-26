import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommunityService } from '../../services/community.service';

@Component({
  selector: 'app-add-community',
  templateUrl: './add-community.component.html',
  styleUrls: ['./add-community.component.scss']
})
export class AddCommunityComponent {
  communityForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private communityService: CommunityService,
    private router: Router
  ) {
    this.communityForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.communityForm.valid) {
      this.communityService.createCommunity(this.communityForm.value)
        .subscribe(() => {
          this.router.navigate(['/communities']);
        });
    }
  }
}

