import { createReducer, on } from '@ngrx/store';
import { Community } from '../models/community';
import { Building } from '../models/building';
import * as CommunityActions from './community.actions';

export interface CommunityState {
  communities: Community[];
  buildings: Building[];
  loading: boolean;
  error: any;
}

export const initialState: CommunityState = {
  communities: [],
  buildings: [],
  loading: false,
  error: null
};

export const communityReducer = createReducer(
  initialState,
  on(CommunityActions.loadCommunities, state => ({
    ...state,
    loading: true
  })),
  on(CommunityActions.loadCommunitiesSuccess, (state, { communities }) => ({
    ...state,
    communities,
    loading: false
  })),
  on(CommunityActions.loadCommunitiesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);