import { Component } from '@angular/core';
import { ApplicationRequest } from '../models/application.model';
import { ApplicationService } from '../services/application.service';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent {
currentUser = this.authService.getCurrentUser();
  activeTab = 'my-requests';
  showCreateForm = false;
  loading = false;
  
  myRequests: ApplicationRequest[] = [];
  pendingApprovals: ApplicationRequest[] = [];
  allApplications: ApplicationRequest[] = [];
  
  categories: any[] = [];
  departments: any[] = [];
  locations: any[] = [];
  
  newRequest: any = {
    title: '',
    description: '',
    category: '',
    department: '',
    location: '',
    priority: 'medium'
  };

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private sharedService: SharedService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadDropdownData();
  }
selectedFiles: File[] = [];

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    this.selectedFiles = Array.from(input.files);
    console.log('Files selected:', this.selectedFiles);
  }
}
  private loadData(): void {
    const userId = this.currentUser?.id;
    if (!userId) return;

    // Load user's applications
    this.applicationService.getUserApplications(userId).subscribe(apps => {
      this.myRequests = apps;
    });

    // Load pending approvals
    this.applicationService.getPendingApprovals(userId).subscribe(apps => {
      this.pendingApprovals = apps;
    });

    // Load all applications for change requests
    this.applicationService.getApplications().subscribe(apps => {
      // Filter out current user's applications
      this.allApplications = apps.filter(app => app.requestedBy !== userId);
    });
  }

  private loadDropdownData(): void {
    this.sharedService.getCategories().subscribe(cats => this.categories = cats);
    this.sharedService.getDepartments().subscribe(depts => this.departments = depts);
    this.sharedService.getLocations().subscribe(locs => this.locations = locs);
  }

  createRequest(): void {
    if (!this.currentUser) return;

    this.loading = true;
    const request = {
      ...this.newRequest,
      requestedBy: this.currentUser.id,
      requestedByName: `${this.currentUser.firstName} ${this.currentUser.lastName}`
    };

    this.applicationService.createApplication(request).subscribe({
      next: (app) => {
        this.loading = false;
        this.showCreateForm = false;
        this.resetForm();
        this.loadData(); // Refresh data
      },
      error: (error) => {
        this.loading = false;
        console.error('Error creating request:', error);
      }
    });
  }

  private resetForm(): void {
    this.newRequest = {
      title: '',
      description: '',
      category: '',
      department: '',
      location: '',
      priority: 'medium'
    };
  }

  closeModal(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.showCreateForm = false;
    }
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

  viewApplication(id: string): void {
    this.router.navigate(['/user/applications', id]);
  }

  initiateSignOff(id: string): void {
    // This would open a modal to select users for sign-off
    console.log('Initiate sign-off for application:', id);
  }

  addComment(id: string): void {
    // This would open a modal to add comment
    console.log('Add comment to application:', id);
  }

  approveRequest(id: string): void {
    // This would open a modal to add approval comment and approve
    console.log('Approve request:', id);
  }

  rejectRequest(id: string): void {
    // This would open a modal to add rejection comment and reject
    console.log('Reject request:', id);
  }

  requestChange(applicationId: string, applicationTitle: string): void {
    // This would open a modal to create change request
    console.log('Request change for application:', applicationId, applicationTitle);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
