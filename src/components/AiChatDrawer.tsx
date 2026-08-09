import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  Settings, 
  Key, 
  Check, 
  Loader2, 
  HelpCircle, 
  BookOpen,
  Share2
} from 'lucide-react';
import { OKFVerseNode, OKFCrossRefEdge } from '../types/okf';
import { TranslationId } from '../services/apiBible';
import { OKFEngine } from '../services/okfEngine';
import { 
  ChatMessage, 
  sendAiScriptureQuery, 
  getStoredAiConfig, 
  saveStoredAiConfig, 
  AiProvider 
} from '../services/aiService';

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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your **Open Scripture AI Assistant**. Select any verse or cross-reference to ask questions, analyze textual meaning, compare translations, or explore historical background.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Settings State
  const [provider, setProvider] = useState<AiProvider>('demo');
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [claudeKey, setClaudeKey] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const config = getStoredAiConfig();
    setProvider(config.provider);
    setGeminiKey(config.geminiKey);
    setClaudeKey(config.claudeKey);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const verseRefText = selectedVerse ? OKFEngine.formatRef(selectedVerse.id) : 'Scripture';

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
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
      const responseText = await sendAiScriptureQuery(query.trim(), selectedVerse, translation, crossRefs);
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Sorry, I encountered an issue processing your query. Please check your API key settings.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredAiConfig(provider, geminiKey.trim(), claudeKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowSettings(false);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px', height: '82vh' }} onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={20} color="var(--accent-gold)" />
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
              Scripture AI Research Assistant
            </span>
            <span style={{ fontSize: '0.68rem', background: 'var(--accent-gold-light)', color: 'var(--accent-gold)', padding: '2px 7px', borderRadius: '4px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              {provider === 'gemini' ? 'Gemini 1.5' : provider === 'claude' ? 'Claude 3.5' : 'Demo Mode'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              className="btn-icon" 
              onClick={() => setShowSettings(!showSettings)} 
              title="AI Provider Settings (Gemini / Claude Keys)"
              style={{ color: showSettings ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
            >
              <Settings size={18} />
            </button>
            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Active Context Banner */}
        <div style={{ padding: '0.5rem 1.5rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
            <BookOpen size={14} />
            <span>Active Passage: {verseRefText} ({translation})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
            <Share2 size={12} />
            <span>{crossRefs.length} Cross-Refs</span>
          </div>
        </div>

        {/* AI Settings Overlay Panel */}
        {showSettings ? (
          <form onSubmit={handleSaveSettings} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Key size={18} color="var(--accent-primary)" />
              AI Model & API Key Configuration
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Select AI Provider:</label>
              <select 
                className="select-control"
                value={provider}
                onChange={(e) => setProvider(e.target.value as AiProvider)}
              >
                <option value="demo">Demo Mode (Built-in Synthesis — No API Key Required)</option>
                <option value="gemini">Google Gemini API (Gemini 1.5 / 2.0 Flash)</option>
                <option value="claude">Anthropic Claude API (Claude 3.5 Sonnet)</option>
              </select>
            </div>

            {provider === 'gemini' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Google Gemini API Key:</label>
                <input 
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Obtain a free API key at <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>aistudio.google.com</a>.</span>
              </div>
            )}

            {provider === 'claude' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Anthropic Claude API Key:</label>
                <input 
                  type="password"
                  placeholder="sk-ant-api..."
                  value={claudeKey}
                  onChange={(e) => setClaudeKey(e.target.value)}
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Obtain an API key at <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)' }}>console.anthropic.com</a>.</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button type="button" className="btn-icon" style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }} onClick={() => setShowSettings(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ padding: '0.45rem 1.1rem' }}>
                {savedSuccess ? <><Check size={16} /> Saved!</> : 'Save Configuration'}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Chat Messages Area */}
            <div className="modal-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  style={{ 
                    display: 'flex', 
                    gap: '0.75rem', 
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%' 
                  }}
                >
                  {msg.sender === 'ai' && (
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                      <Bot size={18} color="var(--accent-primary)" />
                    </div>
                  )}

                  <div 
                    style={{ 
                      background: msg.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-tertiary)', 
                      color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)', 
                      padding: '0.85rem 1.1rem', 
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
                  <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Analyzing scripture and cross-reference graph...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div style={{ padding: '0.5rem 1.25rem', background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
              <button 
                className="btn-icon" 
                style={{ width: 'auto', padding: '3px 9px', height: '26px', fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--accent-primary)', border: '1px solid var(--border-color)' }}
                onClick={() => handleSend(`Explain the deep theological meaning of ${verseRefText}.`)}
              >
                💡 Explain Verse
              </button>

              <button 
                className="btn-icon" 
                style={{ width: 'auto', padding: '3px 9px', height: '26px', fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--accent-gold)', border: '1px solid var(--border-color)' }}
                onClick={() => handleSend(`Analyze the cross-reference connections for ${verseRefText}.`)}
              >
                🔗 Cross-Ref Breakdown
              </button>

              <button 
                className="btn-icon" 
                style={{ width: 'auto', padding: '3px 9px', height: '26px', fontSize: '0.75rem', background: 'var(--bg-secondary)', color: 'var(--cat-parallel)', border: '1px solid var(--border-color)' }}
                onClick={() => handleSend(`Compare the ${translation} translation of ${verseRefText} with KJV, ESV, and NLT.`)}
              >
                📖 Compare Translations
              </button>
            </div>

            {/* Input Form Bar */}
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
                  placeholder={`Ask Gemini or Claude about ${verseRefText}...`}
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
          </>
        )}
      </div>
    </div>
  );
};
