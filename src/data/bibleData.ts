import { BibleBook, OKFVerseNode } from '../types/okf';
import bibleFullIndex from './bibleFullIndex.json';

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament (39 Books)
  { id: 'GEN', name: 'Genesis', testament: 'OT', category: 'Law', chaptersCount: 50, abbreviation: 'Gen' },
  { id: 'EXO', name: 'Exodus', testament: 'OT', category: 'Law', chaptersCount: 40, abbreviation: 'Exo' },
  { id: 'LEV', name: 'Leviticus', testament: 'OT', category: 'Law', chaptersCount: 27, abbreviation: 'Lev' },
  { id: 'NUM', name: 'Numbers', testament: 'OT', category: 'Law', chaptersCount: 36, abbreviation: 'Num' },
  { id: 'DEU', name: 'Deuteronomy', testament: 'OT', category: 'Law', chaptersCount: 34, abbreviation: 'Deu' },
  { id: 'JOS', name: 'Joshua', testament: 'OT', category: 'History', chaptersCount: 24, abbreviation: 'Jos' },
  { id: 'JDG', name: 'Judges', testament: 'OT', category: 'History', chaptersCount: 21, abbreviation: 'Jdg' },
  { id: 'RUT', name: 'Ruth', testament: 'OT', category: 'History', chaptersCount: 4, abbreviation: 'Rut' },
  { id: '1SA', name: '1 Samuel', testament: 'OT', category: 'History', chaptersCount: 31, abbreviation: '1Sa' },
  { id: '2SA', name: '2 Samuel', testament: 'OT', category: 'History', chaptersCount: 24, abbreviation: '2Sa' },
  { id: '1KI', name: '1 Kings', testament: 'OT', category: 'History', chaptersCount: 22, abbreviation: '1Ki' },
  { id: '2KI', name: '2 Kings', testament: 'OT', category: 'History', chaptersCount: 25, abbreviation: '2Ki' },
  { id: '1CH', name: '1 Chronicles', testament: 'OT', category: 'History', chaptersCount: 29, abbreviation: '1Ch' },
  { id: '2CH', name: '2 Chronicles', testament: 'OT', category: 'History', chaptersCount: 36, abbreviation: '2Ch' },
  { id: 'EZR', name: 'Ezra', testament: 'OT', category: 'History', chaptersCount: 10, abbreviation: 'Ezr' },
  { id: 'NEH', name: 'Nehemiah', testament: 'OT', category: 'History', chaptersCount: 13, abbreviation: 'Neh' },
  { id: 'EST', name: 'Esther', testament: 'OT', category: 'History', chaptersCount: 10, abbreviation: 'Est' },
  { id: 'JOB', name: 'Job', testament: 'OT', category: 'Poetry', chaptersCount: 42, abbreviation: 'Job' },
  { id: 'PSA', name: 'Psalms', testament: 'OT', category: 'Poetry', chaptersCount: 150, abbreviation: 'Psa' },
  { id: 'PRO', name: 'Proverbs', testament: 'OT', category: 'Poetry', chaptersCount: 31, abbreviation: 'Pro' },
  { id: 'ECC', name: 'Ecclesiastes', testament: 'OT', category: 'Poetry', chaptersCount: 12, abbreviation: 'Ecc' },
  { id: 'SNG', name: 'Song of Solomon', testament: 'OT', category: 'Poetry', chaptersCount: 8, abbreviation: 'Sng' },
  { id: 'ISA', name: 'Isaiah', testament: 'OT', category: 'MajorProphets', chaptersCount: 66, abbreviation: 'Isa' },
  { id: 'JER', name: 'Jeremiah', testament: 'OT', category: 'MajorProphets', chaptersCount: 52, abbreviation: 'Jer' },
  { id: 'LAM', name: 'Lamentations', testament: 'OT', category: 'MajorProphets', chaptersCount: 5, abbreviation: 'Lam' },
  { id: 'EZK', name: 'Ezekiel', testament: 'OT', category: 'MajorProphets', chaptersCount: 48, abbreviation: 'Ezk' },
  { id: 'DAN', name: 'Daniel', testament: 'OT', category: 'MajorProphets', chaptersCount: 12, abbreviation: 'Dan' },
  { id: 'HOS', name: 'Hosea', testament: 'OT', category: 'MinorProphets', chaptersCount: 14, abbreviation: 'Hos' },
  { id: 'JOL', name: 'Joel', testament: 'OT', category: 'MinorProphets', chaptersCount: 3, abbreviation: 'Jol' },
  { id: 'AMO', name: 'Amos', testament: 'OT', category: 'MinorProphets', chaptersCount: 9, abbreviation: 'Amo' },
  { id: 'OBA', name: 'Obadiah', testament: 'OT', category: 'MinorProphets', chaptersCount: 1, abbreviation: 'Oba' },
  { id: 'JON', name: 'Jonah', testament: 'OT', category: 'MinorProphets', chaptersCount: 4, abbreviation: 'Jon' },
  { id: 'MIC', name: 'Micah', testament: 'OT', category: 'MinorProphets', chaptersCount: 7, abbreviation: 'Mic' },
  { id: 'NAM', name: 'Nahum', testament: 'OT', category: 'MinorProphets', chaptersCount: 3, abbreviation: 'Nam' },
  { id: 'HAB', name: 'Habakkuk', testament: 'OT', category: 'MinorProphets', chaptersCount: 3, abbreviation: 'Hab' },
  { id: 'ZEP', name: 'Zephaniah', testament: 'OT', category: 'MinorProphets', chaptersCount: 3, abbreviation: 'Zep' },
  { id: 'HAG', name: 'Haggai', testament: 'OT', category: 'MinorProphets', chaptersCount: 2, abbreviation: 'Hag' },
  { id: 'ZEC', name: 'Zechariah', testament: 'OT', category: 'MinorProphets', chaptersCount: 14, abbreviation: 'Zec' },
  { id: 'MAL', name: 'Malachi', testament: 'OT', category: 'MinorProphets', chaptersCount: 4, abbreviation: 'Mal' },

  // New Testament (27 Books)
  { id: 'MAT', name: 'Matthew', testament: 'NT', category: 'Gospels', chaptersCount: 28, abbreviation: 'Mat' },
  { id: 'MRK', name: 'Mark', testament: 'NT', category: 'Gospels', chaptersCount: 16, abbreviation: 'Mrk' },
  { id: 'LUK', name: 'Luke', testament: 'NT', category: 'Gospels', chaptersCount: 24, abbreviation: 'Luk' },
  { id: 'JHN', name: 'John', testament: 'NT', category: 'Gospels', chaptersCount: 21, abbreviation: 'Jhn' },
  { id: 'ACT', name: 'Acts', testament: 'NT', category: 'Acts', chaptersCount: 28, abbreviation: 'Act' },
  { id: 'ROM', name: 'Romans', testament: 'NT', category: 'PaulineEpistles', chaptersCount: 16, abbreviation: 'Rom' },
  { id: '1CO', name: '1 Corinthians', testament: 'NT', category: 'PaulineEpistles', chaptersCount: 16, abbreviation: '1Co' },
  { id: '2CO', name: '2 Corinthians', testament: 'NT', category: 'PaulineEpistles', chaptersCount: 13, abbreviation: '2Co' },
  { id: 'GAL', name: 'Galatians', testament: 'NT', category: 'PaulineEpistles', chaptersCount: 6, abbreviation: 'Gal' },
  { id: 'EPH', name: 'Ephesians', testament: 'NT', category: 'PaulineEpistles', chaptersCount: 6, abbreviation: 'Eph' },
  { id: 'PHP', name: 'Philippians', testament: 'NT', category: 'PaulineEpistles', chaptersCount: 4, abbreviation: 'Php' },
  { id: 'COL', name: 'Colossians', testament: 'NT', category: 'PaulineEpistles', chaptersCount: 4, abbreviation: 'Col' },
  { id: '1TH', name: '1 Thessalonians', testament: 'NT', category: 'PaulineEpistles', chaptersCount: 5, abbreviation: '1Th' },
  { id: '2TH', name: '2 Thessalonians', testament: 'NT', category: 'PaulineEpistles', chaptersCount: 3, abbreviation: '2Th' },
  { id: '1TI', name: '1 Timothy', testament: 'NT', category: 'PaulineEpistles', chaptersCount: 6, abbreviation: '1Ti' },
  { id: '2TI', name: '2 Timothy', testament: 'NT', category: 'PaulineEpistles', chaptersCount: 4, abbreviation: '2Ti' },
  { id: 'TIT', name: 'Titus', testament: 'NT', category: 'PaulineEpistles', chaptersCount: 3, abbreviation: 'Tit' },
  { id: 'PHM', name: 'Philemon', testament: 'NT', category: 'PaulineEpistles', chaptersCount: 1, abbreviation: 'Phm' },
  { id: 'HEB', name: 'Hebrews', testament: 'NT', category: 'GeneralEpistles', chaptersCount: 13, abbreviation: 'Heb' },
  { id: 'JAS', name: 'James', testament: 'NT', category: 'GeneralEpistles', chaptersCount: 5, abbreviation: 'Jas' },
  { id: '1PE', name: '1 Peter', testament: 'NT', category: 'GeneralEpistles', chaptersCount: 5, abbreviation: '1Pe' },
  { id: '2PE', name: '2 Peter', testament: 'NT', category: 'GeneralEpistles', chaptersCount: 3, abbreviation: '2Pe' },
  { id: '1JN', name: '1 John', testament: 'NT', category: 'GeneralEpistles', chaptersCount: 5, abbreviation: '1Jn' },
  { id: '2JN', name: '2 John', testament: 'NT', category: 'GeneralEpistles', chaptersCount: 1, abbreviation: '2Jn' },
  { id: '3JN', name: '3 John', testament: 'NT', category: 'GeneralEpistles', chaptersCount: 1, abbreviation: '3Jn' },
  { id: 'JUD', name: 'Jude', testament: 'NT', category: 'GeneralEpistles', chaptersCount: 1, abbreviation: 'Jud' },
  { id: 'REV', name: 'Revelation', testament: 'NT', category: 'Apocalyptic', chaptersCount: 22, abbreviation: 'Rev' }
];

const verseIndexRecord = bibleFullIndex as Record<string, string>;

/**
 * Get authentic verses for any chapter of any book in the Bible.
 */
export function getChapterVerses(bookId: string, chapter: number): OKFVerseNode[] {
  const book = BIBLE_BOOKS.find(b => b.id === bookId);
  if (!book) return [];

  const verses: OKFVerseNode[] = [];
  let verseNum = 1;

  while (true) {
    const verseId = `${bookId}.${chapter}.${verseNum}`;
    const text = verseIndexRecord[verseId];

    if (!text) {
      // End of verses for this chapter
      break;
    }

    verses.push({
      id: verseId,
      bookId,
      chapter,
      verse: verseNum,
      text,
      tags: [book.category, book.testament]
    });

    verseNum++;
  }

  return verses;
}

export function getVerseById(verseId: string): OKFVerseNode | null {
  const parts = verseId.split('.');
  if (parts.length < 3) return null;

  const [bookId, chapStr, verseStr] = parts;
  const chapter = parseInt(chapStr, 10);
  const verse = parseInt(verseStr, 10);
  const book = BIBLE_BOOKS.find(b => b.id === bookId);

  if (!book) return null;

  const text = verseIndexRecord[verseId];
  if (!text) return null;

  return {
    id: verseId,
    bookId,
    chapter,
    verse,
    text,
    tags: [book.category, book.testament]
  };
}
