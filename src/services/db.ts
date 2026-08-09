import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { OKFVerseNode, OKFCrossRefEdge, UserAnnotation } from '../types/okf';
import { INITIAL_CROSS_REFERENCES } from '../data/crossRefData';

interface OpenScriptureDB extends DBSchema {
  verses: {
    key: string;
    value: OKFVerseNode;
    indexes: { 'by-book-chapter': [string, number] };
  };
  cross_references: {
    key: string;
    value: OKFCrossRefEdge;
    indexes: { 
      'by-source': string;
      'by-target': string;
    };
  };
  annotations: {
    key: string;
    value: UserAnnotation;
    indexes: { 'by-verse': string };
  };
  bookmarks: {
    key: string;
    value: { verseId: string; addedAt: string };
  };
}

let dbPromise: Promise<IDBPDatabase<OpenScriptureDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<OpenScriptureDB>('open-scripture-db', 1, {
      upgrade(db) {
        // Verses Store
        const verseStore = db.createObjectStore('verses', { keyPath: 'id' });
        verseStore.createIndex('by-book-chapter', ['bookId', 'chapter']);

        // Cross References Store
        const refStore = db.createObjectStore('cross_references', { keyPath: 'id' });
        refStore.createIndex('by-source', 'sourceVerseId');
        refStore.createIndex('by-target', 'targetVerseId');

        // Annotations Store
        const noteStore = db.createObjectStore('annotations', { keyPath: 'id' });
        noteStore.createIndex('by-verse', 'verseId');

        // Bookmarks Store
        db.createObjectStore('bookmarks', { keyPath: 'verseId' });
      },
    });
  }
  return dbPromise;
}

export async function initializeDatabase() {
  const db = await getDB();
  const tx = db.transaction('cross_references', 'readwrite');
  const count = await tx.store.count();
  
  if (count === 0) {
    // Populate seed cross-references
    for (const ref of INITIAL_CROSS_REFERENCES) {
      await tx.store.put(ref);
    }
  }
  await tx.done;
}

export async function getCrossReferencesForVerse(verseId: string): Promise<OKFCrossRefEdge[]> {
  const db = await getDB();
  const outgoing = await db.getAllFromIndex('cross_references', 'by-source', verseId);
  const incoming = await db.getAllFromIndex('cross_references', 'by-target', verseId);
  
  // Combine outgoing and incoming edges for bidirectional cross-referencing
  const combinedMap = new Map<string, OKFCrossRefEdge>();
  
  outgoing.forEach(e => combinedMap.set(e.id, e));
  
  // Normalize incoming edges so target is the related verse
  incoming.forEach(e => {
    if (!combinedMap.has(e.id)) {
      combinedMap.set(e.id, {
        ...e,
        sourceVerseId: e.targetVerseId,
        targetVerseId: e.sourceVerseId,
      });
    }
  });

  return Array.from(combinedMap.values());
}

export async function saveAnnotation(verseId: string, note: string, tags: string[] = []): Promise<UserAnnotation> {
  const db = await getDB();
  const annotation: UserAnnotation = {
    id: `note-${verseId}-${Date.now()}`,
    verseId,
    note,
    tags,
    updatedAt: new Date().toISOString()
  };
  await db.put('annotations', annotation);
  return annotation;
}

export async function getAnnotationsForVerse(verseId: string): Promise<UserAnnotation[]> {
  const db = await getDB();
  return db.getAllFromIndex('annotations', 'by-verse', verseId);
}

export async function toggleBookmark(verseId: string): Promise<boolean> {
  const db = await getDB();
  const existing = await db.get('bookmarks', verseId);
  if (existing) {
    await db.delete('bookmarks', verseId);
    return false;
  } else {
    await db.put('bookmarks', { verseId, addedAt: new Date().toISOString() });
    return true;
  }
}

export async function isBookmarked(verseId: string): Promise<boolean> {
  const db = await getDB();
  const item = await db.get('bookmarks', verseId);
  return !!item;
}
