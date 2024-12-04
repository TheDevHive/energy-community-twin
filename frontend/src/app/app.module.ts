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
import { BuildingsComponent } from './view/BUILDINGS/buildings/buildings.component';
import { AddBuildingComponent } from './view/BUILDINGS/add-building/add-building.component';
import { HeaderComponent } from './view/SHARED/header/header.component';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatLabel } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ConfirmationDialogComponent } from './view/SHARED/confirmation-dialog/confirmation-dialog.component';
import { AlertComponent } from './view/SHARED/alert/alert.component';
import { EnergySimulatorComponent } from './view/energy-simulator/energy-simulator.component';
import { BuildingDetailsComponent } from './view/BUILDINGS/building-details/building-details.component';
import { AddApartmentComponent } from './view/add-apartment/add-apartment.component';
import { AddDeviceComponent } from './view/add-device/add-device.component';
import { DeviceViewComponent } from './view/device-view/device-view.component';
import { ApartmentComponent } from './view/apartment/apartment.component';
import { PieChartComponent } from './view/SHARED/pie-chart/pie-chart.component';
import { EnergyReportsComponent } from './view/SHARED/energy-reports/energy-reports.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AddSimulationComponent } from './view/SHARED/add-simulation/add-simulation.component';
import { RegisterComponent } from './view/register/register.component';
import { ChangePasswordComponent } from './view/change-password/change-password.component';


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
    EnergySimulatorComponent,
    BuildingDetailsComponent,
    AddApartmentComponent,
    AddDeviceComponent,
    DeviceViewComponent,
    ApartmentComponent,
    PieChartComponent,
    ApartmentComponent,
    EnergyReportsComponent,
    AddSimulationComponent,
    RegisterComponent,
    ChangePasswordComponent,
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
    MatDialogModule,
    MatExpansionModule,
    MatOption,
    MatSelect,
    MatLabel,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
