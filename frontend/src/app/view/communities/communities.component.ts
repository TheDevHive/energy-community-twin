import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../../services/community.service';
import { Community } from '../../models/community';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.css']
})
export class CommunitiesComponent implements OnInit {
  communities: Community[] = [];

  constructor(private communityService: CommunityService) {}

  ngOnInit(): void {
    this.loadCommunities();
  }

  private loadCommunities(): void {
    this.communityService.getCommunities()
      .subscribe(communities => {
        this.communities = communities;
      });
  }
}