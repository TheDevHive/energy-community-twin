import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './view/login/login.component';
import { CommunitiesComponent } from './view/COMMUNITIES/communities/communities.component';
import { AddCommunityComponent } from './view/COMMUNITIES/add-community/add-community.component';
import { BuildingsComponent } from './view/BUILDINGS/buildings/buildings.component';
import { AddBuildingComponent } from './view/BUILDINGS/add-building/add-building.component';
import { BuildingDetailsComponent } from './view/BUILDINGS/building-details/building-details.component';

import { AuthGuard } from './guards/auth.guard';
import { LogoutGuard } from './guards/logout.guard';
import { DeviceViewComponent } from './view/device-view/device-view.component';
import { ApartmentComponent } from './view/apartment/apartment.component';

const routes: Routes = [
  { path: '', redirectTo: '/communities', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LogoutGuard] },
  { path: 'communities', component: CommunitiesComponent, canActivate: [AuthGuard] },
  { path: 'communities/add', component: AddCommunityComponent, canActivate: [AuthGuard] },
  { path: 'communities/:id', component: BuildingsComponent, canActivate: [AuthGuard] },
  { path: 'communities/:id/add', component: AddBuildingComponent, canActivate: [AuthGuard] },
  { path: 'communities/:id/buildings/:buildingId', component: BuildingsComponent, canActivate: [AuthGuard] },
  { path: 'buildings/:buildingId', component: BuildingDetailsComponent, canActivate: [AuthGuard] },
  { path: 'devices/:id', component: DeviceViewComponent, canActivate: [AuthGuard] },
  { path: 'apartments/:id', component: ApartmentComponent, canActivate: [AuthGuard] }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
