import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const lines = content.split('\n');

  const renderFormattedInline = (text: string) => {
    // Replace **bold**, *italic*, `code`, and [link](url)
    const parts: (string | React.ReactNode)[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Helper regex to split bold, italic, code
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    const tokens = remaining.split(regex);

    return tokens.map((token, i) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={i} style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith('*') && token.endsWith('*') && !token.startsWith('**')) {
        return <em key={i} style={{ color: 'var(--text-scripture)' }}>{token.slice(1, -1)}</em>;
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code 
            key={i} 
            style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.8rem', 
              background: 'var(--accent-light)', 
              color: 'var(--accent-primary)', 
              padding: '1px 5px', 
              borderRadius: '4px',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}
          >
            {token.slice(1, -1)}
          </code>
        );
      }
      return token;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: 1.65 }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} style={{ height: '0.25rem' }} />;

        if (trimmed.startsWith('### ')) {
          return (
            <h3 
              key={idx} 
              style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.05rem', 
                fontWeight: 700, 
                color: 'var(--text-primary)',
                marginTop: '0.4rem',
                marginBottom: '0.2rem',
                borderBottom: '1px dashed var(--border-color)',
                paddingBottom: '0.25rem'
              }}
            >
              {renderFormattedInline(trimmed.slice(4))}
            </h3>
          );
        }

        if (trimmed.startsWith('#### ')) {
          return (
            <h4 
              key={idx} 
              style={{ 
                fontFamily: 'var(--font-sans)', 
                fontSize: '0.95rem', 
                fontWeight: 700, 
                color: 'var(--accent-primary)',
                marginTop: '0.3rem',
                marginBottom: '0.1rem'
              }}
            >
              {renderFormattedInline(trimmed.slice(5))}
            </h4>
          );
        }

        if (trimmed.startsWith('> ')) {
          return (
            <blockquote 
              key={idx} 
              style={{ 
                borderLeft: '3px solid var(--accent-gold)', 
                background: 'var(--accent-gold-light)', 
                padding: '0.4rem 0.75rem', 
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                fontFamily: 'var(--font-scripture)',
                fontSize: '0.95rem',
                fontStyle: 'italic',
                color: 'var(--text-scripture)',
                margin: '0.25rem 0'
              }}
            >
              {renderFormattedInline(trimmed.slice(2))}
            </blockquote>
          );
        }

        if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
          return (
            <div key={idx} style={{ display: 'flex', gap: '0.5rem', paddingLeft: '0.5rem', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>•</span>
              <span style={{ flex: 1 }}>{renderFormattedInline(trimmed.slice(2))}</span>
            </div>
          );
        }

        return (
          <p key={idx} style={{ margin: 0, fontSize: '0.88rem' }}>
            {renderFormattedInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};
