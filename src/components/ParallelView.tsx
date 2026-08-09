import React, { useState } from 'react';
import { Columns, Plus, X } from 'lucide-react';
import { BIBLE_BOOKS, getChapterVerses } from '../data/bibleData';
import { OKFEngine } from '../services/okfEngine';

interface ColumnConfig {
  id: string;
  bookId: string;
  chapter: number;
}

export const ParallelView: React.FC = () => {
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: 'col-1', bookId: 'GEN', chapter: 1 },
    { id: 'col-2', bookId: 'JHN', chapter: 1 }
  ]);

  const handleAddColumn = () => {
    if (columns.length >= 3) return;
    setColumns(prev => [
      ...prev,
      { id: `col-${Date.now()}`, bookId: 'REV', chapter: 21 }
    ]);
  };

  const handleRemoveColumn = (id: string) => {
    if (columns.length <= 1) return;
    setColumns(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateColumn = (id: string, key: 'bookId' | 'chapter', value: any) => {
    setColumns(prev => prev.map(c => c.id === id ? { ...c, [key]: value } : c));
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      {/* Parallel Top Bar */}
      <div style={{ padding: '0.75rem 1.5rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Columns size={18} color="var(--accent-primary)" />
          <span>Parallel Passage Workbench</span>
        </div>

        {columns.length < 3 && (
          <button className="btn-primary" onClick={handleAddColumn} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
            <Plus size={14} /> Add Passage Column
          </button>
        )}
      </div>

      {/* Side-by-Side Columns */}
      <div style={{ flex: 1, display: 'flex', overflowX: 'auto' }}>
        {columns.map(col => {
          const book = BIBLE_BOOKS.find(b => b.id === col.bookId) || BIBLE_BOOKS[0];
          const verses = getChapterVerses(col.bookId, col.chapter);

          return (
            <div 
              key={col.id} 
              style={{ 
                flex: 1, 
                minWidth: '320px', 
                borderRight: '1px solid var(--border-color)', 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                background: 'var(--bg-secondary)'
              }}
            >
              {/* Column Header Selector */}
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select 
                  className="select-control"
                  style={{ flex: 1 }}
                  value={col.bookId}
                  onChange={(e) => handleUpdateColumn(col.id, 'bookId', e.target.value)}
                >
                  {BIBLE_BOOKS.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>

                <select 
                  className="select-control"
                  value={col.chapter}
                  onChange={(e) => handleUpdateColumn(col.id, 'chapter', Number(e.target.value))}
                >
                  {Array.from({ length: book.chaptersCount }, (_, i) => i + 1).map(c => (
                    <option key={c} value={c}>Ch {c}</option>
                  ))}
                </select>

                {columns.length > 1 && (
                  <button className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => handleRemoveColumn(col.id)} title="Remove Column">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Column Verses Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
                {verses.map(v => (
                  <div key={v.id} style={{ marginBottom: '1rem', lineHeight: 1.7, fontFamily: 'var(--font-scripture)', fontSize: '1.1rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', marginRight: '0.5rem' }}>
                      {v.verse}
                    </span>
                    <span>{v.text}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
