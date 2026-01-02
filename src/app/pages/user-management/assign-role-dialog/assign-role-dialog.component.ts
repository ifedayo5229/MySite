import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RolesService } from 'src/app/services/roles/roles.service';
import { RoleDto } from 'src/app/models/RoleDto';
import { User } from 'src/app/models/user';
import { ApiResponseObject } from 'src/app/models/api-response-object';

@Component({
  selector: 'app-assign-role-dialog',
  templateUrl: './assign-role-dialog.component.html',
  styleUrls: ['./assign-role-dialog.component.scss']
})
export class AssignRoleDialogComponent implements OnInit {
  allRoles: RoleDto[] = [];
  selectedRoleIds: number[] = [];
  userCurrentRoles: RoleDto[] = [];
  isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<AssignRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private rolesService: RolesService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadUserRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    this.rolesService.getRoles().subscribe({
      next: (roles: RoleDto[]) => {
        this.allRoles = roles;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.toastr.error('Failed to load roles');
        this.isLoading = false;
      }
    });
  }

  loadUserRoles(): void {
    this.rolesService.getRolesForUser(this.data.user.id).subscribe({
      next: (response: ApiResponseObject<RoleDto[]>) => {
        if (response.requestSuccessful) {
          this.userCurrentRoles = response.responseData;
          this.selectedRoleIds = this.userCurrentRoles.map(r => r.id);
        }
      },
      error: (error) => {
        console.error('Error loading user roles:', error);
      }
    });
  }

  toggleRole(roleId: number): void {
    const index = this.selectedRoleIds.indexOf(roleId);
    if (index > -1) {
      this.selectedRoleIds.splice(index, 1);
    } else {
      this.selectedRoleIds.push(roleId);
    }
  }

  isRoleSelected(roleId: number): boolean {
    return this.selectedRoleIds.includes(roleId);
  }

  submit(): void {
    if (this.selectedRoleIds.length === 0) {
      this.toastr.warning('Please select at least one role');
      return;
    }
    this.dialogRef.close(this.selectedRoleIds);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
