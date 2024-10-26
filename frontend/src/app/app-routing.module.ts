import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './view/dashboard/dashboard.component';
import { LoginComponent } from './view/login/login.component';
import { CommunitiesComponent } from './view/communities/communities.component';
import { AddCommunityComponent } from './view/add-community/add-community.component';
import { ViewCommunityComponent } from './view/view-community/view-community.component';
import { BuildingsComponent } from './view/buildings/buildings.component'; 
import { AddBuildingComponent } from './view/add-building/add-building.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  //{ path: '', component: DashboardComponent },
  { path: '', redirectTo: '/communities', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'communities', component: CommunitiesComponent },
  { path: 'communities/add', component: AddCommunityComponent },
  { path: 'communities/:id', component: ViewCommunityComponent },
  { path: 'communities/:id/buildings', component: BuildingsComponent },
  { path: 'communities/:communityId/buildings/add', component: AddBuildingComponent },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
