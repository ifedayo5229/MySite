import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApplicationService } from '../../services/application.service';
import { ToastrService } from 'ngx-toastr';
import { ApiResponseObject } from '../../models/api-response-object';
import { devs } from 'src/app/models/application.model';

@Component({
  selector: 'app-assign-technicalownerdialog',
  templateUrl: './assign-technicalownerdialog.component.html',
  styleUrls: ['./assign-technicalownerdialog.component.scss']
})
export class AssignTechnicalownerdialogComponent implements OnInit {

  teamMembers: devs[] = [];

  constructor(
    public dialogRef: MatDialogRef<AssignTechnicalownerdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private applicationService: ApplicationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchTeamMembers();
  }

  fetchTeamMembers(): void {
    this.applicationService.getTeamMembers().subscribe({
      next: (res: ApiResponseObject<devs[]>) => {
        if (res.requestSuccessful) {
          this.teamMembers = res.responseData;
        } else {
          this.toastr.warning(res.message || 'Failed to load team members');
        }
      },
      error: (err) => {
        console.error('Failed to load team members', err);
        this.toastr.error('Could not load team members');
      }
    });
  }

  submit(): void {
    // Format dates to ISO string if they are Date objects
    const payload = {
      applicationId: this.data.appId,
      ownerEmail: this.data.assignment.ownerEmail,
      comment: this.data.assignment.comment,
      startDate: this.data.assignment.startDate instanceof Date 
        ? this.data.assignment.startDate.toISOString() 
        : this.data.assignment.startDate,
      endDate: this.data.assignment.endDate instanceof Date 
        ? this.data.assignment.endDate.toISOString() 
        : this.data.assignment.endDate,
      priority: this.data.assignment.priority
    };
    
    console.log('Submitting payload:', payload);
    this.dialogRef.close(payload);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
