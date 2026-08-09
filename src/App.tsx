import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ScriptureReader } from './components/ScriptureReader';
import { InspectorPanel } from './components/InspectorPanel';
import { GraphVisualizer } from './components/GraphVisualizer';
import { ParallelView } from './components/ParallelView';
import { SearchModal } from './components/SearchModal';
import { OKFExporter } from './components/OKFExporter';
import { OKFVerseNode } from './types/okf';
import { TranslationId } from './services/apiBible';
import { getChapterVerses, getVerseById } from './data/bibleData';
import { initializeDatabase } from './services/db';

export const App: React.FC = () => {
  const [currentBookId, setCurrentBookId] = useState<string>('GEN');
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [translation, setTranslation] = useState<TranslationId>('KJV');
  const [selectedVerse, setSelectedVerse] = useState<OKFVerseNode | null>(null);
  
  const [activeTab, setActiveTab] = useState<'workbench' | 'graph' | 'parallel'>('workbench');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Initialize DB and default verse selection on mount
  useEffect(() => {
    initializeDatabase();
    
    // Set default selected verse to Genesis 1:1
    const defaultNode = getVerseById('GEN.1.1');
    if (defaultNode) {
      setSelectedVerse(defaultNode);
    }
  }, []);

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
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

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
    </div>
  );
};
