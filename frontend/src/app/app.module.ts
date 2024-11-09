import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommunitiesComponent } from './view/COMMUNITIES/communities/communities.component';
import { AddCommunityComponent } from './view/COMMUNITIES/add-community/add-community.component';

import { LoginComponent } from './view/login/login.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChunkPipe } from './pipes/chunk.pipe';
import { ErrorModalComponent } from './view/SHARED/error-modal/error-modal.component';
import { BuildingsComponent } from './view/BUILDINGS/buildings/buildings.component.ts';
import { AddBuildingComponent } from './view/BUILDINGS/add-building/add-building.component';
import { HeaderComponent } from './view/SHARED/header/header.component';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './view/SHARED/confirmation-dialog/confirmation-dialog.component';
import { AlertComponent } from './view/SHARED/alert/alert.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CommunitiesComponent,
    AddCommunityComponent,
    ChunkPipe,
    ErrorModalComponent,
    BuildingsComponent,
    AddBuildingComponent,
    HeaderComponent,
    ConfirmationDialogComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }