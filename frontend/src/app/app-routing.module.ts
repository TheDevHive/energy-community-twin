import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './view/login/login.component';
import { CommunitiesComponent } from './view/COMMUNITIES/communities/communities.component';
import { AddCommunityComponent } from './view/COMMUNITIES/add-community/add-community.component';
import { BuildingsComponent } from './view/overview-template/buildings.component.ts';
import { AddBuildingComponent } from './view/add-building/add-building.component';

import { AuthGuard } from './guards/auth.guard';
import { LogoutGuard } from './guards/logout.guard';

const routes: Routes = [
  { path: '', redirectTo: '/communities', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LogoutGuard] },
  { path: 'communities', component: CommunitiesComponent, canActivate: [AuthGuard] },
  { path: 'communities/add', component: AddCommunityComponent, canActivate: [AuthGuard] },
  { path: 'communities/:id', component: BuildingsComponent, canActivate: [AuthGuard] },
  { path: 'communities/:id/add', component: AddBuildingComponent, canActivate: [AuthGuard] },
  { path: 'communities/:id/buildings/:buildingId', component: BuildingsComponent, canActivate: [AuthGuard] }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
