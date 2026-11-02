import { ClaimCard } from './parser/types';
import { discoverDelimiters } from './parser/regexDiscoverer';
import { HierarchyTree } from './parser/hierarchyTree';
import { StatusDecomposer } from './parser/statusDecomposer';
import { FallbackScanner } from './parser/fallbackScanner';
import { StructuralPipeline } from './pipeline/structuralPipeline';
import { StatusPipeline } from './pipeline/statusPipeline';
import { ReconciliationPipeline } from './pipeline/reconciliationPipeline';
import { StabilizationPipeline } from './pipeline/stabilizationPipeline';

/**
 * Core Track-X-Matrix State Machine Orchestrator
 * Integrates isolated scenario pipelines to transform raw EDI 277 text into a clean UI array.
 */
export class Edi277ParserCore {
  private tree: HierarchyTree;
  private decomposer: StatusDecomposer;
  private scanner: FallbackScanner;

  private structuralPipe: StructuralPipeline;
  private statusPipe: StatusPipeline;
  private reconciliationPipe: ReconciliationPipeline;
  private stabilizationPipe: StabilizationPipeline;

  constructor() {
    this.tree = new HierarchyTree();
    this.decomposer = new StatusDecomposer();
    this.scanner = new FallbackScanner();

    this.structuralPipe = new StructuralPipeline(this.tree);
    this.statusPipe = new StatusPipeline(this.decomposer, this.scanner);
    this.reconciliationPipe = new ReconciliationPipeline(this.scanner);
    this.stabilizationPipe = new StabilizationPipeline();
  }

  /**
   * Main Execution Entrypoint
   */
  public parse(rawText: string): ClaimCard[] {
    // Reset state trackers for this run
    this.tree.clear();
    this.stabilizationPipe.resetRegistry();

    // 1. Ingestion: Scan and isolate configuration boundaries (Scenario 01)
    const delimiters = discoverDelimiters(rawText);
    const parsedSegments = this.structuralPipe.splitAndGroupSegments(rawText, delimiters);

    const rawClaimsCollection: ClaimCard[] = [];
    let currentPayerName = 'Unknown Payer';
    let currentProviderId = 'Unknown Provider';
    let workingPatientSegments: string[][] = [];

    // 2. Loop Execution & Dynamic Hierarchical Sorting
    for (const segment of parsedSegments) {
      if (!segment || segment.length === 0) continue;

      const segmentId = segment[0];

      // Harvest metadata from high-level infrastructure scopes
      if (segmentId === 'NM1' && segment[1] === 'PR') {
        currentPayerName = segment[3] || 'Unknown Payer';
      }
      if (segmentId === 'NM1' && segment[1] === '1S') {
        currentProviderId = segment[9] || 'Unknown Provider';
      }

      // Track hierarchical loop state shifts
      if (segmentId === 'HL') {
        const level = segment[3]; // '1'=Payer, '2'=Provider, '3'=Subscriber, '4'=Patient

        if (level === '1' || level === '2' || level === '3') {
          // If we hit a new loop hierarchy break, process any pending patient block first
          if (workingPatientSegments.length > 0) {
            this.processPatientAccumulation(
              workingPatientSegments,
              delimiters.composite,
              currentPayerName,
              currentProviderId,
              rawClaimsCollection
            );
            workingPatientSegments = [];
          }
          this.structuralPipe.structureLoopNode(level as '1' | '2' | '3', [segment]);
        } 
        else if (level === '4') {
          // Handle context shifts between back-to-back patient segments
          if (workingPatientSegments.length > 0) {
            this.processPatientAccumulation(
              workingPatientSegments,
              delimiters.composite,
              currentPayerName,
              currentProviderId,
              rawClaimsCollection
            );
            workingPatientSegments = [];
          }
          this.structuralPipe.structureLoopNode('4', [segment]);
          workingPatientSegments.push(segment);
        }
      } else {
        // Collect child attributes underneath the active loop context
        if (workingPatientSegments.length > 0) {
          workingPatientSegments.push(segment);
        }
      }
    }

    // Flush any remaining active patient rows out of the buffer loop
    if (workingPatientSegments.length > 0) {
      this.processPatientAccumulation(
        workingPatientSegments,
        delimiters.composite,
        currentPayerName,
        currentProviderId,
        rawClaimsCollection
      );
    }

    // 3. System Stabilization & Anti-Flicker Deduplication (Scenarios 13 & 14)
    return this.stabilizationPipe.deduplicateAndFilter(rawClaimsCollection);
  }

  /**
   * Internal processor for structured patient sub-blocks
   */
  private processPatientAccumulation(
    segments: string[][],
    compositeDelimiter: string,
    payerName: string,
    providerId: string,
    collection: ClaimCard[]
  ): void {
    // Scenario 14: Hollow Loop Isolation check
    if (!this.stabilizationPipe.isValidLoopStructure(segments)) {
      return;
    }

    // Process status composite maps and fallback dates
    const { globalStatus, timestamp } = this.statusPipe.processStatusContext(segments, compositeDelimiter);

    // Reconcile and assemble multi-procedure arrays into the clean claim model template
    const claimCard = this.reconciliationPipe.reconcileClaimCard(
      segments,
      globalStatus,
      timestamp,
      payerName,
      providerId
    );

    collection.push(claimCard);
  }
}
