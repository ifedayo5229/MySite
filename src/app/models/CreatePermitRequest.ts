export interface WorkerVm {
  name: string;
  company: string;
}

export interface HazardControlVm {
  verificationQuestionId: number;
  verificationResponse: boolean;
}

export interface CreatePermitRequest {
  taskDescription: string;
  procedureReferenceNumber: string;
  validFrom: string;
  validTo: string;
  descriptionOfTask: string;
  permitInstructions: string;
  isolatorToApprove: string,
  permitIssuerToApprove: string,
  workersVm: { name: string; company: string }[];
  hazardsAndControlsResponseVm: { verificationQuestionId: number; verificationResponse: boolean }[];
}


