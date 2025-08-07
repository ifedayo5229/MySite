import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout-full/layout.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { AuthGuard } from './interceptors/auth.guard';
import { AuthenticateComponent } from './authentication/authenticate/authenticate.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateApplicationRequestComponent } from './pages/Applications/create-application-request/create-application-request.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { MyRequestsComponent } from './pages/Applications/my-requests/my-requests.component';
import { ApplicationRequestDetailsforAdminComponent } from './pages/application-request-detailsfor-admin/application-request-details.component';
import { RequestDetailsDialogComponent } from './pages/Applications/request-details-dialog/request-details-dialog.component';


const routes: Routes = [
  { path: "", component: AuthenticateComponent },
  { path: "forgotPassword", component: ForgotPasswordComponent },
  { path: "resetPassword", component: ResetPasswordComponent },
  {
    path: "home",
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "dashboard", component: DashboardComponent},
      { path: "user-dashboard", component: UserDashboardComponent},
      { path: "create-application-request", component: CreateApplicationRequestComponent},
      { path: "my-requests", component: MyRequestsComponent},
      {path: 'application-request-details', component: ApplicationRequestDetailsforAdminComponent},
      { path: 'request-details-dialog', component: RequestDetailsDialogComponent }

      

    ]
  },
  { path: "**", redirectTo: "/home", pathMatch: "full" },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

