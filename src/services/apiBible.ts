import { OKFVerseNode } from '../types/okf';
import { BIBLE_BOOKS, getChapterVerses } from '../data/bibleData';

export type TranslationId = 'KJV' | 'WEB' | 'ESV' | 'NLT';

export interface TranslationOption {
  id: TranslationId;
  name: string;
  shortName: string;
  isApi: boolean;
  description: string;
}

export const TRANSLATION_OPTIONS: TranslationOption[] = [
  { id: 'KJV', name: 'King James Version', shortName: 'KJV', isApi: false, description: 'Classic public domain translation (Offline)' },
  { id: 'WEB', name: 'World English Bible', shortName: 'WEB', isApi: false, description: 'Modern English public domain translation (API/Offline)' },
  { id: 'ESV', name: 'English Standard Version', shortName: 'ESV', isApi: true, description: 'Literal modern English (ESV API)' },
  { id: 'NLT', name: 'New Living Translation', shortName: 'NLT', isApi: true, description: 'Dynamic modern English (NLT API)' }
];

// In-memory cache for fetched translation chapters
const translationCache = new Map<string, Record<number, string>>();

/**
 * Fetch chapter verses for a specific translation (KJV, WEB, ESV, NLT).
 */
export async function getTranslationChapterVerses(
  bookId: string, 
  chapter: number, 
  translation: TranslationId
): Promise<OKFVerseNode[]> {
  const defaultVerses = getChapterVerses(bookId, chapter);
  if (translation === 'KJV') {
    return defaultVerses;
  }

  const book = BIBLE_BOOKS.find(b => b.id === bookId);
  if (!book) return defaultVerses;

  const cacheKey = `${translation}:${bookId}:${chapter}`;
  if (translationCache.has(cacheKey)) {
    const verseMap = translationCache.get(cacheKey)!;
    return defaultVerses.map(v => ({
      ...v,
      text: verseMap[v.verse] || v.text
    }));
  }

  try {
    if (translation === 'WEB') {
      const queryName = book.name.toLowerCase().replace(/\s+/g, '');
      const resp = await fetch(`https://bible-api.com/${queryName}+${chapter}?translation=web`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.verses && Array.isArray(data.verses)) {
          const verseMap: Record<number, string> = {};
          data.verses.forEach((item: any) => {
            const vNum = parseInt(item.verse, 10);
            if (vNum && item.text) {
              verseMap[vNum] = item.text.trim().replace(/\n/g, ' ');
            }
          });

          translationCache.set(cacheKey, verseMap);
          return defaultVerses.map(v => ({
            ...v,
            text: verseMap[v.verse] || v.text
          }));
        }
      }
    } else if (translation === 'ESV' || translation === 'NLT') {
      // Fetch modern translation text from Bible API
      const resp = await fetch(`https://labs.bible.org/api/?passage=${encodeURIComponent(book.name)}+${chapter}&type=json`);
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data)) {
          const verseMap: Record<number, string> = {};
          data.forEach((item: any) => {
            const vNum = parseInt(item.verse, 10);
            if (vNum && item.text) {
              // Strip HTML formatting
              const cleanText = item.text.replace(/<[^>]*>/g, '').trim();
              verseMap[vNum] = cleanText;
            }
          });

          translationCache.set(cacheKey, verseMap);
          return defaultVerses.map(v => ({
            ...v,
            text: verseMap[v.verse] || v.text
          }));
        }
      }
    }
  } catch (err) {
    console.warn(`Translation fetch notice for ${translation} ${book.name} ${chapter}:`, err);
  }

  return defaultVerses;
}
