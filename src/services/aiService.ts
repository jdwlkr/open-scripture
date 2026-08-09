import { OKFVerseNode, OKFCrossRefEdge } from '../types/okf';
import { TranslationId } from './apiBible';
import { OKFEngine } from './okfEngine';

export type AiProvider = 'gemini' | 'claude' | 'demo';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  verseContext?: string;
}

const LOCAL_STORAGE_GEMINI_KEY = 'open_scripture_gemini_key';
const LOCAL_STORAGE_CLAUDE_KEY = 'open_scripture_claude_key';
const LOCAL_STORAGE_PROVIDER = 'open_scripture_ai_provider';

export function getStoredAiConfig(): { provider: AiProvider; geminiKey: string; claudeKey: string } {
  return {
    provider: (localStorage.getItem(LOCAL_STORAGE_PROVIDER) as AiProvider) || 'demo',
    geminiKey: localStorage.getItem(LOCAL_STORAGE_GEMINI_KEY) || '',
    claudeKey: localStorage.getItem(LOCAL_STORAGE_CLAUDE_KEY) || ''
  };
}

export function saveStoredAiConfig(provider: AiProvider, geminiKey: string, claudeKey: string) {
  localStorage.setItem(LOCAL_STORAGE_PROVIDER, provider);
  localStorage.setItem(LOCAL_STORAGE_GEMINI_KEY, geminiKey);
  localStorage.setItem(LOCAL_STORAGE_CLAUDE_KEY, claudeKey);
}

/**
 * Generate AI study response using Gemini, Claude, or Demo synthesis
 */
export async function sendAiScriptureQuery(
  userQuery: string,
  selectedVerse: OKFVerseNode | null,
  translation: TranslationId,
  crossRefs: OKFCrossRefEdge[] = []
): Promise<string> {
  const config = getStoredAiConfig();
  const verseRef = selectedVerse ? OKFEngine.formatRef(selectedVerse.id) : 'Scripture Context';
  const verseText = selectedVerse ? selectedVerse.text : '';

  const systemContext = `You are Open Scripture AI, an expert theological and biblical research assistant.
Active Passage: ${verseRef} (${translation} Translation)
Verse Text: "${verseText}"
OKF Cross-References Count: ${crossRefs.length} connected passages.
Provide deep, scholarly, insightful, and accessible answers exploring textual meaning, cross-reference connections, original Hebrew/Greek nuances, historical context, and translation comparisons.`;

  // 1. Google Gemini API
  if (config.provider === 'gemini' && config.geminiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${systemContext}\n\nUser Question: ${userQuery}` }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) return candidate;
      }
    } catch (err) {
      console.warn('Gemini API query error, falling back to synthesis:', err);
    }
  }

  // 2. Anthropic Claude API
  if (config.provider === 'claude' && config.claudeKey) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': config.claudeKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            { role: 'user', content: `${systemContext}\n\nUser Question: ${userQuery}` }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data.content?.[0]?.text;
        if (candidate) return candidate;
      }
    } catch (err) {
      console.warn('Claude API query error, falling back to synthesis:', err);
    }
  }

  // 3. Intelligent Demo Mode Response Synthesis
  return generateDemoSynthesis(userQuery, verseRef, verseText, translation, crossRefs);
}

function generateDemoSynthesis(
  query: string, 
  ref: string, 
  text: string, 
  translation: TranslationId,
  refs: OKFCrossRefEdge[]
): string {
  const qLower = query.toLowerCase();

  if (qLower.includes('cross') || qLower.includes('connect') || qLower.includes('link')) {
    return `### 🔗 Cross-Reference Analysis for ${ref}

The text of **${ref}** ("*${text}*") connects directly to ${refs.length} registered OKF knowledge graph passages.

- **Theological Thread**: This passage acts as a cornerstone node linking divine revelation with subsequent scripture fulfillments.
- **Key Parallels**:
  ${refs.slice(0, 3).map(r => `• **${OKFEngine.formatRef(r.targetVerseId)}** (${r.category.replace('_', ' ')}): Connection Weight ${r.weight}/5.`).join('\n  ')}

*Tip: You can add your official Gemini API Key or Claude API Key in AI Settings for live unbounded AI reasoning!*`;
  }

  if (qLower.includes('compare') || qLower.includes('version') || qLower.includes('translation')) {
    return `### 📖 Translation Comparison for ${ref} (${translation})

Evaluating **${ref}** across major translations:

- **${translation} (Selected)**: "*${text}*"
- **KJV (Literal Traditional)**: Emphasizes formal equivalence and traditional poetic cadence.
- **ESV (Literal Modern)**: Maintains word-for-word precision with contemporary English grammar.
- **NLT (Dynamic)**: Focuses on thought-for-thought clarity for accessible reading.

*In Hebrew/Greek textual analysis, this verse emphasizes divine covenant fidelity and active faith.*`;
  }

  return `### 📜 Scripture Study Insights for ${ref}

**Active Passage**: ${ref} (${translation} Translation)  
> "*${text}*"

1. **Context & Theme**: This passage addresses core biblical themes of divine sovereignty, covenant relationship, and spiritual renewal.
2. **Textual Nuance**: In the original language context, key terms here highlight unconditional grace and purposeful creation.
3. **Cross-Reference Network**: Linked to ${refs.length} parallel passages across the Old and New Testaments in the OKF Knowledge Graph.

*(Add your Gemini or Claude API key in AI Settings to unlock custom deep-dive answers!)*`;
}
