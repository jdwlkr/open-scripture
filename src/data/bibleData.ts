import { BibleBook, OKFVerseNode } from '../types/okf';

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

// High quality verse text generator & seed repository for key chapters across the entire Bible
const SEED_VERSES_STORE: Record<string, string> = {
  // Genesis 1
  'GEN.1.1': 'In the beginning God created the heaven and the earth.',
  'GEN.1.2': 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
  'GEN.1.3': 'And God said, Let there be light: and there was light.',
  'GEN.1.4': 'And God saw the light, that it was good: and God divided the light from the darkness.',
  'GEN.1.5': 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.',
  'GEN.1.26': 'And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth.',
  'GEN.1.27': 'So God created man in his own image, in the image of God created he him; male and female created he them.',

  // Exodus 3
  'EXO.3.14': 'And God said unto Moses, I AM THAT I AM: and he said, Thus shalt thou say unto the children of Israel, I AM hath sent me unto you.',

  // Psalms 23 & 110
  'PSA.23.1': 'The LORD is my shepherd; I shall not want.',
  'PSA.23.2': 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
  'PSA.23.3': 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.',
  'PSA.23.4': 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
  'PSA.23.5': 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.',
  'PSA.23.6': 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.',
  'PSA.110.1': 'The LORD said unto my Lord, Sit thou at my right hand, until I make thine enemies thy footstool.',

  // Isaiah 7, 9, 53
  'ISA.7.14': 'Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel.',
  'ISA.9.6': 'For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counseller, The mighty God, The everlasting Father, The Prince of Peace.',
  'ISA.53.1': 'Who hath believed our report? and to whom is the arm of the LORD revealed?',
  'ISA.53.3': 'He is despised and rejected of men; a man of sorrows, and acquainted with grief: and we hid as it were our faces from him; he was despised, and we esteemed him not.',
  'ISA.53.5': 'But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.',
  'ISA.53.6': 'All we like sheep have gone astray; we have turned every one to his own way; and the LORD hath laid on him the iniquity of us all.',

  // Matthew 1, 3, 28
  'MAT.1.21': 'And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins.',
  'MAT.1.23': 'Behold, a virgin shall be with child, and shall bring forth a son, and they shall call his name Emmanuel, which being interpreted is, God with us.',
  'MAT.3.17': 'And lo a voice from heaven, saying, This is my beloved Son, in whom I am well pleased.',
  'MAT.28.19': 'Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:',

  // John 1, 3, 8, 14
  'JHN.1.1': 'In the beginning was the Word, and the Word was with God, and the Word was God.',
  'JHN.1.2': 'The same was in the beginning with God.',
  'JHN.1.3': 'All things were made by him; and without him was not any thing made that was made.',
  'JHN.1.14': 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.',
  'JHN.3.16': 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
  'JHN.3.17': 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.',
  'JHN.8.58': 'Jesus said unto them, Verily, verily, I say unto you, Before Abraham was, I am.',
  'JHN.14.6': 'Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.',

  // Romans 3, 5, 8
  'ROM.3.23': 'For all have sinned, and come short of the glory of God;',
  'ROM.5.8': 'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.',
  'ROM.8.28': 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
  'ROM.8.38': 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,',
  'ROM.8.39': 'Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.',

  // Revelation 1, 21, 22
  'REV.1.8': 'I am Alpha and Omega, the beginning and the ending, saith the Lord, which is, and which was, and which is to come, the Almighty.',
  'REV.21.1': 'And I saw a new heaven and a new earth: for the first heaven and the first earth were passed away; and there was no more sea.',
  'REV.22.13': 'I am Alpha and Omega, the beginning and the end, the first and the last.'
};

/**
 * Get verses for any chapter of any book in the Bible.
 * If specific verse text is in seed, it uses exact text; otherwise generates text structure
 * allowing all 1,189 chapters of all 66 books to be explored and cross-referenced.
 */
export function getChapterVerses(bookId: string, chapter: number): OKFVerseNode[] {
  const book = BIBLE_BOOKS.find(b => b.id === bookId);
  if (!book) return [];

  // Default verse counts per chapter
  const verseCount = 15;
  const verses: OKFVerseNode[] = [];

  for (let v = 1; v <= verseCount; v++) {
    const verseId = `${bookId}.${chapter}.${v}`;
    const seedText = SEED_VERSES_STORE[verseId];
    
    const text = seedText || `Verse text for ${book.name} ${chapter}:${v} — Study cross-references, parallel passages, and OKF knowledge graph nodes.`;

    verses.push({
      id: verseId,
      bookId,
      chapter,
      verse: v,
      text,
      tags: [book.category, book.testament]
    });
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

  const seedText = SEED_VERSES_STORE[verseId];
  const text = seedText || `Verse text for ${book.name} ${chapter}:${verse} — Study cross-references, parallel passages, and OKF knowledge graph nodes.`;

  return {
    id: verseId,
    bookId,
    chapter,
    verse,
    text,
    tags: [book.category, book.testament]
  };
}
