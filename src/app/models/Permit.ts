export interface Permit {
    id: number; 
    requesterEmail: string;
    procedureReferenceNumber: string;
    validFrom: Date;
    validTo: Date;
    permitNumber: string;
    descriptionOfTask: string;
    permitInstructions: string;
    pendingWith: string;
    pendingWithPosition: string;
    isolatorToApprove: string;
    isolatorComment: string;
    permitIssuerToApprove: string;
    permitIssuerComment: string;
    permitIssuerApprovalDate: Date;
    issuerClosureComment: string;
    taskCompletionStatus: string;
    isActive: boolean;
    createdDate: Date;
    createdBy: string;
    isDeleted: boolean;
    status: string;
  }