import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import {  Analytics, devs, GetApplicationRequest } from '../models/application.model';
import { ApplicationService } from '../services/application.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ApiResponseObject } from '../models/api-response-object';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AssignTechnicalownerdialogComponent } from '../pages/assign-technicalownerdialog/assign-technicalownerdialog.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  [x: string]: any;
  documents?: Document[];

  
  applications: GetApplicationRequest[] = [];
  filteredApplications: GetApplicationRequest[] = [];
  analytics: Analytics | null = null;
  selectedFilter = 'all';
  chart: Chart | null = null;


  
  constructor(
    private dialog: MatDialog,
    private applicationService: ApplicationService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadData();

  }

 goToDetails(id: number | string) {
  this.router.navigate(['/home/application-request-details'], {
    queryParams: { id }
  });
}

  loadData(): void {
    this.applicationService.GetAllApplicationRequest()
      .subscribe({
        next: (resp: ApiResponseObject<GetApplicationRequest[]>) => {
          this.applications = resp.responseData as GetApplicationRequest[];
          this.applyFilter();
          this.fetchAnalytics();
        },
        error: (err: any) => console.error('Error loading applications', err)
      });
  }

  /* ---------- analytics ---------- */
  fetchAnalytics(): void {
    this.applicationService.getAnalytics()
      .subscribe({
        next: (data: Analytics) => {
          this.analytics = data;
          this.createChart();
        },
        error: (err: any) => console.error('Error loading analytics', err)
      });
  }

  /* ---------- filtering ---------- */
  applyFilter(): void {
    this.filteredApplications =
      this.selectedFilter === 'all'
        ? this.applications
        : this.applications.filter(a => a.status === this.selectedFilter);
  }

  filterApplications(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilter();
    this.createChart();                // redraw bar‑chart if needed
  }

  /* ---------- chart ---------- */
  private createChart(): void {
    if (!this.analytics) return;

    const ctx = (document.getElementById('chartCanvas') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    // destroy old instance
    this.chart?.destroy();

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['In Progress', 'Live', 'Pending Approval'],
        datasets: [{
          label: 'Applications',
          data: [
            this.analytics.applicationsInProgress,
            this.analytics.applicationsLive,
            this.analytics.applicationsPendingApproval
          ],
          backgroundColor: ['#FFC107', '#28a745', '#009639'],
          borderColor:    ['#FFC107', '#28a745', '#009639'],
          borderWidth: 2,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }

   

showDetailsModal   = false;
showCommentBox     = false;
selectedApplication: any = null;
newComment = '';

viewApplication(app: any): void {
  this.selectedApplication = app;
  this.showDetailsModal = true;
  this.showCommentBox = false;
  this.newComment = '';
}

closeDetailsModal(): void {
  this.showDetailsModal = false;
  this.selectedApplication = null;
}

toggleComment(): void {
  this.showCommentBox = !this.showCommentBox;
}



requestId!: number; 

submitComment(): void {
  if (!this.newComment.trim()) {
    this.toastr.warning('Comment cannot be empty');
    return;
  }

  const payload = {
    applicationrequestId: this.requestId,
    comment: this.newComment
  };

  this.applicationService.addComment(payload).subscribe({
    next: () => {
      this.toastr.success('Comment submitted');
      this.newComment = '';
      this.showCommentBox = false;
    },
    error: () => this.toastr.error('Failed to submit comment')
  });
}


 getStatusClass(status: string): string {
    switch (status) {
      case 'submitted': return 'primary';
      case 'in-progress': return 'warning';
      case 'pending-approval': return 'secondary';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'live': return 'success';
      default: return 'secondary';
    }
  }

    getPendingApprovalCount(): number {
    return this.filteredApplications.filter(app => app.status === 'pending-approval').length;
  }

  getInProgressCount(): number {
    return this.filteredApplications.filter(app => app.status === 'in-progress').length;
  }
  getFilteredApplications(): GetApplicationRequest[] {
    return this.filteredApplications;
  }

openAssignDialog(appId: number): void {
  const dialogRef = this.dialog.open(AssignTechnicalownerdialogComponent, {
    width: '600px',
    data: {
      appId,
      assignment: {
        applicationId: appId,
        ownerEmail: '',
        comment: '',
        startDate: '',
        endDate: '',
        priority: 'Medium'
      }
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    debugger

    if (result) {
      this.applicationService.assignTechnicalOwner(result).subscribe({
        
        next: () => {
          this.toastr.success('Technical owner assigned.');
          this.loadData(); // refresh list
        },
        error: () => this.toastr.error('Assignment failed.')
      });
    }
  });
}


}