import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment.prod';
import { ApplicationRequestComment, ApplicationRequestDocument } from 'src/app/models/application-request-details';
import { LoginResponseData } from 'src/app/models/login-response-data';
import { ApplicationService } from 'src/app/services/application.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-request-details-dialog',
  templateUrl: './request-details-dialog.component.html',
  styleUrls: ['./request-details-dialog.component.scss']
})
// export class RequestDetailsDialogComponent {
//     constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

// }

export class RequestDetailsDialogComponent  {
   selectedFiles: File[] = [];

  applicationId!: number;
    selectedApplication: any;
    showCommentBox = false;
    newComment = '';
    applicationComments: any[] = [];
    comments: ApplicationRequestComment[] = [];
    showDocuments: boolean = false;
    currentUserEmail: string = ''; // set this when loading the component
     currentUser!: LoginResponseData;
      email: string = '';

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
private authService : AuthService,
    private toastr: ToastrService,
    private token:    TokenService,  ) {}

  ngOnInit(): void {
      this.setCurrentUser(); 

  this.route.queryParams.subscribe(params => {
    this.applicationId = +params['id'];
    this.loadApplicationDetails();
  });
}
  loadApplicationDetails(): void {
  if (!this.applicationId) {
    this.toastr.error('Invalid application ID');
    return;
  }

  this.applicationService.getApplicationRequestById(this.applicationId).subscribe({
    next: (res) => {
      if (res?.requestSuccessful && res.responseData) {
        this.selectedApplication = res.responseData.request;
        this.comments = res.responseData.comments;
      } else {
        this.toastr.error('No application details found');
      }
    },
    error: (err) => {
      console.error('Error loading application details:', err);
      this.toastr.error('Failed to load application details');
    }
  });
}

getFirstName(email: string): string {
  const namePart = email.split('@')[0];
  const firstName = namePart.split('.')[0];
  return firstName.charAt(0).toUpperCase() + firstName.slice(1);
}
onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  this.selectedFiles = input.files ? Array.from(input.files) : [];
}

uploadFiles(): void {
  if (!this.selectedFiles.length || !this.applicationId) return;

  const formData = new FormData();

  this.selectedFiles.forEach(file => {
    formData.append('UploadFiles', file, file.name);
  });

  formData.append('applicationRequestId', this.applicationId.toString());
   debugger
  this.applicationService.uploadDocuments(formData).subscribe({
    next: () => {
      this.toastr.success('Files uploaded successfully.');
      this.selectedFiles = [];
      this.loadApplicationDetails(); // Refresh file list
    },
    error: () => {
      this.toastr.error('File upload failed.');
    }
  });
}

approveApplication(): void {
  if (!this.applicationId) return;

  this.applicationService.approveApplication(this.applicationId).subscribe({
    next: () => {
      this.toastr.success('Application request approved and  ready for implementation.');
      this.loadApplicationDetails(); // refresh application details
    },
    error: () => {
      this.toastr.error('Failed to approve application.');
    }
  });
}

getDocumentUrl(doc: ApplicationRequestDocument): string {
  debugger
  const fileName = doc.filePath.split('\\').pop(); // Just get the filename
  debugger
  return `${environment.docapiUrl}/uploads/${fileName}`;
}
  submitComment(): void {
    if (!this.newComment.trim()) return;
    const payload = { applicationrequestId: this.applicationId, comment: this.newComment };
    this.applicationService.addComment(payload).subscribe(() => {
      this.newComment = '';
      this.showCommentBox = false;
      this.loadApplicationDetails(); // Refresh comments
    });
  }
  private setCurrentUser(): void {
    const info          = this.token.getInfo();
    this.currentUser    = info;
    this.email          = info.profile.email;
    
  }
  }

