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
    this.locationId     = info.profile.locationId;
    this.functionId     = info.profile.functionId;

    this.newRequest.owner      = this.email;
    this.newRequest.department = info.profile.functionName;
    this.newRequest.location   = info.profile.locationName;
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

  const formData = new FormData();
  formData.append('functionId', this.functionId.toString());
  formData.append('applicationType', this.newRequest.category);
  formData.append('applicationName', this.newRequest.title);
  formData.append('locationId', this.locationId.toString());
  formData.append('owner', this.newRequest.owner);
  formData.append('explanation', this.newRequest.explanation);
  formData.append('justification', this.newRequest.justification);
  formData.append('businessImpact', this.newRequest.businessImpact);

  for (const file of this.selectedFiles) {
    formData.append('UploadFiles', file);
  }

  try {
    await this.appSvc.createApplicationRequest(formData).toPromise();
    this.toastr.success('Request created successfully');
    this.resetForm();
    this.showCreateForm = false;
  } catch (err) {
    debugger
    console.error(err);
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
