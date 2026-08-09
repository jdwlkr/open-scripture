import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ScriptureReader } from './components/ScriptureReader';
import { InspectorPanel } from './components/InspectorPanel';
import { GraphVisualizer } from './components/GraphVisualizer';
import { ParallelView } from './components/ParallelView';
import { SearchModal } from './components/SearchModal';
import { OKFExporter } from './components/OKFExporter';
import { AiChatDrawer } from './components/AiChatDrawer';
import { OKFVerseNode, OKFCrossRefEdge } from './types/okf';
import { TranslationId } from './services/apiBible';
import { getVerseById } from './data/bibleData';
import { initializeDatabase, getCrossReferencesForVerse } from './services/db';
import { Database } from 'lucide-react';

export const App: React.FC = () => {
  const [currentBookId, setCurrentBookId] = useState<string>('GEN');
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [translation, setTranslation] = useState<TranslationId>('KJV');
  const [selectedVerse, setSelectedVerse] = useState<OKFVerseNode | null>(null);
  const [activeCrossRefs, setActiveCrossRefs] = useState<OKFCrossRefEdge[]>([]);
  
  const [activeTab, setActiveTab] = useState<'workbench' | 'graph' | 'parallel'>('workbench');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [indexProgress, setIndexProgress] = useState<{ current: number; total: number } | null>(null);

  // Initialize DB and default verse selection on mount
  useEffect(() => {
    initializeDatabase((current, total) => {
      setIndexProgress({ current, total });
      if (current >= total) {
        setTimeout(() => setIndexProgress(null), 2000);
      }
    });
    
    // Set default selected verse to Genesis 1:1
    const defaultNode = getVerseById('GEN.1.1');
    if (defaultNode) {
      setSelectedVerse(defaultNode);
    }
  }, []);

  // Fetch cross references when selected verse changes
  useEffect(() => {
    if (!selectedVerse) return;
    const fetchRefs = async () => {
      const refs = await getCrossReferencesForVerse(selectedVerse.id);
      setActiveCrossRefs(refs);
    };
    fetchRefs();
  }, [selectedVerse]);

  // Update root document data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigateToVerseId = (verseId: string) => {
    const parts = verseId.split('.');
    if (parts.length >= 3) {
      const [bookId, chapStr] = parts;
      const chapter = parseInt(chapStr, 10);
      setCurrentBookId(bookId);
      setCurrentChapter(chapter);

      const targetNode = getVerseById(verseId);
      if (targetNode) {
        setSelectedVerse(targetNode);
      }
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      {/* App Navigation Header */}
      <Header 
        currentBookId={currentBookId}
        currentChapter={currentChapter}
        onBookChange={setCurrentBookId}
        onChapterChange={setCurrentChapter}
        translation={translation}
        onTranslationChange={setTranslation}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAiChat={() => setIsAiChatOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

      {/* Indexing Progress Notification Banner */}
      {indexProgress && (
        <div style={{ background: 'var(--accent-light)', borderBottom: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.4rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
            <span>Indexing 344,676 OKF Bible Cross-References into IndexedDB... ({Math.round((indexProgress.current / indexProgress.total) * 100)}%)</span>
          </div>
          <span>{indexProgress.current.toLocaleString()} / {indexProgress.total.toLocaleString()} edges</span>
        </div>
      )}

      {/* App Workspace Body */}
      <main className="app-workspace">
        {activeTab === 'workbench' && (
          <>
            <ScriptureReader 
              bookId={currentBookId}
              chapter={currentChapter}
              translation={translation}
              selectedVerseId={selectedVerse ? selectedVerse.id : ''}
              onSelectVerse={setSelectedVerse}
              onChapterChange={setCurrentChapter}
            />
            <InspectorPanel 
              selectedVerse={selectedVerse}
              onNavigateToVerse={handleNavigateToVerseId}
              onOpenAiChat={() => setIsAiChatOpen(true)}
            />
          </>
        )}

        {activeTab === 'graph' && (
          <GraphVisualizer 
            rootVerseId={selectedVerse ? selectedVerse.id : 'GEN.1.1'}
            onSelectVerse={(verseId) => {
              handleNavigateToVerseId(verseId);
              setActiveTab('workbench');
            }}
          />
        )}

        {activeTab === 'parallel' && (
          <ParallelView />
        )}
      </main>

      {/* Search Dialog Modal */}
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(bookId, chapter, verseId) => {
          setCurrentBookId(bookId);
          setCurrentChapter(chapter);
          const node = getVerseById(verseId);
          if (node) setSelectedVerse(node);
        }}
      />

      {/* OKF JSON Exporter/Importer Modal */}
      <OKFExporter 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* AI Research Assistant Chat Drawer */}
      <AiChatDrawer 
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        selectedVerse={selectedVerse}
        translation={translation}
        crossRefs={activeCrossRefs}
      />
    </div>
  );
};
