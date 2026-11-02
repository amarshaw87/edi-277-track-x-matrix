import { EdiDelimiters } from '../parser/regexDiscoverer';
import { HierarchyTree } from '../parser/hierarchyTree';

/**
 * Category 1: Ingestion & Structural Tracking Pipeline
 * Processes raw text matrices into clean, logically chunked loop components.
 */
export class StructuralPipeline {
  private tree: HierarchyTree;

  constructor(tree: HierarchyTree) {
    this.tree = tree;
  }

  /**
   * Scenario 02: Version Verification & Dynamic Scaling
   * Parses raw file chunks into elements, matching index steps to standard versions.
   */
  public splitAndGroupSegments(rawText: string, delimiters: EdiDelimiters): string[][] {
    const rawLines = rawText.split(delimiters.segment);
    const parsedSegments: string[][] = [];

    // Dynamically scales index constraints based on file version
    let isLegacyVersion = false;

    for (const line of rawLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const elements = trimmed.split(delimiters.element);
      
      // Look for the version tag inside the GS segment (GS08)
      if (elements[0] === 'GS' && elements.length >= 9) {
        const versionToken = elements[8];
        if (versionToken.includes('004010')) {
          isLegacyVersion = true; // Dynamically flag old layouts
        }
      }

      // Scenario 02 Fix: Apply index scaling offsets if historical offsets are true
      if (isLegacyVersion && elements[0] === 'BGN') {
        // Enforce padding modifications to stabilize array mutations safely
        elements.push('LEGACY_OFFSET_PAD');
      }

      parsedSegments.push(elements);
    }

    return parsedSegments;
  }

  /**
   * Orchestrates loop tracking insertions into the hierarchy trace map
   */
  public structureLoopNode(level: '1' | '2' | '3' | '4', segments: string[][]) {
    return this.tree.insertNode(level, segments);
  }
}
