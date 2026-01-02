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
    if (this.selectedFilter === 'all') {
      this.filteredApplications = this.applications;
    } else if (this.selectedFilter === 'pending-approval') {
      this.filteredApplications = this.applications.filter(a => 
        a.status === 'Pending Application Team Review'
      );
    } else if (this.selectedFilter === 'in-progress') {
      this.filteredApplications = this.applications.filter(a => 
        a.status === 'Implementation In Progress' || 
        a.status === 'Approved and Ready for Implementation'
      );
    }
  }

  filterApplications(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilter();
    this.createChart();                // redraw bar‑chart if needed
  }

  /* ---------- chart ---------- */
  private createChart(): void {
    this.createStatusLineChart();
    this.createTypePieChart();
  }

  private createStatusLineChart(): void {
    const ctx = (document.getElementById('statusLineChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (this['statusLineChartInstance']) {
      this['statusLineChartInstance'].destroy();
    }

    // Sample data - in real app, this would come from API with historical data
    const statusData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Pending',
          data: [5, 6, 7, 8, 7, this.analytics?.applicationsPendingApproval || 0],
          borderColor: '#ffa000',
          backgroundColor: 'rgba(255, 160, 0, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'In Progress',
          data: [2, 3, 2, 3, 2, this.analytics?.applicationsInProgress || 0],
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Live',
          data: [0, 1, 1, 1, 1, this.analytics?.totalLiveApplications || 0],
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };

    this['statusLineChartInstance'] = new Chart(ctx, {
      type: 'line',
      data: statusData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: { size: 12, weight: 'bold' }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, font: { size: 11 } },
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          x: {
            ticks: { font: { size: 11 } },
            grid: { display: false }
          }
        }
      }
    });
  }

  private createTypePieChart(): void {
    const ctx = (document.getElementById('typePieChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (this['typePieChartInstance']) {
      this['typePieChartInstance'].destroy();
    }

    // Count applications by type
    const typeCounts: { [key: string]: number } = {};
    this.applications.forEach(app => {
      const type = app.applicationType || 'Other';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const labels = Object.keys(typeCounts);
    const data = Object.values(typeCounts);
    const colors = [
      '#1976d2', '#2e7d32', '#ffa000', '#d32f2f', '#7b1fa2',
      '#0288d1', '#388e3c', '#f57c00', '#c2185b', '#5e35b1'
    ];

    this['typePieChartInstance'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: { size: 12, weight: 'bold' },
              generateLabels: (chart) => {
                const data = chart.data;
                if (data.labels && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i];
                    const bgColors = data.datasets[0].backgroundColor as string[];
                    return {
                      text: `${label}: ${value}`,
                      fillStyle: bgColors[i] || '#1976d2',
                      hidden: false,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
              }
            }
          }
        }
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

markAsLiveOrDeployed(id: number, requestType: string): void {
  console.log('📍 Marking as Live/Deployed - ID:', id, 'RequestType:', requestType);
  
  this.applicationService.markAsLiveOrDeployed(id, requestType).subscribe({
    next: () => {
      this.toastr.success('Application marked as live/deployed successfully.');
      this.loadData(); // refresh dashboard data
    },
    error: () => {
      this.toastr.error('Failed to mark application as live/deployed.');
    }
  });
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
    if (!status) return 'secondary';
    
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'live') return 'success';
    if (statusLower.includes('pending')) return 'warning';
    if (statusLower.includes('implementation in progress')) return 'info';
    if (statusLower.includes('approved and ready')) return 'success';
    if (statusLower.includes('rejected')) return 'danger';
    
    return 'secondary';
  }

    getPendingApprovalCount(): number {
    return this.applications.filter(app => 
      app.status === 'Pending Application Team Review'
    ).length;
  }

  getInProgressCount(): number {
    return this.applications.filter(app => 
      app.status === 'Implementation In Progress' || 
      app.status === 'Approved and Ready for Implementation'
    ).length;
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
    console.log('Dialog closed with result:', result);

    if (result) {
      console.log('Calling assignTechnicalOwner with payload:', result);
      this.applicationService.assignTechnicalOwner(result).subscribe({
        
        next: (response) => {
          console.log('Assignment successful:', response);
          this.toastr.success('Technical owner assigned.');
          this.loadData(); // refresh list
        },
        error: (error) => {
          console.error('Assignment failed:', error);
          this.toastr.error('Assignment failed.');
        }
      });
    }
  });
}


}