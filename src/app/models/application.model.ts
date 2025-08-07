export interface devs{
 id : number
 email: string
}

export interface ApplicationRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'submitted' | 'in-progress' | 'pending-approval' | 'approved' | 'rejected' | 'live';
  requestedBy: string;
  requestedByName: string;
  technicalOwner?: string;
  technicalOwnerName?: string;
  responseDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  signOffs: SignOff[];
  metadata: any;
}

export interface GetApplicationRequest {
  id: string; // Id
  requester: string; // Requester
  department: string; // Department
  applicationName: string; // ApplicationName
  controlNumber: string; // ControlNumber
  hodToApprove: string; // HODToApprove
  requestDate: string; // RequestDate (ISO string)
  owner: string; // Owner
  technicalOwner: string; // TechnicalOwner
  startDate: string; // StartDate
  endDate: string; // EndDate
  explanation: string; // Explanation
  justification: string; // Justification
  businessImpact: string; // BusinessImpact
  status: string; // Status (e.g., 'pending', 'approved', etc.)
  pendingWith: string; // PendingWith
  hodApprovalStatus: string; // HODApprovalStatus
  hodApprovalComment: string; // HODApprovalComment
  pendingWithPosition: string; // PendingWithPosition
  hodApprovalDate: string; // HodApprovalDate
  requestType: string; // RequestType
  technicalAssignmentComment: string; // TechnicalAssignmentComment
  signOffStage: string; // SignOffStage
  signOffStatus: string; // SignOffStatus
  signOffRequesterComment: string; // SignOffRequesterComment
  signOffHODComment: string; // SignOffHODComment
  signOffISSecurity_ITInternalControlComment: string; // SignOffISSecurity_ITInternalControlComment
  isSecurity_ITInternalControlToApprove: string; // ISSecurity_ITInternalControlToApprove
  isActive: boolean; // IsActive
  createdDate: string; // CreatedDate
  createdBy: string; // CreatedBy
  modifiedDate: string; // ModifiedDate
  modifiedBy: string; // ModifiedBy
  isDeleted: boolean; // IsDeleted
  applicationType: string; // ApplicationType
  functionId: string; // FunctionId
  locationId: string; // LocationId
  locationName: string; // LocationName
  priority: string; // LocationName
  documents?: { name: string; url: string }[]; // or adjust the structure based on your actual document model

}
export interface GetApplicationRequest {
  id: string; // Id
  requester: string; // Requester
  department: string; // Department
  applicationName: string; // ApplicationName
  controlNumber: string; // ControlNumber
  hodToApprove: string; // HODToApprove
  requestDate: string; // RequestDate (ISO string)
  owner: string; // Owner
  technicalOwner: string; // TechnicalOwner
  startDate: string; // StartDate
  endDate: string; // EndDate
  explanation: string; // Explanation
  justification: string; // Justification
  businessImpact: string; // BusinessImpact
  status: string; // Status (e.g., 'pending', 'approved', etc.)
  pendingWith: string; // PendingWith
  hodApprovalStatus: string; // HODApprovalStatus
  hodApprovalComment: string; // HODApprovalComment
  pendingWithPosition: string; // PendingWithPosition
  hodApprovalDate: string; // HodApprovalDate
  requestType: string; // RequestType
  technicalAssignmentComment: string; // TechnicalAssignmentComment
  signOffStage: string; // SignOffStage
  signOffStatus: string; // SignOffStatus
  signOffRequesterComment: string; // SignOffRequesterComment
  signOffHODComment: string; // SignOffHODComment
  signOffISSecurity_ITInternalControlComment: string; // SignOffISSecurity_ITInternalControlComment
  isSecurity_ITInternalControlToApprove: string; // ISSecurity_ITInternalControlToApprove
  isActive: boolean; // IsActive
  createdDate: string; // CreatedDate
  createdBy: string; // CreatedBy
  modifiedDate: string; // ModifiedDate
  modifiedBy: string; // ModifiedBy
  isDeleted: boolean; // IsDeleted
  applicationType: string; // ApplicationType
  functionId: string; // FunctionId
  locationId: string; // LocationId
  locationName: string; // LocationName
  priority: string; // LocationName

}

export interface Document {
  name: string;
  url: string;
}
export interface Comment {
  id: string;
  text: string;
  author: string;
  authorName: string;
  createdAt: Date;
}

export interface SignOff {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  signedAt?: Date;
}

export interface ChangeRequest {
  id: string;
  applicationId: string;
  applicationTitle: string;
  changeDescription: string;
  reason: string;
  requestedBy: string;
  requestedByName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'submitted' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface Analytics {
  totalLiveApplications: number;
  applicationsInProgress: number;
  applicationsLive: number;
  applicationsPendingApproval: number;
}