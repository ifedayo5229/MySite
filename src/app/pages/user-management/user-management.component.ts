import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user/user.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import { User } from 'src/app/models/user';
import { RoleDto } from 'src/app/models/RoleDto';
import { ApiResponseObject } from 'src/app/models/api-response-object';
import { AssignRoleDialogComponent } from './assign-role-dialog/assign-role-dialog.component';
import { UserDetailsDialogComponent } from './user-details-dialog/user-details-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  isLoading = false;

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'location', 'function', 'actions'];

  constructor(
    private userService: UserService,
    private rolesService: RolesService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (response: ApiResponseObject<User[]>) => {
        if (response.requestSuccessful) {
          this.users = response.responseData;
          this.filteredUsers = [...this.users];
        } else {
          this.toastr.error(response.message || 'Failed to load users');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.toastr.error('Failed to load users');
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(user =>
      user.firstName?.toLowerCase().includes(term) ||
      user.lastName?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.locationName?.toLowerCase().includes(term) ||
      user.functionName?.toLowerCase().includes(term)
    );
  }

  openUserDetails(user: User): void {
    if (!user) {
      this.toastr.error('Invalid user data');
      return;
    }

    const dialogRef = this.dialog.open(UserDetailsDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      data: { user },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.openAssignRole) {
        this.openAssignRoleDialog(user);
      } else if (result?.roleChanged) {
        this.loadUsers();
      }
    });
  }

  openAssignRoleDialog(user: User): void {
    const dialogRef = this.dialog.open(AssignRoleDialogComponent, {
      width: '600px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.assignRolesToUser(user.id, result);
      }
    });
  }

  deactivateUser(user: User): void {
    if (confirm(`Are you sure you want to deactivate ${user.firstName} ${user.lastName}?`)) {
      // TODO: Implement deactivate user API call
      this.toastr.info('Deactivate user functionality to be implemented');
      console.log('Deactivating user:', user);
    }
  }

  assignRolesToUser(userId: string, roleIds: number[]): void {
    const payload = {
      userId: userId,
      roleIds: roleIds
    };

    console.log('Assigning roles:', payload);

    this.rolesService.assignRolesToUser(payload).subscribe({
      next: (response) => {
        if (response.requestSuccessful) {
          this.toastr.success('Roles assigned successfully');
          this.loadUsers(); // Refresh the user list
        } else {
          this.toastr.error(response.message || 'Failed to assign roles');
        }
      },
      error: (error) => {
        console.error('Error assigning roles:', error);
        this.toastr.error('Failed to assign roles');
      }
    });
  }

  getUserRoles(user: User): string {
    if (!user.roles) return 'No roles assigned';
    if (Array.isArray(user.roles)) {
      return user.roles.length > 0 ? user.roles.map((r: any) => r.roleName || r).join(', ') : 'No roles assigned';
    }
    return user.roles.toString();
  }

  refreshUsers(): void {
    this.loadUsers();
  }
}
