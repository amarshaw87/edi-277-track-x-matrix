export interface EdiStatus {
  category: string; // e.g., "A1"
  status: string;   // e.g., "20"
  actor: string;    // e.g., "PR"
  description: string; // Plain English translation
}

export interface ProcedureLine {
  id: string;
  procedureCode: string;
  chargeAmount: number;
  status: EdiStatus;
}

export interface ClaimCard {
  id: string;         // Unique Hash ID (Scenario 13)
  traceId: string;    // TRN/REF Marker (Scenario 10)
  payerName: string;  // Insurance Name
  providerId: string; // Doctor/Facility ID
  patientName: string;
  patientDob: string;
  timestamp: string;  // Dynamic unified date (Scenario 07)
  globalStatus: EdiStatus;
  procedures: ProcedureLine[]; // Multi-procedure stack (Scenario 09)
  lane: 'accepted' | 'pended' | 'rejected'; // Kanban targets
}

export interface LoopNode {
  id: string;
  level: '1' | '2' | '3' | '4'; // Payer, Provider, Subscriber, Patient (Scenario 15)
  parentId: string | null;      // Tree tracking pointers (Scenario 04)
  segments: string[][];         // Raw parsed matrix lines
}
