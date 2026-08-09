const fs = require('fs');
const path = require('path');

const tskPath = '/tmp/cross_references.txt';

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
  if (isNaN(chap) || isNaN(verse)) return null;

  return `${bookId}.${chap}.${verse}`;
}

console.log('Reading full OpenBible / TSK 340,000+ cross-references dataset...');
const tskLines = fs.readFileSync(tskPath, 'utf8').split('\n');

const allEdges = [];
let edgeCounter = 1;
const verseConnectionCounts = new Map();

tskLines.forEach(line => {
  if (!line || line.startsWith('From Verse')) return;
  const cols = line.split('\t');
  if (cols.length < 3) return;

  const fromRef = parseRefString(cols[0]);
  const toRef = parseRefString(cols[1]);
  const votes = parseInt(cols[2], 10) || 0;

  if (fromRef && toRef && votes > -5) { // Filter out negative votes
    let category = 'topical_echo';
    if ((fromRef.startsWith('ISA') || fromRef.startsWith('PSA') || fromRef.startsWith('MIC')) && (toRef.startsWith('MAT') || toRef.startsWith('LUK') || toRef.startsWith('JHN'))) {
      category = 'prophecy_fulfillment';
    } else if (fromRef.substring(0, 3) === toRef.substring(0, 3)) {
      category = 'parallel_account';
    } else if (votes > 100) {
      category = 'direct_quote';
    } else if (votes > 40) {
      category = 'linguistic_link';
    }

    const weight = Math.min(5, Math.max(1, Math.floor((votes + 10) / 25)));

    allEdges.push({
      id: `ref-full-${edgeCounter++}`,
      sourceVerseId: fromRef,
      targetVerseId: toRef,
      category,
      weight,
      note: votes > 0 ? `TSK cross-reference (${votes} votes)` : 'TSK cross-reference'
    });

    verseConnectionCounts.set(fromRef, (verseConnectionCounts.get(fromRef) || 0) + 1);
    verseConnectionCounts.set(toRef, (verseConnectionCounts.get(toRef) || 0) + 1);
  }
});

console.log(`Successfully generated ${allEdges.length} OKF cross-reference edges covering ${verseConnectionCounts.size} verses!`);

// Write full OKF cross references JSON to public directory for fast browser streaming
const outputPath = path.join(__dirname, '../public/okf_full_cross_references.json');
fs.writeFileSync(outputPath, JSON.stringify(allEdges));

const stats = fs.statSync(outputPath);
console.log(`Saved ${outputPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
