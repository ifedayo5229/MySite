import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from '../../../services/application.service';

interface LiveApplication {
  requestId: number;
  applicationName: string;
  applicationOwner: string;
  technicalOwner: string;
  department: string;
  dateWentLive: string;
  explanation: string;
  status: string;
  id: number;
  isActive: boolean;
  createdDate: string;
  createdBy: string;
  isDeleted: boolean;
  users?: ApplicationUser[];
  showUsers?: boolean;
}

interface ApplicationUser {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
}

@Component({
  selector: 'app-live-applications',
  templateUrl: './live-applications.component.html',
  styleUrls: ['./live-applications.component.scss']
})
export class LiveApplicationsComponent implements OnInit {
  liveApplications: LiveApplication[] = [];
  loading = false;
  searchQuery = '';
  selectedDepartment = '';
  departments: string[] = [];

  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLiveApplications();
  }

  loadLiveApplications(): void {
    this.loading = true;
    this.applicationService.GetApplications().subscribe({
      next: (response) => {
        console.log('Live Applications Response:', response);
        if (response.requestSuccessful && response.responseData) {
          this.liveApplications = response.responseData.map((app: any) => ({
            ...app,
            showUsers: false,
            users: this.generateDummyUsers(app.id)
          }));
          this.extractDepartments();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading live applications:', error);
        this.loading = false;
      }
    });
  }

  extractDepartments(): void {
    const deptSet = new Set(this.liveApplications.map(app => app.department));
    this.departments = Array.from(deptSet).sort();
  }

  generateDummyUsers(appId: number): ApplicationUser[] {
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@company.com',
        role: 'Administrator',
        isActive: true,
        lastLogin: '2026-01-01T10:30:00'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        role: 'User',
        isActive: true,
        lastLogin: '2026-01-02T09:15:00'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        role: 'User',
        isActive: false,
        lastLogin: '2025-12-28T14:20:00'
      },
      {
        id: 4,
        name: 'Sarah Williams',
        email: 'sarah.williams@company.com',
        role: 'Viewer',
        isActive: true,
        lastLogin: '2026-01-02T11:45:00'
      }
    ];
  }

  getFilteredApplications(): LiveApplication[] {
    return this.liveApplications.filter(app => {
      const matchesSearch = !this.searchQuery || 
        app.applicationName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        app.applicationOwner.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        app.technicalOwner.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesDepartment = !this.selectedDepartment || 
        app.department === this.selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    });
  }

  toggleUsers(app: LiveApplication): void {
    app.showUsers = !app.showUsers;
  }

  toggleUserStatus(app: LiveApplication, user: ApplicationUser): void {
    user.isActive = !user.isActive;
    console.log(`User ${user.name} status changed to ${user.isActive ? 'Active' : 'Inactive'}`);
    // Here you would typically call an API to update the user status
  }

  raiseChangeRequest(app: LiveApplication): void {
    console.log('Raising change request for application:', app);
    // Navigate to create change request page or open a dialog
    this.router.navigate(['/home/create-application-request'], { 
      queryParams: { applicationId: app.id, type: 'change' } 
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedDepartment = '';
  }
}
