export interface Profile {
  firstName: string;
  lastName: string;
  fullname: string;
  email: string;
  lineManager?: string;
  headOfUnit?: string;
  headOfFunction?: string;
  phoneNumber: string;
  isEmailConfirmed: boolean;
  isSuperAdmin: boolean;
  departmentId: number;
  designationId: number;
  functionName: string;
  id: string;
  isActive: boolean;
  roleId: number;
  roleName: string;
  departmentName: string;
  position: string;
  designationName: string;
  isManager: boolean;
  managerId: string;
  mustChangePassword: boolean;
  locationId?: number;
  locationName?: string;
  functionId?: number;
}

