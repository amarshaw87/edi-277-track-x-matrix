import { ClaimCard, ProcedureLine, EdiStatus } from '../parser/types';
import { FallbackScanner } from '../parser/fallbackScanner';
import dictionaryData from '../../assets/track277Dictionary.json';

const dictionary = dictionaryData as Record<string, { lane: string }>;

/**
 * Category 3: Advanced Reconciliation & Workflow Intelligence Pipeline
 * Assembles procedure lines, heals ghost trace indicators, and resolves targets.
 */
export class ReconciliationPipeline {
  private scanner: FallbackScanner;

  constructor(scanner: FallbackScanner) {
    this.scanner = scanner;
  }

  /**
   * Scenarios 09, 10 & 11: Reconciles fragments into a unified claim template.
   */
  public reconcileClaimCard(
    segments: string[][], 
    globalStatus: EdiStatus, 
    timestamp: string, 
    payerName: string, 
    providerId: string
  ): ClaimCard {
    
    // Scenario 10: Heal missing patient markers with compound recovery references
    const traceId = this.scanner.buildRecoveryKey(segments);

    // Scenario 09: Sub-Procedure Line Splitting within a unified template
    const procedures: ProcedureLine[] = [];
    let patientName = 'Unknown Patient';

    for (const segment of segments) {
      if (segment[0] === 'NM1' && segment[1] === 'QC') {
        patientName = `${segment[3] || ''}, ${segment[4] || ''}`.trim();
      }

      // Capture SVC (Service Line) elements to stack sub-tasks
      if (segment[0] === 'SVC' && segment.length >= 3) {
        const compProc = segment[1].split(':');
        procedures.push({
          id: `SVC_${Math.random().toString(36).substring(2, 7)}`,
          procedureCode: compProc[1] || compProc[0] || 'GENERIC',
          chargeAmount: parseFloat(segment[2]) || 0,
          status: { ...globalStatus }
        });
      }
    }

    // Default procedure line if the claim does not declare explicit service items
    if (procedures.length === 0) {
      procedures.push({
        id: 'SVC_MAIN',
        procedureCode: 'TOTAL_CLAIM',
        chargeAmount: 0,
        status: { ...globalStatus }
      });
    }

    // Match code categorization to specific Kanban lanes
    let lane: 'accepted' | 'pended' | 'rejected' = 'pended';
    if (dictionary[globalStatus.category]) {
      lane = dictionary[globalStatus.category].lane as 'accepted' | 'pended' | 'rejected';
    }

    // Scenario 13: Unique ID Generation seed placeholder (overridden by pipeline hash)
    const id = `CLAIM_${traceId}`;

    return {
      id,
      traceId,
      payerName,
      providerId,
      patientName,
      patientDob: 'Unavailable',
      timestamp,
      globalStatus,
      procedures,
      lane
    };
  }
}
