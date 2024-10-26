import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommunityService } from '../../services/community.service';
import { Community } from '../../models/community';

@Component({
  selector: 'app-view-community',
  templateUrl: './view-community.component.html',
  styleUrls: ['./view-community.component.scss']
})
export class ViewCommunityComponent implements OnInit {
  community?: Community;

  constructor(
    private route: ActivatedRoute,
    private communityService: CommunityService
  ) {}

  ngOnInit(): void {
    const communityId = Number(this.route.snapshot.paramMap.get('id'));
    this.communityService.getCommunity(communityId)
      .subscribe(community => {
        this.community = community;
      });
  }
}