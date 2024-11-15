import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './view/login/login.component';
import { CommunitiesComponent } from './view/communities/communities.component';
import { AddCommunityComponent } from './view/add-community/add-community.component';
import { OverviewTemplateComponent } from './view/overview-template/overview-template.component';
import { AddBuildingComponent } from './view/add-building/add-building.component';

import { AuthGuard } from './guards/auth.guard';
import { LogoutGuard } from './guards/logout.guard';

const routes: Routes = [
  { path: '', redirectTo: '/communities', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LogoutGuard] },
  { path: 'communities', component: CommunitiesComponent, canActivate: [AuthGuard] },
  { path: 'communities/add', component: AddCommunityComponent, canActivate: [AuthGuard] },
  { path: 'communities/:id', component: OverviewTemplateComponent, canActivate: [AuthGuard] },
  { path: 'communities/:id/add', component: AddBuildingComponent, canActivate: [AuthGuard] },
  { path: 'communities/:id/buildings/:buildingId', component: OverviewTemplateComponent, canActivate: [AuthGuard] }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
