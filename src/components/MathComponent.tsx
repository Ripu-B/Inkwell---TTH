'use client';

import React, { useState, useEffect } from 'react';
import { useStyleStore } from '@/stores/styleStore';

interface MathComponentProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

const MathComponent: React.FC<MathComponentProps> = ({ latex, displayMode = false, className = '' }) => {
  const [katex, setKatex] = useState<any>(null);
  const [rendered, setRendered] = useState<string>('');
  const style = useStyleStore();

  useEffect(() => {
    // Dynamically import KaTeX to avoid server-side rendering issues
    import('katex').then((katexModule) => {
      setKatex(katexModule.default);
    });
  }, []);

  useEffect(() => {
    if (katex && latex) {
      try {
        const html = katex.renderToString(latex, {
          displayMode,
          throwOnError: false,
          trust: true,
          strict: false,
          macros: {
            '\\f': '#1f(#2)', // Custom macro example
          },
        });
        setRendered(html);
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        setRendered(`Error: ${latex}`);
      }
    }
  }, [katex, latex, displayMode]);

  if (!katex) {
    return <span className={className}>Loading math...</span>;
  }

  return (
    <span 
      className={`math-container ${className}`}
      style={{
        fontFamily: style.fontFamily,
        fontSize: `${style.fontSize}px`,
        color: style.inkColor,
      }}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
};

export default MathComponent;
