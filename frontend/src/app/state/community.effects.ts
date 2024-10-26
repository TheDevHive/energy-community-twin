import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { CommunityService } from '../services/community.service';
import * as CommunityActions from './community.actions';

@Injectable()
export class CommunityEffects {
  loadCommunities$ = createEffect(() => this.actions$.pipe(
    ofType(CommunityActions.loadCommunities),
    mergeMap(() => this.communityService.getCommunities()
      .pipe(
        map(communities => CommunityActions.loadCommunitiesSuccess({ communities })),
        catchError(error => of(CommunityActions.loadCommunitiesFailure({ error })))
      ))
  ));

  constructor(
    private actions$: Actions,
    private communityService: CommunityService
  ) {}
}