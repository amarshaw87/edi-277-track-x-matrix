import { EdiStatus } from './types';

/**
 * Scenarios 05 & 06: Split Status Composite Decomposition & Early-Drop Detection
 * Isolates composite tokens and guards the layout matrix against early terminal drops.
 */
export class StatusDecomposer {
  /**
   * Scenario 05: Split Status Composite Decomposition
   * Splits multi-layered string codes joined by colons into structured status keys.
   */
  public decomposeStatus(stcSegment: string[], compositeDelimiter: string): EdiStatus {
    // If no STC elements exist, return an undefined structural default
    if (!stcSegment || stcSegment.length < 2) {
      return { category: 'U', status: '0', actor: 'UNKNOWN', description: 'Unparseable Segment' };
    }

    // Target the first value field containing the composite data matrix string (STC01)
    const compositeString = stcSegment[1];
    const subParts = compositeString.split(compositeDelimiter);

    const category = subParts[0] || 'U';
    const status = subParts[1] || '0';
    const actor = subParts[2] || 'PR';

    return {
      category,
      status,
      actor,
      description: 'Pending Dictionary Sync' // Populated during runtime pipeline matching
    };
  }

  /**
   * Scenario 06: Early-Drop Global Facility Rejections
   * Scans upper hierarchy nodes ahead of time to detect terminal payer drops.
   */
  public isGlobalFacilityRejection(segments: string[][], compositeDelimiter: string): boolean {
    for (const segment of segments) {
      if (segment[0] === 'STC') {
        const structuralStatus = this.decomposeStatus(segment, compositeDelimiter);
        // Common industrial high-tier validation drop patterns (e.g. category marks tracking "A3" or "A7")
        if (structuralStatus.category === 'A3' || structuralStatus.category === 'A7') {
          return true;
        }
      }
    }
    return false;
  }
}
