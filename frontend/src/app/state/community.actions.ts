import { createAction, props } from '@ngrx/store';
import { Community } from '../models/community';
import { Building } from '../models/building';

export const loadCommunities = createAction('[Community] Load Communities');
export const loadCommunitiesSuccess = createAction(
  '[Community] Load Communities Success',
  props<{ communities: Community[] }>()
);
export const loadCommunitiesFailure = createAction(
  '[Community] Load Communities Failure',
  props<{ error: any }>()
);

export const loadBuildings = createAction(
  '[Building] Load Buildings',
  props<{ communityId: number }>()
);
export const loadBuildingsSuccess = createAction(
  '[Building] Load Buildings Success',
  props<{ buildings: Building[] }>()
);
export const loadBuildingsFailure = createAction(
  '[Building] Load Buildings Failure',
  props<{ error: any }>()
);