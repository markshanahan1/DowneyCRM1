import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router'
import {HttpClientModule} from '@angular/common/http';
import {AuthGuard} from './guards/auth.guard';
import { CommonModule} from '@angular/common';
import {MaterialModule} from './material.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import 'hammerjs'; 
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

//import { NgxCalenderModule } from './modules/ngxCalender/ngxCalender.module';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// import {TabsTemplateLabelExample} from './app/tabs-template-label-example';
import { DatetimePopupModule } from 'ngx-bootstrap-datetime-popup';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';


import { CanActivate} from '@angular/router';
import {ValidateService} from './services/validate.service';
import {AuthService} from './services/auth.service';
import {FlashMessagesModule} from 'angular2-flash-messages';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { EstimatesComponent } from './components/estimates/estimates.component';

import { RemindersComponent } from './components/reminders/reminders.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { CompanyComponent } from './components/company/company.component';
import { AddCompanyComponent } from './components/company/add-company/add-company.component';
import { ViewCompanyComponent } from './components/company/view-company/view-company.component';
import { SelectEmployeeComponent } from './components/view-company-profile/select-employee/select-employee.component';
import { ViewCompanyProfileComponent } from './components/view-company-profile/view-company-profile.component';
import { ViewEmployeeProfileComponent } from './components/view-employee-profile/view-employee-profile.component';
import { TimesheetComponent } from './components/timesheet/timesheet.component';
import { CalendarModule } from 'angular-calendar';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { UtilsModule } from './components/utils/module';
import { StagesComponent } from './components/stages/stages.component';
import { CreateProjectComponent } from './components/projects/create-project/create-project.component';
import { ViewProjectComponent } from './components/projects/view-project/view-project.component';
import { UpdateProjectComponent } from './components/projects/update-project/update-project.component';
import { ClientsComponent } from './components/clients/clients.component';
import { EmployeeManagementComponent } from './components/employee-management/employee-management.component';
import { SearchPipePipe } from './pipes/search-pipe.pipe';
import { ClientPipe } from './pipes/client.pipe';
import { ViewClientComponent } from './components/clients/view-client/view-client.component';
import { EditClientComponent } from './components/clients/edit-client/edit-client.component';
import { EmployeePipe } from './pipes/employee.pipe';
import { ViewTimesheetComponent } from './components/timesheet/view-timesheet/view-timesheet.component';
import { ViewByDateComponent } from './components/timesheet/view-by-date/view-by-date.component';
import { OrderByPipe } from './pipes/order-by.pipe';


const appRoutes: Routes = [
  {path:'', component:HomeComponent },
  {path:'home', component:HomeComponent},
  {path:'register', component:RegisterComponent },
  {path:'login', component:LoginComponent},
  {path:'profile', component:ProfileComponent},
 
  {path:'stages', component:StagesComponent, canActivate:[AuthGuard]},

  {path:'dashboard', component:DashboardComponent, canActivate:[AuthGuard]},
  {path:'invoice', component:InvoiceComponent, canActivate:[AuthGuard]},
  {path:'company', component:CompanyComponent, canActivate:[AuthGuard]},
  {path:'reminder', component:RemindersComponent, canActivate:[AuthGuard]},
  //{path:'calender', component:DashboardComponent, canActivate:[AuthGuard]},


  {path:'estimates', component:EstimatesComponent, canActivate:[AuthGuard] },
   {path:'view-company-profile', component:ViewCompanyProfileComponent, canActivate:[AuthGuard]},
    {path:'view-employee-profile', component:ViewEmployeeProfileComponent, canActivate:[AuthGuard]},
    {path:'ViewCompany', component:ViewCompanyComponent, canActivate:[AuthGuard]},
  
     {path:'AddCompany', component:AddCompanyComponent, canActivate:[AuthGuard]},
  {path:'timesheets', component:TimesheetComponent, canActivate:[AuthGuard]},
  {path:'calendar', component:CalendarComponent, canActivate:[AuthGuard]},
  {path:'projects', component:ProjectsComponent, canActivate:[AuthGuard]},
  {path:'projects/:id', component:ViewProjectComponent, canActivate:[AuthGuard]},
  {path:'clients', component:ClientsComponent, canActivate:[AuthGuard]},
  {path:'clients/:id', component:ViewClientComponent, canActivate:[AuthGuard]},
  {path:'timesheets/:id', component:ViewTimesheetComponent, canActivate:[AuthGuard]},
  {path:'tsbydate', component:ViewByDateComponent, canActivate:[AuthGuard]},
  {path:'employees-manager', component:EmployeeManagementComponent, canActivate:[AuthGuard]},
  {path:'employees-manager/:id', component:SelectEmployeeComponent, canActivate:[AuthGuard]}
];

@NgModule({
  exports:[ MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule],
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    DashboardComponent,
    HomeComponent,


    InvoiceComponent,
    EstimatesComponent,
   
    RemindersComponent,
    ProjectsComponent,
    SelectEmployeeComponent,
    CompanyComponent,
    AddCompanyComponent,
    ViewCompanyComponent,
    ViewCompanyProfileComponent,
    ConfirmationDialogComponent,
    ViewEmployeeProfileComponent,

    TimesheetComponent,

    CalendarComponent,

    StagesComponent,

    CreateProjectComponent,

    ViewProjectComponent,

    UpdateProjectComponent,

    ClientsComponent,

    EmployeeManagementComponent,

    SearchPipePipe,
    ClientPipe,
    ViewClientComponent,
    EditClientComponent,
    EmployeePipe,
    ViewTimesheetComponent,
    ViewByDateComponent,
    OrderByPipe
  ],
  imports: [
    UtilsModule,
    NgbModalModule.forRoot(),
  
    CalendarModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule.forRoot(),
    MaterialModule,
    MatTooltipModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    
     
  DatetimePopupModule.forRoot()

  ],
  providers: [ValidateService,AuthGuard,AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
