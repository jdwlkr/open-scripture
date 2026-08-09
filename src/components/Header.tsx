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
  Globe,
  Sparkles,
  ChevronDown
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
  onOpenAiChat: () => void;
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
  onOpenAiChat,
  theme,
  onToggleTheme
}) => {
  const currentBook = BIBLE_BOOKS.find(b => b.id === currentBookId) || BIBLE_BOOKS[0];

  return (
    <header className="app-header">
      {/* 1. Left: Brand Title */}
      <div className="brand-logo" onClick={() => onTabChange('workbench')}>
        <BookOpen size={22} />
        <span>Open Scripture</span>
      </div>

      {/* 2. Center: Compact Scripture & Translation Navigation Bar */}
      <div className="nav-controls-wrapper">
        {/* Book Selector */}
        <select 
          className="select-control nav-pill-select"
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

        {/* Chapter Selector */}
        <select 
          className="select-control nav-pill-select"
          value={currentChapter}
          onChange={(e) => onChapterChange(Number(e.target.value))}
        >
          {Array.from({ length: currentBook.chaptersCount }, (_, i) => i + 1).map(c => (
            <option key={c} value={c}>Ch {c}</option>
          ))}
        </select>

        <div className="divider-line" />

        {/* Translation Selector */}
        <div className="translation-pill">
          <Globe size={13} color="var(--accent-primary)" />
          <select 
            className="select-control nav-pill-select translation-select"
            value={translation}
            onChange={(e) => onTranslationChange(e.target.value as TranslationId)}
          >
            {TRANSLATION_OPTIONS.map(t => (
              <option key={t.id} value={t.id}>
                {t.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Segmented View Switcher */}
      <div className="view-segmented-control">
        <button 
          className={`segmented-btn ${activeTab === 'workbench' ? 'active' : ''}`}
          onClick={() => onTabChange('workbench')}
          title="Dual-Pane Research Workbench"
        >
          <Layers size={14} />
          <span>Workbench</span>
        </button>

        <button 
          className={`segmented-btn ${activeTab === 'graph' ? 'active' : ''}`}
          onClick={() => onTabChange('graph')}
          title="SVG Graph Visualizer"
        >
          <Network size={14} />
          <span>OKF Graph</span>
        </button>

        <button 
          className={`segmented-btn ${activeTab === 'parallel' ? 'active' : ''}`}
          onClick={() => onTabChange('parallel')}
          title="Parallel Passage Comparison"
        >
          <Columns size={14} />
          <span>Parallel</span>
        </button>
      </div>

      {/* 4. Right Actions */}
      <div className="header-actions">
        <button 
          className="btn-ai-sparkle" 
          onClick={onOpenAiChat}
          title="Open OKF Assistant Chat"
        >
          <Sparkles size={15} color="#f59e0b" />
          <span>Assistant</span>
        </button>

        <button className="btn-icon" onClick={onOpenSearch} title="Search Scripture (Ctrl+K)">
          <Search size={17} />
        </button>

        <button className="btn-icon" onClick={onOpenExport} title="Export/Import OKF Schema">
          <Download size={17} />
        </button>

        <button className="btn-icon" onClick={onToggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
};
