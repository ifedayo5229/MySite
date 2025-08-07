import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { ApplicationVm } from 'src/app/models/applicationrequestdto';
import { ApplicationService } from 'src/app/services/application.service';
import { RequestDetailsDialogComponent } from '../request-details-dialog/request-details-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.scss']
})
export class MyRequestsComponent {
 loading   = true;
  requests: ApplicationVm[] = [];

  constructor(private router: Router,
  
    private appSvc: ApplicationService,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchRequests();
  }

  /** Call the API and populate the grid */
  private fetchRequests(): void {
    this.appSvc.GetMyApplicationRequest()
      .subscribe({

        next: (res: ApiResponseObject<ApplicationVm[]>) => {
          this.requests = res?.responseData ?? [];
          debugger
          console.log(this.requests)
          this.loading  = false;
        },
        error: err => {
          console.error('Failed to fetch requests:', err);
          this.loading = false;
        }
      });
  }

  downloadFiles(request: ApplicationVm) {
  if (!request.documentUrl) {
    alert("No file available for download.");
    return;
  }

  const link = document.createElement('a');
  link.href = request.documentUrl;
  link.download = ''; // Use the filename from backend or infer from URL
  link.click();
  }

 
viewDetails(id: number | string) {
  debugger
  this.router.navigate(['/home/request-details-dialog'], {
    queryParams: { id }
  });
}


editRequest(r: ApplicationVm) {
  console.log('Edit request:', r);
  // open edit modal
}

addComment(r: ApplicationVm) {
  console.log('Add comment to:', r);
  // open comment modal or input
}

  
  

  /** Returns badge‑class based on status value */
  badge(status: string): string {
    return 'badge-' + (status || '').toLowerCase();
  }
}
