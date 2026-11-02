import { EdiStatus } from '../parser/types';
import { StatusDecomposer } from '../parser/statusDecomposer';
import { FallbackScanner } from '../parser/fallbackScanner';
import dictionaryData from '../../assets/track277Dictionary.json';

const dictionary = dictionaryData as Record<string, { status: string; lane: string; description: string }>;

/**
 * Category 2: Status Processing & Boundary Protection Pipeline
 * Extracts, decomposes, and enriches EDI status tokens while guarding data edges.
 */
export class StatusPipeline {
  private decomposer: StatusDecomposer;
  private scanner: FallbackScanner;

  constructor(decomposer: StatusDecomposer, scanner: FallbackScanner) {
    this.decomposer = decomposer;
    this.scanner = scanner;
  }

  /**
   * Scenarios 05, 06 & 07: Processes raw loop rows to resolve full status properties.
   */
  public processStatusContext(segments: string[][], compositeDelimiter: string): { globalStatus: EdiStatus; timestamp: string } {
    const timestamp = this.scanner.extractUnifiedDate(segments);
    
    // Scenario 06: Check for terminal facility failures up front
    if (this.decomposer.isGlobalFacilityRejection(segments, compositeDelimiter)) {
      return {
        globalStatus: {
          category: 'A7',
          status: '122',
          actor: 'PR',
          description: dictionary['A7']?.description || 'Global Provider/Facility Rejection'
        },
        timestamp
      };
    }

    // Default status if no specific STC segment alters the pipeline path
    let globalStatus: EdiStatus = { category: 'A1', status: '20', actor: 'PR', description: dictionary['A1'].description };

    for (const segment of segments) {
      if (segment[0] === 'STC') {
        // Scenario 05: Split Status Composite Decomposition
        const rawStatus = this.decomposer.decomposeStatus(segment, compositeDelimiter);
        const lookupKey = `${rawStatus.category}`;
        
        // Sync raw code with translation descriptions inside the master dictionary asset
        if (dictionary[lookupKey]) {
          globalStatus = {
            ...rawStatus,
            description: dictionary[lookupKey].description
          };
        } else {
          globalStatus = {
            ...rawStatus,
            description: `Unknown status marker: Category ${rawStatus.category}`
          };
        }
        break;
      }
    }

    return { globalStatus, timestamp };
  }
}
