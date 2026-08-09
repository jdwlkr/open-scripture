import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Share2, ZoomIn, ZoomOut, Globe, Loader2 } from 'lucide-react';
import { OKFVerseNode } from '../types/okf';
import { BIBLE_BOOKS } from '../data/bibleData';
import { getCrossReferencesForVerse } from '../services/db';
import { TranslationId, getTranslationChapterVerses, TRANSLATION_OPTIONS } from '../services/apiBible';

interface ScriptureReaderProps {
  bookId: string;
  chapter: number;
  translation: TranslationId;
  selectedVerseId: string;
  onSelectVerse: (verseNode: OKFVerseNode) => void;
  onChapterChange: (chapter: number) => void;
}

export const ScriptureReader: React.FC<ScriptureReaderProps> = ({
  bookId,
  chapter,
  translation,
  selectedVerseId,
  onSelectVerse,
  onChapterChange
}) => {
  const [verses, setVerses] = useState<OKFVerseNode[]>([]);
  const [crossRefCounts, setCrossRefCounts] = useState<Record<string, number>>({});
  const [fontSize, setFontSize] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(false);

  const book = BIBLE_BOOKS.find(b => b.id === bookId) || BIBLE_BOOKS[0];
  const activeTranslation = TRANSLATION_OPTIONS.find(t => t.id === translation) || TRANSLATION_OPTIONS[0];

  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);

    const loadData = async () => {
      const loadedVerses = await getTranslationChapterVerses(bookId, chapter, translation);
      if (isSubscribed) {
        setVerses(loadedVerses);
        setLoading(false);
      }

      // Fetch cross-reference counts for all verses in this chapter
      const counts: Record<string, number> = {};
      for (const v of loadedVerses) {
        const refs = await getCrossReferencesForVerse(v.id);
        if (refs.length > 0) {
          counts[v.id] = refs.length;
        }
      }
      if (isSubscribed) {
        setCrossRefCounts(counts);
      }
    };

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [bookId, chapter, translation]);

  const handlePrevChapter = () => {
    if (chapter > 1) {
      onChapterChange(chapter - 1);
    }
  };

  const handleNextChapter = () => {
    if (chapter < book.chaptersCount) {
      onChapterChange(chapter + 1);
    }
  };

  return (
    <div className="reader-pane">
      {/* Chapter Controls Bar */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0.6rem 1.5rem', 
          background: 'var(--bg-secondary)', 
          borderBottom: '1px solid var(--border-color)' 
        }}
      >
        <button 
          className="btn-icon" 
          onClick={handlePrevChapter} 
          disabled={chapter <= 1}
          style={{ opacity: chapter <= 1 ? 0.4 : 1 }}
          title="Previous Chapter"
        >
          <ChevronLeft size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {book.name} {chapter} of {book.chaptersCount}
          </span>

          <span 
            style={{ 
              fontSize: '0.7rem', 
              fontFamily: 'var(--font-mono)', 
              background: 'var(--accent-light)', 
              color: 'var(--accent-primary)', 
              padding: '2px 7px', 
              borderRadius: '4px', 
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Globe size={11} />
            {activeTranslation.shortName}
          </span>

          {loading && (
            <Loader2 size={14} className="spin" style={{ color: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
          )}

          <div style={{ display: 'flex', gap: '4px' }}>
            <button className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => setFontSize(f => Math.max(0.9, f - 0.1))} title="Decrease Font Size">
              <ZoomOut size={14} />
            </button>
            <button className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => setFontSize(f => Math.min(1.8, f + 0.1))} title="Increase Font Size">
              <ZoomIn size={14} />
            </button>
          </div>
        </div>

        <button 
          className="btn-icon" 
          onClick={handleNextChapter} 
          disabled={chapter >= book.chaptersCount}
          style={{ opacity: chapter >= book.chaptersCount ? 0.4 : 1 }}
          title="Next Chapter"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Main Scripture Text Container */}
      <div className="reader-scroll-container">
        <div className="chapter-title-block">
          <h1 className="chapter-book-name">{book.name} {chapter}</h1>
          <p className="chapter-subtitle">
            {book.category} • {book.testament === 'OT' ? 'Old Testament' : 'New Testament'} • [{activeTranslation.name}]
          </p>
        </div>

        <div className="verse-list">
          {verses.map(v => {
            const isSelected = v.id === selectedVerseId;
            const refCount = crossRefCounts[v.id] || 0;

            return (
              <div 
                key={v.id} 
                className={`verse-item ${isSelected ? 'selected' : ''}`}
                style={{ fontSize: `${fontSize}rem` }}
                onClick={() => onSelectVerse(v)}
              >
                <span className="verse-number">{v.verse}</span>
                <span className="verse-text-content">{v.text}</span>

                {refCount > 0 && (
                  <span className="crossref-count-badge" title={`${refCount} OKF Cross-References`}>
                    <Share2 size={10} />
                    {refCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
