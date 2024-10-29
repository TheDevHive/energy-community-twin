import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './view/login/login.component';
import { CommunitiesComponent } from './view/communities/communities.component';
import { AddCommunityComponent } from './view/add-community/add-community.component';
import { ViewCommunityComponent } from './view/view-community/view-community.component';
import { AddBuildingComponent } from './view/add-building/add-building.component';
import { ViewBuildingComponent } from './view/view-building/view-building.component';

import { AuthGuard } from './guards/auth.guard';
import { LogoutGuard } from './guards/logout.guard';

const routes: Routes = [
  { path: '', redirectTo: '/communities', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LogoutGuard] },
  { path: 'communities', component: CommunitiesComponent, canActivate: [AuthGuard] },
  { path: 'communities/add', component: AddCommunityComponent, canActivate: [AuthGuard] },
  { path: 'buildings/add', component: AddBuildingComponent, canActivate: [AuthGuard] },
  { path: 'communities/:id', component: ViewCommunityComponent, canActivate: [AuthGuard] },
  { path: 'communities/:id/buildings/add', component: AddBuildingComponent, canActivate: [AuthGuard] },
  { path: 'communities/:communityId/buildings/:buildingId', component: ViewBuildingComponent, canActivate: [AuthGuard] }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
