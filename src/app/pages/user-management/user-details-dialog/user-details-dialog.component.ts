import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { RolesService } from 'src/app/services/roles/roles.service';
import { RoleDto } from 'src/app/models/RoleDto';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-details-dialog',
  templateUrl: './user-details-dialog.component.html',
  styleUrls: ['./user-details-dialog.component.scss']
})
export class UserDetailsDialogComponent implements OnInit {
  userRoles: RoleDto[] = [];
  isLoadingRoles = false;

  constructor(
    public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private rolesService: RolesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.data?.user?.id) {
      this.loadUserRoles();
    }
  }

  loadUserRoles(): void {
    if (!this.data?.user?.id) {
      this.isLoadingRoles = false;
      return;
    }

    this.isLoadingRoles = true;
    
    this.rolesService.getRolesForUser(this.data.user.id).subscribe({
      next: (response: ApiResponseObject<RoleDto[]>) => {
        if (response.requestSuccessful) {
          this.userRoles = response.responseData || [];
        }
        this.isLoadingRoles = false;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.isLoadingRoles = false;
      }
    });
  }

  removeRole(role: RoleDto): void {
    if (confirm(`Are you sure you want to remove the role "${role.roleName}" from ${this.data.user.firstName} ${this.data.user.lastName}?`)) {
      const payload = {
        userId: this.data.user.id,
        id: role.id
      };
      
      this.rolesService.removeRoleFromUser(payload).subscribe({
        next: (response) => {
          if (response.requestSuccessful) {
            this.snackBar.open('Role removed successfully', 'Close', { duration: 3000 });
            this.loadUserRoles();
            this.dialogRef.close({ roleChanged: true });
          } else {
            this.snackBar.open('Failed to remove role', 'Close', { duration: 3000 });
          }
        },
        error: () => {
          this.snackBar.open('Error removing role', 'Close', { duration: 3000 });
        }
      });
    }
  }

  assignRoles(): void {
    // Close this dialog and signal to open assign role dialog
    this.dialogRef.close({ openAssignRole: true });
  }

  close(): void {
    this.dialogRef.close();
  }
}
