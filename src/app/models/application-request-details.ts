export interface ApplicationRequestDetailsVm {
  request: ApplicationRequest;
  comments: ApplicationRequestComment[];
}

export interface ApplicationRequest {
  id: number;
  applicationName: string;
  applicationType: string;
  justification: string;
  explanation: string;
  requester: string;
  status: string;
  createdDate: string;
  requestDate: string;
  department: string;
  functionName: string;
  locationName: string;
  documents: ApplicationRequestDocument[];
}


export interface ApplicationRequestDocument {
  fileName: string;
  filePath: string;
}

export interface ApplicationRequestComment {
  comment: string;
  createdBy: string;
  createdDate: string;
}
