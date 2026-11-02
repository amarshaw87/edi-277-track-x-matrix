import { LoopNode } from './types';

/**
 * Scenarios 04 & 15: Hierarchical Parent-Child Tree Tracking
 * Tracks changing data depths independently to safely link 
 * Payers, Providers, Subscribers, and Patients without collision.
 */
export class HierarchyTree {
  private nodes: Map<string, LoopNode> = new Map();
  private lastActiveNodeAtLevel: Map<string, string> = new Map();

  /**
   * Registers a nested loop segment array block into the tracking trace map.
   */
  public insertNode(level: '1' | '2' | '3' | '4', segments: string[][]): LoopNode {
    const id = `HL_${level}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Scenario 15: Find parental context dynamically by looking up one level higher
    const parentLevel = (parseInt(level) - 1).toString();
    const parentId = this.lastActiveNodeAtLevel.get(parentLevel) || null;

    const node: LoopNode = {
      id,
      level,
      parentId,
      segments
    };

    this.nodes.set(id, node);
    this.lastActiveNodeAtLevel.set(level, id);

    // Clear dead descendant trails upon step modifications
    const childLevel = (parseInt(level) + 1).toString();
    this.lastActiveNodeAtLevel.delete(childLevel);

    return node;
  }

  /**
   * Scenario 04: Recursively climbs upward to locate context (e.g. searching for Provider Name)
   */
  public findParentContext(nodeId: string, targetLevel: '1' | '2' | '3' | '4'): LoopNode | null {
    let current = this.nodes.get(nodeId);
    
    while (current) {
      if (current.level === targetLevel) {
        return current;
      }
      if (!current.parentId) break;
      current = this.nodes.get(current.parentId);
    }
    
    return null;
  }

  /**
   * Resets active pipeline workspace markers.
   */
  public clear(): void {
    this.nodes.clear();
    this.lastActiveNodeAtLevel.clear();
  }
}
