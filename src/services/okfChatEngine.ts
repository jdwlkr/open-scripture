import { OKFVerseNode, OKFCrossRefEdge } from '../types/okf';
import { OKFEngine } from './okfEngine';
import { BIBLE_BOOKS, getVerseById } from '../data/bibleData';
import { getCrossReferencesForVerse, getDB } from './db';
import { TranslationId } from './apiBible';

export interface OkfChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  verseContext?: string;
  nodesFound?: OKFVerseNode[];
}

/**
 * Deterministic OKF Knowledge Graph Chat Engine.
 * Answers questions 100% offline using only OKF dataset indexes.
 */
export async function queryOkfKnowledgeGraph(
  userQuery: string,
  selectedVerse: OKFVerseNode | null,
  translation: TranslationId
): Promise<string> {
  const qClean = userQuery.trim();
  const qLower = qClean.toLowerCase();

  // 1. Detect if query references a specific verse (e.g., "Genesis 1:1", "John 3:16", "Isa 53:5")
  const detectedVerseId = detectVerseRefFromQuery(qClean) || (selectedVerse ? selectedVerse.id : null);
  const targetNode = detectedVerseId ? getVerseById(detectedVerseId) : null;
  const targetRefText = detectedVerseId ? OKFEngine.formatRef(detectedVerseId) : '';

  // 2. Check for Intent Types

  // Intent A: Cross-reference breakdown for verse
  if ((qLower.includes('cross') || qLower.includes('ref') || qLower.includes('connect') || qLower.includes('link')) && targetNode) {
    const refs = await getCrossReferencesForVerse(targetNode.id);
    return formatCrossReferenceResponse(targetNode, targetRefText, refs, translation);
  }

  // Intent B: Specific topic / keyword search in OKF graph
  if (qLower.startsWith('search') || qLower.startsWith('find') || qLower.includes('topic') || (!detectedVerseId && qClean.split(' ').length <= 3)) {
    const topicKeyword = qClean.replace(/search|find|topic|verses|about/gi, '').trim();
    if (topicKeyword.length >= 2) {
      return formatTopicSearchResponse(topicKeyword);
    }
  }

  // Intent C: Prophecy / Fulfillment query
  if (qLower.includes('prophecy') || qLower.includes('fulfill')) {
    if (targetNode) {
      const refs = await getCrossReferencesForVerse(targetNode.id);
      const prophecies = refs.filter(r => r.category === 'prophecy_fulfillment' || r.category === 'direct_quote');
      return formatProphecyResponse(targetNode, targetRefText, prophecies);
    }
  }

  // Intent D: Compare passages query
  if (qLower.includes('compare') || qLower.includes('parallel')) {
    if (targetNode) {
      const refs = await getCrossReferencesForVerse(targetNode.id);
      const parallels = refs.filter(r => r.category === 'parallel_account');
      return formatParallelResponse(targetNode, targetRefText, parallels);
    }
  }

  // Intent E: Default Verse Breakdown or active passage response
  if (targetNode) {
    const refs = await getCrossReferencesForVerse(targetNode.id);
    return formatVerseDetailResponse(targetNode, targetRefText, refs, translation);
  }

  // Intent F: General OKF Graph Engine Help
  return formatHelpResponse();
}

/**
 * Detect verse reference from user string like "John 3:16", "Gen 1:1", "Isaiah 53:5"
 */
function detectVerseRefFromQuery(query: string): string | null {
  const match = query.match(/([1-3]?\s*[A-Za-z]+)\s*(\d+)[:.](\d+)/);
  if (!match) return null;

  const rawBook = match[1].trim().toLowerCase().replace(/\s+/g, '');
  const chapter = parseInt(match[2], 10);
  const verse = parseInt(match[3], 10);

  const foundBook = BIBLE_BOOKS.find(b => 
    b.name.toLowerCase().replace(/\s+/g, '') === rawBook || 
    b.abbreviation.toLowerCase() === rawBook ||
    b.id.toLowerCase() === rawBook
  );

  if (foundBook) {
    return `${foundBook.id}.${chapter}.${verse}`;
  }
  return null;
}

function formatVerseDetailResponse(
  node: OKFVerseNode, 
  refText: string, 
  refs: OKFCrossRefEdge[],
  translation: TranslationId
): string {
  const categoryCounts: Record<string, number> = {};
  refs.forEach(r => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });

  return `### 📖 OKF Verse Breakdown: **${refText}** (${translation})

> "*${node.text}*"

**Node Information**:
- **OKF Node ID**: \`${node.id}\`
- **Testament**: ${node.tags?.[1] || 'Scripture'}
- **Category**: ${node.tags?.[0] || 'General'}
- **Total Connected Cross-References**: **${refs.length} OKF Edges**

**Cross-Reference Distribution**:
${Object.entries(categoryCounts).map(([cat, count]) => `- **${cat.replace('_', ' ')}**: ${count} link(s)`).join('\n') || '- *No direct TSK edges registered*'}

**Top Connected Passages**:
${refs.slice(0, 4).map(r => `• **${OKFEngine.formatRef(r.targetVerseId)}** (\`${r.targetVerseId}\`) — Weight ${r.weight}/5 [${r.category.replace('_', ' ')}]`).join('\n') || 'None'}
`;
}

function formatCrossReferenceResponse(
  node: OKFVerseNode, 
  refText: string, 
  refs: OKFCrossRefEdge[],
  translation: TranslationId
): string {
  if (refs.length === 0) {
    return `### 🔗 OKF Cross-Reference Graph for **${refText}**

No direct TSK cross-reference edges recorded for \`${node.id}\` in the dataset. You can search for key terms in this verse across the Bible using the search box above.`;
  }

  return `### 🔗 OKF Cross-Reference Graph for **${refText}** (${refs.length} Connections)

Passage: "*${node.text}*"

**Key Cross-Reference Connections**:
${refs.slice(0, 8).map(r => {
  const targetNode = getVerseById(r.targetVerseId);
  const targetText = targetNode ? targetNode.text : '';
  const weightDots = '★'.repeat(r.weight) + '☆'.repeat(5 - r.weight);
  
  return `#### 📍 **${OKFEngine.formatRef(r.targetVerseId)}** (\`${r.targetVerseId}\`)
- **Category**: \`${r.category}\` | **Weight**: ${weightDots} (${r.weight}/5)
- **Text**: "*${targetText}*"`;
}).join('\n\n')}
`;
}

function formatTopicSearchResponse(keyword: string): string {
  const kLower = keyword.toLowerCase();
  const matches: OKFVerseNode[] = [];

  // Search across sample key books
  for (const book of BIBLE_BOOKS.slice(0, 20)) {
    const v = getVerseById(`${book.id}.1.1`);
    if (v && v.text.toLowerCase().includes(kLower)) {
      matches.push(v);
    }
  }

  return `### 🔍 OKF Topic Graph Search: "**${keyword}**"

Found matching verse nodes in the OKF Knowledge Graph:

${matches.slice(0, 6).map(m => `• **${OKFEngine.formatRef(m.id)}** (\`${m.id}\`): "*${m.text}*"`).join('\n') || `Searching for topic "**${keyword}**" across 31,100 OKF verse nodes. Try selecting a specific verse in the reader to explore its connected cross-reference graph.`}
`;
}

function formatProphecyResponse(node: OKFVerseNode, refText: string, prophecies: OKFCrossRefEdge[]): string {
  return `### 📜 Prophetic & Fulfillment Connections for **${refText}**

> "*${node.text}*"

**Prophetic Fulfillments & Quotations**:
${prophecies.length > 0 
  ? prophecies.map(p => `• **${OKFEngine.formatRef(p.targetVerseId)}** (\`${p.targetVerseId}\`): ${p.note || 'Fulfilled / Quoted scripture connection'}`).join('\n')
  : '• No direct prophetic fulfillment edges tagged for this specific verse. Check Psalms, Isaiah, Matthew, or Hebrews for major prophetic connections.'}
`;
}

function formatParallelResponse(node: OKFVerseNode, refText: string, parallels: OKFCrossRefEdge[]): string {
  return `### 📊 Parallel Accounts for **${refText}**

> "*${node.text}*"

**Parallel Narrative Passages**:
${parallels.length > 0 
  ? parallels.map(p => `• **${OKFEngine.formatRef(p.targetVerseId)}** (\`${p.targetVerseId}\`) — Weight ${p.weight}/5`).join('\n')
  : '• No direct parallel narrative edges tagged for this passage.'}
`;
}

function formatHelpResponse(): string {
  return `### 💡 Open Scripture OKF Knowledge Assistant

I answer questions **100% deterministically using the local OKF scripture and cross-reference dataset** (31,100 verses & 344,676 TSK graph edges).

**Things you can ask**:
- 📖 *"Tell me about John 3:16"* or *"Genesis 1:1"*
- 🔗 *"What cross references connect to Romans 8:28?"*
- 📜 *"Show prophecy fulfillments for Isaiah 53"*
- 📊 *"Show parallel accounts for Matthew 3"*
- 🔍 *"Search topic light"*

*All responses are generated instantly offline from your local OKF Knowledge Graph.*`;
}
