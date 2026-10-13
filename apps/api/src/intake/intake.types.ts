export type IntakeProfile = "company" | "home";

export interface IntakeRequest {
  submissionId: string;
  profile: IntakeProfile;
  name: string;
  email: string;
  city: string;
  state: string;
  distributor: string;
  consumptionKwh?: string;
  billValue?: string;
  objective: string;
  companyName?: string;
  companySize?: string;
  voltageGroup?: string;
  propertyType?: string;
  optInContact: boolean;
  consentDataProcessing: boolean;
}

export interface IntakeGuidance {
  whatWeKnow: string[];
  whatToVerify: string[];
  nextAction: string;
  limits: string;
}

export interface ExternalFetch {
  fetch(input: string, init?: RequestInit): Promise<Response>;
}
