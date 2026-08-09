import React, { useState } from 'react';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';
import { BIBLE_BOOKS, getChapterVerses } from '../data/bibleData';
import { OKFVerseNode } from '../types/okf';
import { OKFEngine } from '../services/okfEngine';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (bookId: string, chapter: number, verseId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult
}) => {
  const [query, setQuery] = useState<string>('');
  const [filterTestament, setFilterTestament] = useState<'ALL' | 'OT' | 'NT'>('ALL');

  if (!isOpen) return null;

  // Search logic across key sample texts and books
  const results: OKFVerseNode[] = [];
  
  if (query.trim().length >= 2) {
    const qLower = query.toLowerCase().trim();
    
    // Search matching books by reference or text
    BIBLE_BOOKS.forEach(book => {
      if (filterTestament !== 'ALL' && book.testament !== filterTestament) return;

      // Check first 3 chapters of each book for match
      const sampleChapters = Math.min(3, book.chaptersCount);
      for (let c = 1; c <= sampleChapters; c++) {
        const verses = getChapterVerses(book.id, c);
        verses.forEach(v => {
          const refFormatted = OKFEngine.formatRef(v.id).toLowerCase();
          if (
            v.text.toLowerCase().includes(qLower) || 
            refFormatted.includes(qLower) || 
            v.id.toLowerCase().includes(qLower)
          ) {
            results.push(v);
          }
        });
      }
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Search Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, marginRight: '1rem' }}>
            <Search size={20} color="var(--accent-primary)" />
            <input 
              type="text" 
              placeholder="Search by keyword (e.g. 'light', 'beginning', 'love'), or verse reference (e.g. 'JHN.3.16')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              style={{ 
                width: '100%', 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--text-primary)', 
                fontSize: '1rem', 
                outline: 'none',
                fontFamily: 'var(--font-sans)'
              }}
            />
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ padding: '0.6rem 1.5rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn-icon" 
            style={{ width: 'auto', padding: '0.2rem 0.6rem', height: '26px', fontSize: '0.75rem', background: filterTestament === 'ALL' ? 'var(--accent-primary)' : 'transparent', color: filterTestament === 'ALL' ? '#fff' : 'var(--text-muted)' }}
            onClick={() => setFilterTestament('ALL')}
          >
            All Scripture
          </button>
          <button 
            className="btn-icon" 
            style={{ width: 'auto', padding: '0.2rem 0.6rem', height: '26px', fontSize: '0.75rem', background: filterTestament === 'OT' ? 'var(--accent-primary)' : 'transparent', color: filterTestament === 'OT' ? '#fff' : 'var(--text-muted)' }}
            onClick={() => setFilterTestament('OT')}
          >
            Old Testament
          </button>
          <button 
            className="btn-icon" 
            style={{ width: 'auto', padding: '0.2rem 0.6rem', height: '26px', fontSize: '0.75rem', background: filterTestament === 'NT' ? 'var(--accent-primary)' : 'transparent', color: filterTestament === 'NT' ? '#fff' : 'var(--text-muted)' }}
            onClick={() => setFilterTestament('NT')}
          >
            New Testament
          </button>
        </div>

        {/* Search Results List */}
        <div className="modal-body">
          {query.trim().length < 2 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <BookOpen size={36} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
              <p>Type at least 2 characters to search across all 66 books of the Bible.</p>
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <p>No matching verses found for "{query}".</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {results.slice(0, 30).map(v => {
                const refFormatted = OKFEngine.formatRef(v.id);

                return (
                  <div 
                    key={v.id} 
                    className="crossref-card"
                    onClick={() => {
                      onSelectResult(v.bookId, v.chapter, v.id);
                      onClose();
                    }}
                  >
                    <div className="crossref-card-head">
                      <span className="crossref-target-ref">{refFormatted}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-mono)' }}>
                        {v.id}
                      </span>
                    </div>
                    <p className="crossref-text-preview">"{v.text}"</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
