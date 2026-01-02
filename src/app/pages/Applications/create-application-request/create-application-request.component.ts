import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ApplicationService } from 'src/app/services/application.service';
import { SharedService }       from 'src/app/services/shared.service';
import { TokenService }        from 'src/app/services/token/token.service';
import { AuthService }         from 'src/app/services/auth.service';
import { LoginResponseData }   from 'src/app/models/login-response-data';

@Component({
  selector: 'app-create-application-request',
  templateUrl: './create-application-request.component.html',
  styleUrls: ['./create-application-request.component.scss'],
})
export class CreateApplicationRequestComponent implements OnInit {

  showCreateForm = true;

  currentUser!: LoginResponseData;
  email = '';
  locationId = 0;
  functionId = 0;

  categories: any[] = [];

  newRequest = {
    title: '',
    description: '',
    category: '',
    owner: '',
    department: '',
    location: '',
    explanation: '',
    justification: '',
    businessImpact: '',
    uploadedFiles: []
  };

  selectedFiles: File[] = [];
  isSubmitting          = false;

  constructor(
    private appSvc:   ApplicationService,
    private shared:   SharedService,
    private token:    TokenService,
    private toastr:   ToastrService,
    private auth:     AuthService,
    private router:   Router
  ) {}

  ngOnInit(): void {
    this.setCurrentUser();
    this.loadCategories();
  }

  private setCurrentUser(): void {
    const info          = this.token.getInfo();
    this.currentUser    = info;
    this.email          = info.profile.email;
    this.locationId     = info.profile.locationId ?? 0;
    this.functionId     = info.profile.functionId ?? 0;

    console.log('👤 LOGGED-IN USER INFORMATION:');
    console.log('  📧 Email:', this.email);
    console.log('  🏢 Function ID:', this.functionId);
    console.log('  📍 Location ID:', this.locationId);
    console.log('  🔖 Full Name:', info.profile.fullname);
    console.log('  👔 Role:', info.profile.roleName);
    console.log('  🆔 User ID:', info.profile.id);
    console.log('  🏭 Department:', info.profile.functionName);
    console.log('  📍 Location Name:', info.profile.locationName);
    console.log('  🔐 Access Token:', info.accessToken ? info.accessToken.substring(0, 30) + '...' : 'None');
    console.log('  📦 Full Profile Object:', info.profile);

    this.newRequest.owner      = this.email;
    this.newRequest.department = info.profile.functionName;
    this.newRequest.location   = info.profile.locationName ?? '';
  }

  private loadCategories(): void {
    this.shared.getCategories().subscribe({
      next : c => this.categories = c,
      error: () => this.toastr.error('Unable to fetch categories')
    });
  }

  onFileSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    this.selectedFiles = input.files ? Array.from(input.files) : [];
  }

  onSubmit(): void {
  this.createRequest();
}




  async createRequest(): Promise<void> {
  if (this.isSubmitting) return;
  this.isSubmitting = true;

  console.log('📝 CREATING APPLICATION REQUEST');
  console.log('  👤 Current User Email:', this.email);
  console.log('  🏢 Function ID:', this.functionId);
  console.log('  📍 Location ID:', this.locationId);

  const formData = new FormData();
  formData.append('functionId', this.functionId.toString());
  formData.append('applicationType', this.newRequest.category);
  formData.append('applicationName', this.newRequest.title);
  formData.append('locationId', this.locationId.toString());
  formData.append('owner', this.newRequest.owner);
  formData.append('explanation', this.newRequest.explanation);
  formData.append('justification', this.newRequest.justification);
  formData.append('businessImpact', this.newRequest.businessImpact);

  console.log('📋 FormData Contents:');
  console.log('  - functionId:', this.functionId.toString());
  console.log('  - applicationType:', this.newRequest.category);
  console.log('  - applicationName:', this.newRequest.title);
  console.log('  - locationId:', this.locationId.toString());
  console.log('  - owner:', this.newRequest.owner);
  console.log('  - explanation:', this.newRequest.explanation);
  console.log('  - justification:', this.newRequest.justification);
  console.log('  - businessImpact:', this.newRequest.businessImpact);
  console.log('  - Files Count:', this.selectedFiles.length);

  for (const file of this.selectedFiles) {
    formData.append('UploadFiles', file);
    console.log('  📎 File attached:', file.name, '- Size:', file.size, 'bytes');
  }

  try {
    console.log('🚀 Sending request to API...');
    const response = await this.appSvc.createApplicationRequest(formData).toPromise();
    console.log('✅ API Response:', response);
    this.toastr.success('Request created successfully');
    this.resetForm();
    this.showCreateForm = false;
  } catch (err) {
    debugger
    console.error('❌ API Error:', err);
    console.error('❌ Error Details:', JSON.stringify(err, null, 2));
    this.toastr.error('Something went wrong');
  } finally {
    this.isSubmitting = false;
  }
}


  cancel(): void {
    if (!this.isSubmitting) {
      this.resetForm();
      this.showCreateForm = false;
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/signin']);
  }

  private resetForm(): void {
    this.newRequest = {
      title: '', description: '', category: '',
      owner: this.email,
      department: this.newRequest.department,
      location:   this.newRequest.location,
      explanation: '', justification: '', businessImpact: '',
      uploadedFiles: []
    };
    this.selectedFiles = [];
    this.isSubmitting  = false;
    
  }
}
