import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './view/login/login.component';
import { CommunitiesComponent } from './view/communities/communities.component';
import { AddCommunityComponent } from './view/add-community/add-community.component';

const routes: Routes = [
  { path: '', redirectTo: '/communities', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'communities', component: CommunitiesComponent },
  { path: 'communities/add', component: AddCommunityComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
