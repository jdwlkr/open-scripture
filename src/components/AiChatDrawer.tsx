import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  BookOpen, 
  Share2, 
  CheckCircle2, 
  Cpu,
  Layers,
  Database
} from 'lucide-react';
import { OKFVerseNode, OKFCrossRefEdge } from '../types/okf';
import { TranslationId } from '../services/apiBible';
import { OKFEngine } from '../services/okfEngine';
import { queryOkfKnowledgeGraph, OkfChatMessage } from '../services/okfChatEngine';

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVerse: OKFVerseNode | null;
  translation: TranslationId;
  crossRefs: OKFCrossRefEdge[];
}

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({
  isOpen,
  onClose,
  selectedVerse,
  translation,
  crossRefs
}) => {
  const [messages, setMessages] = useState<OkfChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Welcome to the **OKF Knowledge Graph Assistant**! 

Ask any question about scripture, verses, or cross-references. I query the local **Open Knowledge Format (OKF) dataset** (31,100 verses & 344,676 TSK cross-reference edges) 100% deterministically and offline with zero AI/API dependencies!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const verseRefText = selectedVerse ? OKFEngine.formatRef(selectedVerse.id) : 'Scripture Context';

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || loading) return;

    const userMsg: OkfChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verseContext: verseRefText
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setLoading(true);

    try {
      // Execute 100% local deterministic OKF graph query
      const responseText = await queryOkfKnowledgeGraph(query.trim(), selectedVerse, translation);
      
      const assistantMsg: OkfChatMessage = {
        id: `msg-ast-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Error querying OKF dataset index.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px', height: '84vh' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Cpu size={20} color="var(--accent-primary)" />
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
              OKF Knowledge Graph Assistant
            </span>
            <span style={{ fontSize: '0.68rem', background: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '2px 7px', borderRadius: '4px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              100% Local OKF Data
            </span>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Active Context Banner */}
        <div style={{ padding: '0.5rem 1.5rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
            <BookOpen size={14} />
            <span>Active Verse: {verseRefText} ({translation})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-gold)' }}>
            <Share2 size={12} />
            <span>{crossRefs.length} Connected Edges</span>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map(msg => (
            <div 
              key={msg.id} 
              style={{ 
                display: 'flex', 
                gap: '0.75rem', 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%' 
              }}
            >
              {msg.sender === 'assistant' && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <Bot size={18} color="var(--accent-primary)" />
                </div>
              )}

              <div 
                style={{ 
                  background: msg.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-tertiary)', 
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)', 
                  padding: '0.85rem 1.15rem', 
                  borderRadius: 'var(--radius-md)', 
                  fontSize: '0.9rem', 
                  lineHeight: 1.6,
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.text}
                <span style={{ display: 'block', fontSize: '0.68rem', opacity: 0.7, marginTop: '0.4rem', textAlign: 'right' }}>
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border-color)' }}>
                  <User size={16} color="var(--text-secondary)" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="var(--accent-primary)" />
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Querying OKF Knowledge Graph index...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Query Suggestions */}
        <div style={{ padding: '0.5rem 1.25rem', background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
          <button 
            className="btn-icon" 
            style={{ width: 'auto', padding: '3px 9px', height: '26px', fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--accent-primary)', border: '1px solid var(--border-color)' }}
            onClick={() => handleSend(`Show OKF verse node breakdown for ${verseRefText}.`)}
          >
            📖 Node Breakdown
          </button>

          <button 
            className="btn-icon" 
            style={{ width: 'auto', padding: '3px 9px', height: '26px', fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--accent-gold)', border: '1px solid var(--border-color)' }}
            onClick={() => handleSend(`What cross references connect to ${verseRefText}?`)}
          >
            🔗 Cross-Ref Edges
          </button>

          <button 
            className="btn-icon" 
            style={{ width: 'auto', padding: '3px 9px', height: '26px', fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--cat-prophecy)', border: '1px solid var(--border-color)' }}
            onClick={() => handleSend(`Show prophecy fulfillments for ${verseRefText}.`)}
          >
            📜 Prophecy Fulfillments
          </button>

          <button 
            className="btn-icon" 
            style={{ width: 'auto', padding: '3px 9px', height: '26px', fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--cat-parallel)', border: '1px solid var(--border-color)' }}
            onClick={() => handleSend(`Show parallel accounts for ${verseRefText}.`)}
          >
            📊 Parallel Accounts
          </button>
        </div>

        {/* Input Form */}
        <div style={{ padding: '0.85rem 1.25rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <input 
              type="text" 
              placeholder={`Ask OKF Assistant about ${verseRefText} (e.g., "John 3:16", "Show cross references", "Search light")...`}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              style={{ 
                flex: 1, 
                background: 'var(--bg-tertiary)', 
                color: 'var(--text-primary)', 
                border: '1px solid var(--border-color)', 
                padding: '0.65rem 1rem', 
                borderRadius: 'var(--radius-md)', 
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading || !inputQuery.trim()}
              style={{ padding: '0.65rem 1rem' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
