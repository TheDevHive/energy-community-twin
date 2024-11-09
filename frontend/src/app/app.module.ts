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
import { OverviewTemplateComponent } from './view/overview-template/overview-template.component';
import { OverviewCardComponent } from './view/overview-card/overview-card.component';
import { AddBuildingComponent } from './view/add-building/add-building.component';
import { CommunitySummaryComponent } from './view/community-summary/community-summary.component';
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
    OverviewTemplateComponent,
    OverviewCardComponent,
    AddBuildingComponent,
    CommunitySummaryComponent,
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