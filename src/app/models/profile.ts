export interface Profile {
    firstName: string;
  lastName: string;
  fullname: string;
  email: string;
  position: string;
  phoneNumber: string; // if not provided, keep it optional with ?
  isEmailConfirmed: boolean;
  isSuperAdmin: boolean;
  departmentId: number;
  designationId: number;
  id: string;
  isActive: boolean;
  roleId: number;
  roleName: string;
  designationName: string;
  departmentName: string;
  isManager: boolean;
  managerId: string;
  functionName: string;
  functionId: number;
  locationId: number;
  locationName: string;
  unitId: number;
  unit: string;
  mustChangePassword: boolean;
  employeeId: string;
  // createdDate?: Date; // uncomment if needed
}
