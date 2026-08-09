import { OKFVerseNode } from '../types/okf';
import { OKFEngine } from './okfEngine';

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
  { id: 'WEB', name: 'World English Bible', shortName: 'WEB', isApi: false, description: 'Modern English public domain translation (Offline)' },
  { id: 'ESV', name: 'English Standard Version', shortName: 'ESV', isApi: true, description: 'Literal modern English (Official Crossway API)' },
  { id: 'NLT', name: 'New Living Translation', shortName: 'NLT', isApi: true, description: 'Dynamic modern English (Official Tyndale API)' }
];

// In-memory cache for API fetched passages
const apiCache = new Map<string, string>();

/**
 * Fetch ESV passage text from official Crossway API (api.esv.org)
 */
export async function fetchESVPassage(refText: string, apiKey?: string): Promise<string | null> {
  const cacheKey = `ESV:${refText}`;
  if (apiCache.has(cacheKey)) return apiCache.get(cacheKey)!;

  try {
    const keyToUse = apiKey || 'TEST'; // Crossway demo key or user key
    const response = await fetch(`https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(refText)}&include-footnotes=false&include-passage-references=false`, {
      headers: {
        'Authorization': `Token ${keyToUse}`
      }
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (data.passages && data.passages.length > 0) {
      const text = data.passages[0].trim();
      apiCache.set(cacheKey, text);
      return text;
    }
  } catch (err) {
    console.warn('ESV API fetch notice:', err);
  }
  return null;
}

/**
 * Fetch NLT passage text from official Tyndale API (api.nlt.to)
 */
export async function fetchNLTPassage(refText: string, apiKey?: string): Promise<string | null> {
  const cacheKey = `NLT:${refText}`;
  if (apiCache.has(cacheKey)) return apiCache.get(cacheKey)!;

  try {
    const keyToUse = apiKey || 'TEST';
    const response = await fetch(`https://api.nlt.to/api/passages?ref=${encodeURIComponent(refText)}&key=${keyToUse}`);
    if (!response.ok) return null;
    const htmlText = await response.text();
    
    // Clean HTML tags from NLT API response
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlText;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    if (text.trim()) {
      apiCache.set(cacheKey, text.trim());
      return text.trim();
    }
  } catch (err) {
    console.warn('NLT API fetch notice:', err);
  }
  return null;
}
