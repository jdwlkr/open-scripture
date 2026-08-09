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
    dbPromise = openDB<OpenScriptureDB>('open-scripture-db', 2, {
      upgrade(db, oldVersion, newVersion, transaction) {
        let verseStore: any;
        let refStore: any;
        let noteStore: any;

        if (oldVersion < 1) {
          verseStore = db.createObjectStore('verses', { keyPath: 'id' });
          verseStore.createIndex('by-book-chapter', ['bookId', 'chapter']);

          refStore = db.createObjectStore('cross_references', { keyPath: 'id' });
          refStore.createIndex('by-source', 'sourceVerseId');
          refStore.createIndex('by-target', 'targetVerseId');

          noteStore = db.createObjectStore('annotations', { keyPath: 'id' });
          noteStore.createIndex('by-verse', 'verseId');

          db.createObjectStore('bookmarks', { keyPath: 'verseId' });
        }
      },
    });
  }
  return dbPromise;
}

export async function initializeDatabase(onProgress?: (progress: number, total: number) => void) {
  const db = await getDB();
  const count = await db.count('cross_references');
  
  if (count < 300000) {
    console.log('Populating 344,676 OKF cross-references into IndexedDB...');
    try {
      const resp = await fetch('/okf_full_cross_references.json');
      if (resp.ok) {
        const fullEdges: OKFCrossRefEdge[] = await resp.json();
        const batchSize = 10000;
        
        for (let i = 0; i < fullEdges.length; i += batchSize) {
          const batch = fullEdges.slice(i, i + batchSize);
          const tx = db.transaction('cross_references', 'readwrite');
          for (const ref of batch) {
            await tx.store.put(ref);
          }
          await tx.done;

          if (onProgress) {
            onProgress(Math.min(fullEdges.length, i + batchSize), fullEdges.length);
          }
        }
        console.log(`Successfully indexed ${fullEdges.length} cross-references into client IndexedDB!`);
        return;
      }
    } catch (err) {
      console.warn('Full graph fetch fallback to initial seed edges:', err);
    }

    // Fallback seed
    const tx = db.transaction('cross_references', 'readwrite');
    for (const ref of INITIAL_CROSS_REFERENCES) {
      await tx.store.put(ref);
    }
    await tx.done;
  }
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
