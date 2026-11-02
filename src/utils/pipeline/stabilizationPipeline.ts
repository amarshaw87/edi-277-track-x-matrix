import { ClaimCard } from '../parser/types';

/**
 * Category 4: System Stabilization & High-Velocity Scaling Pipeline
 * Deduplicates overlapping status echoes and isolates hollow loop arrays.
 */
export class StabilizationPipeline {
  private processingHashes: Set<string> = new Set();

  /**
   * Scenario 14: Hollow Loop Isolation
   * Inspects loop structure segments before UI processing to filter out empty dead blocks.
   */
  public isValidLoopStructure(segments: string[][]): boolean {
    if (!segments || segments.length === 0) return false;
    
    // An interface block requires structural attributes (like an explicit NM1, TRN, or STC segment)
    const vitalIndicators = ['NM1', 'TRN', 'STC', 'SVC', 'REF'];
    return segments.some(segment => segment.length > 0 && vitalIndicators.includes(segment[0]));
  }

  /**
   * Scenario 13: Idempotent Payer Status Echo Deduplication
   * Generates a deterministic signature hash from claim values to drop ghost clones instantly.
   */
  public deduplicateAndFilter(claims: ClaimCard[]): ClaimCard[] {
    const uniqueCards: ClaimCard[] = [];

    for (const claim of claims) {
      // Build a unique signature combining the claim's trace key, current state status, and procedure length
      const uniqueSignature = `${claim.traceId}_${claim.globalStatus.category}_${claim.globalStatus.status}_${claim.procedures.length}`;

      if (this.processingHashes.has(uniqueSignature)) {
        // Drop duplicate entries instantly
        continue;
      }

      // Lock signature to block downstream ghost allocations
      this.processingHashes.add(uniqueSignature);
      
      // Override standard string ID with the secure hashed footprint signature
      claim.id = `HASH_${uniqueSignature}`;
      uniqueCards.push(claim);
    }

    return uniqueCards;
  }

  /**
   * Clears state caching memory blocks across execution threads.
   */
  public resetRegistry(): void {
    this.processingHashes.clear();
  }
}
