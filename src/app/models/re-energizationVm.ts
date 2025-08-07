export interface ResponseVM {
    reEnergizationQuestionId: number;
    reEnergizationQuestionResponse: boolean;
  
  }
  
  export interface VerificationResponse {
    permitId: number;
    responsesvm: ResponseVM[];
}