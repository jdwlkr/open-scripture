import React, { useEffect, useState } from 'react';
import { 
  Bookmark, 
  Share2, 
  Tag, 
  Plus, 
  FileText, 
  ExternalLink, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';
import { OKFVerseNode, OKFCrossRefEdge, UserAnnotation } from '../types/okf';
import { getCrossReferencesForVerse, getAnnotationsForVerse, saveAnnotation, toggleBookmark, isBookmarked } from '../services/db';
import { OKFEngine } from '../services/okfEngine';
import { getVerseById } from '../data/bibleData';

interface InspectorPanelProps {
  selectedVerse: OKFVerseNode | null;
  onNavigateToVerse: (verseId: string) => void;
  onOpenAiChat?: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedVerse,
  onNavigateToVerse,
  onOpenAiChat
}) => {
  const [crossRefs, setCrossRefs] = useState<OKFCrossRefEdge[]>([]);
  const [annotations, setAnnotations] = useState<UserAnnotation[]>([]);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'crossrefs' | 'notes' | 'okf_json'>('crossrefs');

  useEffect(() => {
    if (!selectedVerse) return;

    const loadVerseData = async () => {
      const refs = await getCrossReferencesForVerse(selectedVerse.id);
      setCrossRefs(refs);

      const notes = await getAnnotationsForVerse(selectedVerse.id);
      setAnnotations(notes);

      const bm = await isBookmarked(selectedVerse.id);
      setBookmarked(bm);
    };

    loadVerseData();
  }, [selectedVerse]);

  const handleToggleBookmark = async () => {
    if (!selectedVerse) return;
    const newState = await toggleBookmark(selectedVerse.id);
    setBookmarked(newState);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVerse || !newNoteText.trim()) return;

    const saved = await saveAnnotation(selectedVerse.id, newNoteText.trim(), ['Study']);
    setAnnotations(prev => [saved, ...prev]);
    setNewNoteText('');
  };

  if (!selectedVerse) {
    return (
      <div className="inspector-pane" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>
          <Share2 size={42} style={{ marginBottom: '1rem', color: 'var(--accent-primary)', opacity: 0.7 }} />
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Open Scripture OKF Inspector</h3>
          <p style={{ fontSize: '0.875rem' }}>Select any verse in the reader to explore its knowledge graph nodes, cross-references, and parallel passages.</p>
        </div>
      </div>
    );
  }

  const verseRefFormatted = OKFEngine.formatRef(selectedVerse.id);

  return (
    <aside className="inspector-pane">
      {/* Inspector Top Bar */}
      <div className="inspector-header">
        <div className="inspector-title">
          <Sparkles size={18} color="var(--accent-gold)" />
          <span>OKF Knowledge Inspector</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button 
            className="btn-icon" 
            onClick={handleToggleBookmark}
            style={{ color: bookmarked ? 'var(--accent-gold)' : 'var(--text-secondary)' }}
            title={bookmarked ? 'Remove Bookmark' : 'Bookmark Verse'}
          >
            <Bookmark size={18} fill={bookmarked ? 'var(--accent-gold)' : 'none'} />
          </button>
        </div>
      </div>

      <div className="inspector-body">
        {/* Selected Verse OKF Node Card */}
        <div className="node-card">
          <div className="node-card-header">
            <span className="node-ref-tag">{verseRefFormatted}</span>
            <span className="okf-id-badge">{selectedVerse.id}</span>
          </div>
          <p className="node-verse-text">"{selectedVerse.text}"</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {selectedVerse.tags?.map((t, idx) => (
                <span key={idx} style={{ fontSize: '0.68rem', background: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  #{t}
                </span>
              ))}
            </div>

            {onOpenAiChat && (
              <button 
                className="btn-primary" 
                onClick={onOpenAiChat}
                style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                title="Ask AI to analyze this verse"
              >
                <Sparkles size={12} color="#f59e0b" /> Ask AI
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '1rem' }}>
          <button 
            style={{ 
              padding: '0.5rem 0', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'crossrefs' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'crossrefs' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onClick={() => setActiveTab('crossrefs')}
          >
            <Share2 size={14} />
            Cross-Refs ({crossRefs.length})
          </button>

          <button 
            style={{ 
              padding: '0.5rem 0', 
              background: 'none', 
              border: 'none', 
              borderBottom: activeTab === 'notes' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'notes' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onClick={() => setActiveTab('notes')}
          >
            <FileText size={14} />
            Study Notes ({annotations.length})
          </button>
        </div>

        {/* Tab 1: Cross-References */}
        {activeTab === 'crossrefs' && (
          <div className="crossref-list">
            {crossRefs.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Info size={24} style={{ marginBottom: '0.5rem', opacity: 0.6 }} />
                <p>No direct cross-references recorded for {verseRefFormatted} yet.</p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.4rem' }}>Use the search button above to explore all related topics across the Bible.</p>
              </div>
            ) : (
              crossRefs.map(ref => {
                const targetNode = getVerseById(ref.targetVerseId);
                const targetRefText = OKFEngine.formatRef(ref.targetVerseId);

                return (
                  <div 
                    key={ref.id} 
                    className="crossref-card"
                    onClick={() => onNavigateToVerse(ref.targetVerseId)}
                  >
                    <div className="crossref-card-head">
                      <span className="crossref-target-ref">{targetRefText}</span>
                      <span className={`category-pill ${ref.category}`}>
                        {ref.category.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="crossref-text-preview">
                      {targetNode ? `"${targetNode.text}"` : 'Loading scripture passage...'}
                    </p>

                    {ref.note && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontStyle: 'italic' }}>
                        💡 {ref.note}
                      </p>
                    )}

                    {/* Weight Bar Dots */}
                    <div className="weight-bar-container" title={`Connection Weight: ${ref.weight}/5`}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginRight: '4px' }}>Weight</span>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`weight-dot ${i < ref.weight ? 'active' : ''}`} />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Personal Study Notes */}
        {activeTab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <textarea 
                rows={3}
                placeholder={`Write research insights for ${verseRefFormatted}...`}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                style={{ 
                  background: 'var(--bg-tertiary)', 
                  color: 'var(--text-primary)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '0.75rem', 
                  fontFamily: 'var(--font-sans)', 
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
              />
              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end', padding: '0.4rem 0.85rem' }}>
                <Plus size={14} /> Add Note
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {annotations.map(a => (
                <div key={a.id} style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{a.note}</p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block' }}>
                    {new Date(a.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
