export interface ApplicationVm {
  id: number; // ✅ use this instead of `id`
  documentUrl: any;
  type:          string; // "Application"
  justification: string;
  locationName:  string;
  functionName:  string; // Department
  explanation:   string;
  status:        string;
  requester:     string;
  applicationName: string;
  requestDate:   string;
  applicationType: string; // Category  
}