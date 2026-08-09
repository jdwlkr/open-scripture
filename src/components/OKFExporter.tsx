import React, { useState } from 'react';
import { X, Download, Upload, CheckCircle2, FileJson } from 'lucide-react';
import { OKFEngine } from '../services/okfEngine';

interface OKFExporterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OKFExporter: React.FC<OKFExporterProps> = ({ isOpen, onClose }) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    const jsonStr = await OKFEngine.exportOKFSchema();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `open-scripture-okf-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const res = await OKFEngine.importOKFSchema(content);
        setImportStatus(`Successfully imported ${res.importedEdges} cross-references & ${res.importedNotes} notes into OKF graph!`);
      } catch (err) {
        setImportStatus('Error importing file: Invalid OKF JSON format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <FileJson size={20} color="var(--accent-primary)" />
            <span>Open Knowledge Format (OKF) Exchange</span>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Export Section */}
          <div className="node-card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Export Knowledge Graph
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Download your complete scripture cross-reference graph, relationship weights, and personal study annotations as a standardized OKF JSON data package.
            </p>
            <button className="btn-primary" onClick={handleExport}>
              <Download size={16} /> Export OKF Graph (.json)
            </button>
          </div>

          {/* Import Section */}
          <div className="node-card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Import OKF Dataset
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              Import open scripture knowledge packages, external cross-reference datasets, or shared community study notes.
            </p>
            
            <label className="btn-primary" style={{ display: 'inline-flex', cursor: 'pointer' }}>
              <Upload size={16} /> Select OKF JSON File
              <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>

            {importStatus && (
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontSize: '0.875rem' }}>
                <CheckCircle2 size={16} />
                <span>{importStatus}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
