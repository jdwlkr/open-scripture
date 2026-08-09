const fs = require('fs');
const path = require('path');

const kjvPath = path.join(__dirname, '../src/data/kjv.json');
const tskPath = '/tmp/cross_references.txt';

try {
  console.log('Loading KJV JSON dataset...');
  let rawKjv = fs.readFileSync(kjvPath, 'utf8');
  if (rawKjv.charCodeAt(0) === 0xFEFF) {
    rawKjv = rawKjv.slice(1);
  }
  const kjvData = JSON.parse(rawKjv);

  // Book abbreviation mapping for 66 books
  const bookNameMap = {
    'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM', 'Deuteronomy': 'DEU',
    'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT', '1 Samuel': '1SA', '2 Samuel': '2SA',
    '1 Kings': '1KI', '2 Kings': '2KI', '1 Chronicles': '1CH', '2 Chronicles': '2CH',
    'Ezra': 'EZR', 'Nehemiah': 'NEH', 'Esther': 'EST', 'Job': 'JOB', 'Psalms': 'PSA',
    'Proverbs': 'PRO', 'Ecclesiastes': 'ECC', 'Song of Solomon': 'SNG', 'Isaiah': 'ISA',
    'Jeremiah': 'JER', 'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN', 'Hosea': 'HOS',
    'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA', 'Jonah': 'JON', 'Micah': 'MIC',
    'Nahum': 'NAM', 'Habakkuk': 'HAB', 'Zephaniah': 'ZEP', 'Haggai': 'HAG', 'Zechariah': 'ZEC',
    'Malachi': 'MAL', 'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN',
    'Acts': 'ACT', 'Romans': 'ROM', '1 Corinthians': '1CO', '2 Corinthians': '2CO',
    'Galatians': 'GAL', 'Ephesians': 'EPH', 'Philippians': 'PHP', 'Colossians': 'COL',
    '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI', '2 Timothy': '2TI',
    'Titus': 'TIT', 'Philemon': 'PHM', 'Hebrews': 'HEB', 'James': 'JAS', '1 Peter': '1PE',
    '2 Peter': '2PE', '1 John': '1JN', '2 John': '2JN', '3 John': '3JN', 'Jude': 'JUD',
    'Revelation': 'REV'
  };

  const openBibleBookMap = {
    'Gen': 'GEN', 'Exod': 'EXO', 'Lev': 'LEV', 'Num': 'NUM', 'Deut': 'DEU',
    'Josh': 'JOS', 'Judg': 'JDG', 'Ruth': 'RUT', '1Sam': '1SA', '2Sam': '2SA',
    '1Kgs': '1KI', '2Kgs': '2KI', '1Chr': '1CH', '2Chr': '2CH', 'Ezra': 'EZR',
    'Neh': 'NEH', 'Esth': 'EST', 'Job': 'JOB', 'Ps': 'PSA', 'Prov': 'PRO',
    'Eccl': 'ECC', 'Song': 'SNG', 'Isa': 'ISA', 'Jer': 'JER', 'Lam': 'LAM',
    'Ezek': 'EZK', 'Dan': 'DAN', 'Hos': 'HOS', 'Joel': 'JOL', 'Amos': 'AMO',
    'Obad': 'OBA', 'Jonah': 'JON', 'Mic': 'MIC', 'Nah': 'NAM', 'Hab': 'HAB',
    'Zeph': 'ZEP', 'Hag': 'HAG', 'Zech': 'ZEC', 'Mal': 'MAL', 'Matt': 'MAT',
    'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN', 'Acts': 'ACT', 'Rom': 'ROM',
    '1Cor': '1CO', '2Cor': '2CO', 'Gal': 'GAL', 'Eph': 'EPH', 'Phil': 'PHP',
    'Col': 'COL', '1Thess': '1TH', '2Thess': '2TH', '1Tim': '1TI', '2Tim': '2TI',
    'Titus': 'TIT', 'Phlm': 'PHM', 'Heb': 'HEB', 'Jas': 'JAS', '1Pet': '1PE',
    '2Pet': '2PE', '1John': '1JN', '2John': '2JN', '3John': '3JN', 'Jude': 'JUD',
    'Rev': 'REV'
  };

  const fullVerseMap = {};
  let totalVerseCount = 0;

  kjvData.forEach(bookObj => {
    const bookId = bookNameMap[bookObj.name];
    if (!bookId) return;

    bookObj.chapters.forEach((chapterVerses, cIdx) => {
      const chapterNum = cIdx + 1;
      chapterVerses.forEach((verseText, vIdx) => {
        const verseNum = vIdx + 1;
        const verseId = `${bookId}.${chapterNum}.${verseNum}`;
        fullVerseMap[verseId] = verseText.trim();
        totalVerseCount++;
      });
    });
  });

  console.log(`Parsed total of ${totalVerseCount} authentic Bible verses across all 66 books!`);

  // Write full verse index to public data file for fast loading
  fs.writeFileSync(
    path.join(__dirname, '../public/bible_full_index.json'),
    JSON.stringify(fullVerseMap)
  );

  // Parse OpenBible TSK cross references
  console.log('Parsing TSK cross-references...');
  const tskLines = fs.readFileSync(tskPath, 'utf8').split('\n');
  const parsedEdges = [];
  let edgeIdCounter = 1;

  function parseRefString(refStr) {
    if (!refStr) return null;
    const cleanStr = refStr.split('-')[0].trim();
    const parts = cleanStr.split('.');
    if (parts.length < 3) return null;

    const obBook = parts[0];
    const bookId = openBibleBookMap[obBook];
    if (!bookId) return null;

    const chap = parseInt(parts[1], 10);
    const verse = parseInt(parts[2], 10);
    return `${bookId}.${chap}.${verse}`;
  }

  tskLines.forEach(line => {
    if (!line || line.startsWith('From Verse')) return;
    const cols = line.split('\t');
    if (cols.length < 3) return;

    const fromRef = parseRefString(cols[0]);
    const toRef = parseRefString(cols[1]);
    const votes = parseInt(cols[2], 10) || 0;

    if (fromRef && toRef && votes > 10 && parsedEdges.length < 3000) {
      let category = 'topical_echo';
      if (fromRef.startsWith('ISA') && toRef.startsWith('MAT')) category = 'prophecy_fulfillment';
      else if (fromRef.substring(0, 3) === toRef.substring(0, 3)) category = 'parallel_account';
      else if (votes > 150) category = 'direct_quote';
      else if (votes > 60) category = 'linguistic_link';

      const weight = Math.min(5, Math.max(1, Math.floor(votes / 30)));

      parsedEdges.push({
        id: `ref-tsk-${edgeIdCounter++}`,
        sourceVerseId: fromRef,
        targetVerseId: toRef,
        category,
        weight,
        note: `Treasury of Scripture Knowledge cross-reference (${votes} votes)`
      });
    }
  });

  console.log(`Generated ${parsedEdges.length} high-confidence OKF cross-reference edges from TSK!`);

  // Write cross ref data module
  const crossRefTs = `import { OKFCrossRefEdge } from '../types/okf';

export const INITIAL_CROSS_REFERENCES: OKFCrossRefEdge[] = ${JSON.stringify(parsedEdges, null, 2)};
`;

  fs.writeFileSync(
    path.join(__dirname, '../src/data/crossRefData.ts'),
    crossRefTs
  );

  console.log('Successfully updated datasets!');
} catch (err) {
  console.error('ERROR IN SCRIPT:', err);
  process.exit(1);
}
