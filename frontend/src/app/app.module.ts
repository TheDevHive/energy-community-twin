import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommunitiesComponent } from './view/communities/communities.component';
import { ViewCommunityComponent } from './view/view-community/view-community.component';
import { AddCommunityComponent } from './view/add-community/add-community.component';
import { AddBuildingComponent } from './view/add-building/add-building.component';

import { communityReducer } from './state/community.reducer';
import { CommunityEffects } from './state/community.effects';
import { LoginComponent } from './view/login/login.component';
import { ViewBuildingComponent } from './view/view-building/view-building.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CommunitiesComponent,
    ViewCommunityComponent,
    AddCommunityComponent,
    AddBuildingComponent,
    ViewBuildingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot({ community: communityReducer }),
    EffectsModule.forRoot([CommunityEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }