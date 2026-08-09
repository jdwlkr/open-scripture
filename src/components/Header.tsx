import React from 'react';
import { 
  BookOpen, 
  Network, 
  Columns, 
  Search, 
  Download, 
  Sun, 
  Moon, 
  Layers,
  Globe
} from 'lucide-react';
import { BIBLE_BOOKS } from '../data/bibleData';
import { TRANSLATION_OPTIONS, TranslationId } from '../services/apiBible';

interface HeaderProps {
  currentBookId: string;
  currentChapter: number;
  onBookChange: (bookId: string) => void;
  onChapterChange: (chapter: number) => void;
  translation: TranslationId;
  onTranslationChange: (t: TranslationId) => void;
  activeTab: 'workbench' | 'graph' | 'parallel';
  onTabChange: (tab: 'workbench' | 'graph' | 'parallel') => void;
  onOpenSearch: () => void;
  onOpenExport: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentBookId,
  currentChapter,
  onBookChange,
  onChapterChange,
  translation,
  onTranslationChange,
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenExport,
  theme,
  onToggleTheme
}) => {
  const currentBook = BIBLE_BOOKS.find(b => b.id === currentBookId) || BIBLE_BOOKS[0];

  return (
    <header className="app-header">
      {/* Brand Title */}
      <div className="brand-logo" onClick={() => onTabChange('workbench')}>
        <BookOpen size={24} />
        <span>Open Scripture</span>
        <span className="brand-tag">OKF 1.0</span>
      </div>

      {/* Book & Chapter Fast Selector */}
      <div className="scripture-nav-bar" style={{ padding: 0, border: 'none', background: 'transparent' }}>
        <div className="select-group">
          <select 
            className="select-control"
            value={currentBookId}
            onChange={(e) => {
              onBookChange(e.target.value);
              onChapterChange(1);
            }}
          >
            <optgroup label="Old Testament">
              {BIBLE_BOOKS.filter(b => b.testament === 'OT').map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </optgroup>
            <optgroup label="New Testament">
              {BIBLE_BOOKS.filter(b => b.testament === 'NT').map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </optgroup>
          </select>

          <select 
            className="select-control"
            value={currentChapter}
            onChange={(e) => onChapterChange(Number(e.target.value))}
          >
            {Array.from({ length: currentBook.chaptersCount }, (_, i) => i + 1).map(c => (
              <option key={c} value={c}>Chapter {c}</option>
            ))}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '0.5rem' }}>
            <Globe size={14} color="var(--accent-primary)" />
            <select 
              className="select-control"
              style={{ fontWeight: 700, color: 'var(--accent-primary)', borderColor: 'rgba(99, 102, 241, 0.4)' }}
              value={translation}
              onChange={(e) => onTranslationChange(e.target.value as TranslationId)}
            >
              {TRANSLATION_OPTIONS.map(t => (
                <option key={t.id} value={t.id}>
                  {t.shortName} — {t.name} {t.isApi ? '(API)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* View Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: 'var(--radius-md)' }}>
        <button 
          className={`btn-icon ${activeTab === 'workbench' ? 'selected' : ''}`}
          style={{ 
            width: 'auto', 
            padding: '0.4rem 0.75rem', 
            height: '32px', 
            fontSize: '0.85rem',
            background: activeTab === 'workbench' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'workbench' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none'
          }}
          onClick={() => onTabChange('workbench')}
          title="Dual-Pane Research Workbench"
        >
          <Layers size={16} style={{ marginRight: '6px' }} />
          Workbench
        </button>

        <button 
          className={`btn-icon ${activeTab === 'graph' ? 'selected' : ''}`}
          style={{ 
            width: 'auto', 
            padding: '0.4rem 0.75rem', 
            height: '32px', 
            fontSize: '0.85rem',
            background: activeTab === 'graph' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'graph' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none'
          }}
          onClick={() => onTabChange('graph')}
          title="SVG Graph Visualizer"
        >
          <Network size={16} style={{ marginRight: '6px' }} />
          OKF Graph
        </button>

        <button 
          className={`btn-icon ${activeTab === 'parallel' ? 'selected' : ''}`}
          style={{ 
            width: 'auto', 
            padding: '0.4rem 0.75rem', 
            height: '32px', 
            fontSize: '0.85rem',
            background: activeTab === 'parallel' ? 'var(--accent-primary)' : 'transparent',
            color: activeTab === 'parallel' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none'
          }}
          onClick={() => onTabChange('parallel')}
          title="Parallel Passage Comparison"
        >
          <Columns size={16} style={{ marginRight: '6px' }} />
          Parallel
        </button>
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        <button className="btn-icon" onClick={onOpenSearch} title="Search Scripture & Cross-References (Ctrl+K)">
          <Search size={18} />
        </button>

        <button className="btn-icon" onClick={onOpenExport} title="Export/Import OKF Knowledge Graph">
          <Download size={18} />
        </button>

        <button className="btn-icon" onClick={onToggleTheme} title="Toggle Dark/Light Mode">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};
