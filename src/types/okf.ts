/* Open Knowledge Format (OKF) — TypeScript Interfaces */

export type Testament = 'OT' | 'NT';

export type TranslationId = 'KJV' | 'WEB' | 'ESV' | 'NLT';

export type BookCategory = 
  | 'Law' 
  | 'History' 
  | 'Poetry' 
  | 'MajorProphets' 
  | 'MinorProphets' 
  | 'Gospels' 
  | 'Acts' 
  | 'PaulineEpistles' 
  | 'GeneralEpistles' 
  | 'Apocalyptic';

export interface BibleBook {
  id: string;             // e.g. "GEN"
  name: string;           // e.g. "Genesis"
  testament: Testament;
  category: BookCategory;
  chaptersCount: number;
  abbreviation: string;
}

export interface OKFVerseNode {
  id: string;             // Node ID e.g. "GEN.1.1" or "JHN.3.16"
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  tags?: string[];
}

export type CrossRefCategory = 
  | 'direct_quote' 
  | 'prophecy_fulfillment' 
  | 'parallel_account' 
  | 'topical_echo' 
  | 'linguistic_link';

export interface OKFCrossRefEdge {
  id: string;
  sourceVerseId: string;
  targetVerseId: string;
  category: CrossRefCategory;
  weight: number;         // 1 (subtle) to 5 (direct exact quote / fulfilled prophecy)
  note?: string;
}

export interface UserAnnotation {
  id: string;
  verseId: string;
  note: string;
  tags: string[];
  updatedAt: string;
}

export interface OKFKnowledgeGraphExport {
  version: string;
  title: string;
  exportedAt: string;
  nodesCount: number;
  edgesCount: number;
  nodes: OKFVerseNode[];
  edges: OKFCrossRefEdge[];
  annotations: UserAnnotation[];
}
