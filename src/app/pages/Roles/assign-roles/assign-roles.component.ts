import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleDto } from 'src/app/models/RoleDto';
import { RolesService } from 'src/app/services/roles/roles.service';

@Component({
  selector: 'app-assign-roles',
  templateUrl: './assign-roles.component.html',
  styleUrls: ['./assign-roles.component.scss']
})
export class AssignRolesComponent {
  roles: RoleDto[] = [];
  selectedRoles: number[] = [];
  isLoading: boolean = true;

  constructor(
    private rolesService: RolesService,
    // private userService: UserService,
    public dialogRef: MatDialogRef<AssignRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string, userRoles: RoleDto[] }
  ) {
    this.fetchRoles();
  }

  fetchRoles(): void {
    debugger
    this.rolesService.getRoles().subscribe({
      next: (response) => {
        this.roles = response.map(role => ({
          ...role,
          disabled: this.data.userRoles.some(userRole => userRole.id === role.id)
        })) || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
        this.isLoading = false;
      }
    });
  }

  saveRoles(){
    debugger;
    const selectedRoles = this.selectedRoles
    const userId = this.data.userId;
    console.log('Selected roles:', selectedRoles);

    if(selectedRoles.length === 0){
      console.log('No role(s) selected');
      this.dialogRef.close();
      return;
    }
    
    const roleRequest: any = {
      userId: userId,
      roleIds: selectedRoles,
    };
    debugger
   
      debugger
      // Assign multiple roles
      this.rolesService.assignRolesToUser(roleRequest).subscribe({
        next: (data) => {
          if (data.responseCode === "00") {
            // Handle successful response
            console.log("Roles have been added succesfully");
            // this.notification.sendMessage({
            //   message: 'Roles added successfully',
            //   type: NotificationType.success
            // });
            this.dialogRef.close();
          location.reload();

          } else {
            console.log("Unable to add roles");
            // this.notification.sendMessage({
            //   message: 'Try again',
            //   type: NotificationType.error
            // });
          }
        },
        error: (error: any) => {
          console.log(error.error);
          // Handle error
        //   this.notification.sendMessage({
        //     message: 'Try again',
        //     type: NotificationType.error
        //   });
        }
      });

  }

  cancel(): void {
    console.log('Dialog canceled');
    // Logic to close the dialog
  }
}
