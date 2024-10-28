import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommunitiesComponent } from './view/communities/communities.component';
import { AddCommunityComponent } from './view/add-community/add-community.component';

import { LoginComponent } from './view/login/login.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChunkPipe } from './pipes/chunk.pipe';
import { ErrorModalComponent } from './view/error-modal/error-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CommunitiesComponent,
    AddCommunityComponent,
    ChunkPipe,
    ErrorModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }