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
    console.log('🔍 Current User Object:', this.currentUser);
    console.log('📧 User Email:', this.currentUser?.email);
    
    // Load user's applications using GetMyApplicationRequest
    this.applicationService.GetMyApplicationRequest().subscribe({
      next: (response) => {
        console.log('📥 API Response:', response);
        console.log('📦 Response Data:', response?.responseData);
        
        // Try multiple possible response structures
        const data = response?.responseData || response?.data;
        
        if (data && Array.isArray(data)) {
          this.myRequests = data as any[];
          console.log('✅ User applications loaded:', this.myRequests.length, 'items');
          console.log('📋 Applications with statuses:', this.myRequests.map(app => ({ 
            title: (app as any).applicationName || app.title, 
            status: app.status 
          })));
          
          // Log counts for each status
          console.log('📊 Status Counts:');
          console.log('  Pending Review:', this.countPendingReview());
          console.log('  Approved:', this.countApproved());
          console.log('  In Progress:', this.countInProgress());
          console.log('  Live:', this.countLive());
        } else {
          console.warn('⚠️ No data found in response or data is not an array');
          this.myRequests = [];
        }
      },
      error: (error) => {
        console.error('❌ Error loading user applications:', error);
        this.myRequests = [];
      }
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
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('pending')) return 'warning';
    if (statusLower.includes('approved')) return 'success';
    if (statusLower.includes('progress')) return 'primary';
    if (statusLower.includes('live')) return 'success';
    
    switch (statusLower) {
      case 'submitted': return 'primary';
      case 'in-progress': return 'warning';
      case 'pending-approval': return 'secondary';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'live': return 'success';
      default: return 'secondary';
    }
  }

  navigateToMyRequests(applicationId: string): void {
    // Navigate to my-requests page with the application ID as query parameter
    this.router.navigate(['/home/my-requests'], { 
      queryParams: { highlight: applicationId },
      queryParamsHandling: 'merge'
    });
  }

  // Helper methods to get app properties safely
  getAppName(app: any): string {
    return app.applicationName || app.title || '';
  }

  getAppDescription(app: any): string {
    return app.explanation || app.description || '';
  }

  getAppRequestType(app: any): string {
    return app.requestType || app.category || '';
  }

  getAppDepartment(app: any): string {
    return app.department || '';
  }

  getAppDate(app: any): Date | string {
    return app.requestDate || app.createdAt || new Date();
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

  // Status count methods
  countPendingReview(): number {
    return this.myRequests.filter(app => (app.status as any) === 'Pending Application Team Review').length;
  }

  countApproved(): number {
    return this.myRequests.filter(app => (app.status as any) === 'Approved and Ready for Implementation').length;
  }

  countInProgress(): number {
    return this.myRequests.filter(app => (app.status as any) === 'Implementation In Progress').length;
  }

  countLive(): number {
    return this.myRequests.filter(app => (app.status as any) === 'Live').length;
  }

  // Filter methods to get requests by status
  getPendingReviewRequests(): ApplicationRequest[] {
    return this.myRequests.filter(app => (app.status as any) === 'Pending Application Team Review');
  }

  getApprovedRequests(): ApplicationRequest[] {
    return this.myRequests.filter(app => (app.status as any) === 'Approved and Ready for Implementation');
  }

  getInProgressRequests(): ApplicationRequest[] {
    return this.myRequests.filter(app => (app.status as any) === 'Implementation In Progress');
  }

  getLiveRequests(): ApplicationRequest[] {
    return this.myRequests.filter(app => (app.status as any) === 'Live');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
