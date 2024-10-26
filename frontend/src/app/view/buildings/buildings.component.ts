import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Building } from '../../models/building';
import { CommunityService } from '../../services/community.service';
import { loadBuildings } from '../../state/community.actions';

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html'
})
export class BuildingsComponent implements OnInit {
  buildings$: Observable<Building[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  communityId: number;

  constructor(
    private route: ActivatedRoute,
    private store: Store<any>
  ) {
    this.communityId = Number(this.route.snapshot.paramMap.get('id'));
    this.buildings$ = this.store.select(state => state.community.buildings);
    this.loading$ = this.store.select(state => state.community.loading);
    this.error$ = this.store.select(state => state.community.error);
  }

  ngOnInit(): void {
    this.store.dispatch(loadBuildings({ communityId: this.communityId }));
  }
}

