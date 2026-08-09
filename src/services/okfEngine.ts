import { OKFVerseNode, OKFCrossRefEdge, OKFKnowledgeGraphExport, UserAnnotation } from '../types/okf';
import { getVerseById, BIBLE_BOOKS } from '../data/bibleData';
import { getCrossReferencesForVerse, getDB } from './db';

export class OKFEngine {
  /**
   * Traverse OKF graph starting from a root verse to N degrees of cross-reference depth.
   */
  static async getKnowledgeGraphSubnet(rootVerseId: string, depth: number = 2): Promise<{
    nodes: OKFVerseNode[];
    edges: OKFCrossRefEdge[];
  }> {
    const visitedNodes = new Map<string, OKFVerseNode>();
    const visitedEdges = new Map<string, OKFCrossRefEdge>();

    const rootNode = getVerseById(rootVerseId);
    if (rootNode) {
      visitedNodes.set(rootNode.id, rootNode);
    }

    let currentLevelIds = [rootVerseId];

    for (let d = 0; d < depth; d++) {
      const nextLevelIds: string[] = [];

      for (const verseId of currentLevelIds) {
        const edges = await getCrossReferencesForVerse(verseId);
        
        for (const edge of edges) {
          if (!visitedEdges.has(edge.id)) {
            visitedEdges.set(edge.id, edge);
          }

          const targetId = edge.targetVerseId === verseId ? edge.sourceVerseId : edge.targetVerseId;
          
          if (!visitedNodes.has(targetId)) {
            const targetNode = getVerseById(targetId);
            if (targetNode) {
              visitedNodes.set(targetId, targetNode);
              nextLevelIds.push(targetId);
            }
          }
        }
      }

      currentLevelIds = nextLevelIds;
    }

    return {
      nodes: Array.from(visitedNodes.values()),
      edges: Array.from(visitedEdges.values())
    };
  }

  /**
   * Format full verse reference text e.g. "Genesis 1:1" or "John 3:16"
   */
  static formatRef(verseId: string): string {
    const parts = verseId.split('.');
    if (parts.length < 3) return verseId;
    
    const [bookId, chapter, verse] = parts;
    const book = BIBLE_BOOKS.find(b => b.id === bookId);
    const bookName = book ? book.name : bookId;

    return `${bookName} ${chapter}:${verse}`;
  }

  /**
   * Export user annotations and cross-references as an OKF JSON Knowledge Graph file.
   */
  static async exportOKFSchema(title: string = 'Open Scripture Knowledge Graph'): Promise<string> {
    const db = await getDB();
    const edges = await db.getAll('cross_references');
    const annotations = await db.getAll('annotations');
    
    // Collect all referenced nodes
    const nodeIds = new Set<string>();
    edges.forEach(e => {
      nodeIds.add(e.sourceVerseId);
      nodeIds.add(e.targetVerseId);
    });
    annotations.forEach(a => nodeIds.add(a.verseId));

    const nodes: OKFVerseNode[] = [];
    nodeIds.forEach(id => {
      const node = getVerseById(id);
      if (node) nodes.push(node);
    });

    const exportData: OKFKnowledgeGraphExport = {
      version: '1.0.0-OKF',
      title,
      exportedAt: new Date().toISOString(),
      nodesCount: nodes.length,
      edgesCount: edges.length,
      nodes,
      edges,
      annotations
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import OKF schema into client database.
   */
  static async importOKFSchema(jsonString: string): Promise<{ importedEdges: number; importedNotes: number }> {
    const data: OKFKnowledgeGraphExport = JSON.parse(jsonString);
    const db = await getDB();

    let importedEdges = 0;
    let importedNotes = 0;

    if (Array.isArray(data.edges)) {
      const tx = db.transaction('cross_references', 'readwrite');
      for (const edge of data.edges) {
        await tx.store.put(edge);
        importedEdges++;
      }
      await tx.done;
    }

    if (Array.isArray(data.annotations)) {
      const tx = db.transaction('annotations', 'readwrite');
      for (const note of data.annotations) {
        await tx.store.put(note);
        importedNotes++;
      }
      await tx.done;
    }

    return { importedEdges, importedNotes };
  }
}
