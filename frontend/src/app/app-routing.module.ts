import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './view/login/login.component';
import { CommunitiesComponent } from './view/communities/communities.component';
import { AddCommunityComponent } from './view/add-community/add-community.component';
import { ViewCommunityComponent } from './view/view-community/view-community.component';
import { AddBuildingComponent } from './view/add-building/add-building.component';
import { ViewBuildingComponent } from './view/view-building/view-building.component';

const routes: Routes = [
  { path: '', redirectTo: '/communities', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'communities', component: CommunitiesComponent },
  { path: 'communities/add', component: AddCommunityComponent },
  { path: 'buildings/add', component: AddBuildingComponent },
  { path: 'communities/:id', component: ViewCommunityComponent },
  { path: 'communities/:id/buildings/add', component: AddBuildingComponent },
  { path: 'communities/:communityId/buildings/:buildingId', component: ViewBuildingComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
