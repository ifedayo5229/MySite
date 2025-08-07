export interface RequestResponse{
  locationId: number;
  functionId: number;
  applicationType: string;
  applicationName: string;
  owner: string;
  explanation: string;
  justification: string;
  businessImpact: string;
  uploadFiles: string[];
}