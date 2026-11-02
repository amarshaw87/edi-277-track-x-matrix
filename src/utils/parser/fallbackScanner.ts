/**
 * Scenarios 07 & 10: Shifting Date & Ghost Trace Recovery Scanner
 * Extracts highly unstable payload variables from unstable index structures.
 */
export class FallbackScanner {
  /**
   * Scenario 07: Shifting Date Layout Anomaly
   * Scans composite segment fields and external DTM context lines concurrently.
   */
  public extractUnifiedDate(loopSegments: string[][]): string {
    // Phase 1: Try to look for a dedicated DTM date tracking line
    for (const segment of loopSegments) {
      if (segment[0] === 'DTM' && (segment[1] === '472' || segment[1] === '573') && segment[2]) {
        return this.formatEdiDate(segment[2]);
      }
    }

    // Phase 2: Look-ahead fallback into inline STC payload parameters if available
    for (const segment of loopSegments) {
      if (segment[0] === 'STC' && segment[4]) {
        return this.formatEdiDate(segment[4]);
      }
    }

    // Phase 3: Ultimate system time fallback
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Scenario 10: Virtual Trace Correlation
   * Builds tracking identifiers from demographic tokens to recover ghost claims.
   */
  public buildRecoveryKey(loopSegments: string[][]): string {
    let traceId = '';
    let lastName = '';
    let firstName = '';

    for (const segment of loopSegments) {
      // Look for explicit TRN tracking markers
      if (segment[0] === 'TRN' && segment[2]) {
        traceId = segment[2];
      }
      // Look for REF secondary fallback markers
      if (segment[0] === 'REF' && segment[1] === 'D9' && segment[2]) {
        traceId = segment[2];
      }
      // Harvest patient name signatures
      if (segment[0] === 'NM1' && (segment[1] === 'QC' || segment[1] === 'IL')) {
        lastName = segment[3] || '';
        firstName = segment[4] || '';
      }
    }

    if (traceId) return traceId;
    
    // Fallback compound key algorithm to keep the UI from dropping tracking routes
    return `GHOST_${lastName.replace(/\s+/g, '')}_${firstName.replace(/\s+/g, '')}_${Math.random().toString(36).substring(2, 7)}`;
  }

  /**
   * Utility helper to convert YYYYMMDD string format to cleaner YYYY-MM-DD format
   */
  private formatEdiDate(rawDate: string): string {
    if (rawDate.length === 8) {
      return `${rawDate.substring(0, 4)}-${rawDate.substring(4, 6)}-${rawDate.substring(6, 8)}`;
    }
    return rawDate;
  }
}
