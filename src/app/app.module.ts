import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
// Duplicate import removed
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatCheckboxModule } from '@angular/material/checkbox'; 
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticateComponent } from './authentication/authenticate/authenticate.component';
import { LayoutComponent } from './layout/layout-full/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
// Duplicate import removed
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AssignRolesComponent } from './pages/Roles/assign-roles/assign-roles.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { CreateApplicationRequestComponent } from './pages/Applications/create-application-request/create-application-request.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { MyRequestsComponent } from './pages/Applications/my-requests/my-requests.component';
import { RequestDetailsDialogComponent } from './pages/Applications/request-details-dialog/request-details-dialog.component';
import { ApplicationRequestDetailsforAdminComponent } from './pages/application-request-detailsfor-admin/application-request-details.component';
import { AssignTechnicalownerdialogComponent } from './pages/assign-technicalownerdialog/assign-technicalownerdialog.component';

 


@NgModule({
  declarations: [
    AppComponent,
    AuthenticateComponent,
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DashboardComponent,
    
    AssignRolesComponent,
    
    CreateApplicationRequestComponent,
    UserDashboardComponent,
    MyRequestsComponent,
    RequestDetailsDialogComponent,
    ApplicationRequestDetailsforAdminComponent,
    AssignTechnicalownerdialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatCheckboxModule,
    MatRadioModule, 
    MatIconModule, 
    MatButtonModule,
    MatCardModule,
    HttpClientModule,
    FlexLayoutModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ToastrModule.forRoot(),
    LoadingBarModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    MatDialogModule,
    MatListModule,
    MatMenuModule,
    NgxMatSelectSearchModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }