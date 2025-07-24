'use client';

import React, { useRef, CSSProperties, useState } from 'react';
import { Descendant, Node } from 'slate';
import Editor from './Editor';
import { useStyleStore } from '@/stores/styleStore';
import { useEffectsStore } from '@/stores/effectsStore';
import { useContentStore } from '@/stores/contentStore';
import { parseMarkup } from '@/utils/markupParser';

const PaperEditor = () => {
  const paperRef = useRef<HTMLDivElement>(null);
  const style = useStyleStore();
  const effects = useEffectsStore();
  const { headerContent, setHeaderContent, sideContent, setSideContent, mainContent, setMainContent } = useContentStore();
  const [showMarkupInput, setShowMarkupInput] = useState(false);
  const [markupText, setMarkupText] = useState('');

  // Calculate shadow properties
  const rad = effects.shadowAngle * Math.PI / 180;
  const offsetX = effects.shadowDistance * Math.cos(rad);
  const offsetY = effects.shadowDistance * Math.sin(rad);
  const shadowStyle = effects.shadowEnabled ? {
    boxShadow: `${offsetX}px ${offsetY}px ${effects.shadowBlur}px rgba(0,0,0,${effects.shadowOpacity})`,
  } : {};

  // Calculate dimensions based on A4 proportions
  const pageSizes = {
    'A4': { width: 794, height: 1123 },
    'Letter': { width: 816, height: 1056 },
    'Legal': { width: 816, height: 1344 },
    'A5': { width: 559, height: 794 },
    'Executive': { width: 696, height: 1008 },
    'SimpleA4': { width: 794 - 98, height: 1123 - 98 }, // 2.6cm (≈ 98px) cut from both width and height
  };
  const { width: paperWidth, height: paperHeight } = pageSizes[style.pageSize] || pageSizes['A4'];
  
  // Calculate header height (similar to standard notebook headers - around 40-50px)
  const headerHeight = 45;
  
  const scale = 0.7;
  const scaledWidth = paperWidth * scale;
  const scaledHeight = paperHeight * scale;

  // Calculate side note width (about 15% of width)
  const sideNoteWidth = Math.floor(scaledWidth * 0.15);

  // Calculate line spacing based on style settings
  const lineSpacing = style.pageSize === 'SimpleA4' ? 26.5 : style.lineSpacing; // 0.7cm for SimpleA4, custom for others

  // Ensure consistent line spacing across the editor - use pixel values
  const editorLineHeight = `${lineSpacing}px`;
  
  // Determine paper classes
  const paperClasses = [
    'paper',
    style.showRuledLines ? 'lines' : '',
    effects.chromaticAberration ? 'chromatic-aberration' : ''
  ].filter(Boolean).join(' ');

  const paperStyle: React.CSSProperties = {
    backgroundColor: style.paperColor,
    width: `${scaledWidth}px`,
    height: `${scaledHeight}px`,
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    position: 'relative',
    '--line-spacing': `${lineSpacing}px`,
    ...shadowStyle,
  } as React.CSSProperties;

  // Create text content for chromatic aberration
  const extractTextContent = (content: Descendant[]) => {
    return content.map(node => {
      if ('children' in node) {
        return (node.children as any[]).map(c => c.text || '').join('');
      }
      return '';
    }).join('\n');
  };

  const mainText = extractTextContent(mainContent);

  // Check if using SimpleA4 format
  const isSimpleA4 = style.pageSize === 'SimpleA4';

  return (
    <div>
      {/* Toggle button for markup input */}
      <button
        onClick={() => setShowMarkupInput(!showMarkupInput)}
        style={{
          marginBottom: '10px',
          padding: '8px 16px',
          fontSize: '14px',
          backgroundColor: showMarkupInput ? '#4a5568' : '#718096',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {showMarkupInput ? 'Switch to Editor' : 'Use Markup'}
      </button>
      
      <div
        ref={paperRef}
        className={paperClasses}
        style={paperStyle}
        data-text={mainText}
        data-format={style.pageSize}
      >
      {/* Realism Effect Layers */}
      {effects.paperGrainEnabled && <div className="paper-grain" style={{ opacity: effects.paperGrainIntensity }} />}
      {effects.documentWeathering && <div className="document-weathering" style={{ opacity: effects.weatheringIntensity }} />}
      {effects.noiseIntensity > 0 && <div className="noise-overlay" style={{ opacity: effects.noiseIntensity }} />}
      {effects.lightBarGradient && <div className="light-bar-gradient" />}
      {effects.bindingEffects && (
        <>
          <div className="binding-effect" />
          {[...Array(10)].map((_, i) => (
            <div key={i} className="binding-hole" style={{ top: `${(i + 1) * (100 / 11)}%` }} />
          ))}
        </>
      )}

      {/* For SimpleA4, skip header and side margins */}
      {!isSimpleA4 && style.showMargins && style.showHeaderMargin && (
        <div className="header-section" style={{
          height: `${headerHeight}px`,
          borderBottom: `1px solid ${style.marginColor}`,
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '5px 20px',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            bottom: '-3px',
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: style.marginColor
          }}/>
          <Editor
            content={headerContent}
            setContent={setHeaderContent}
            showToolbar={false}
            noContainer={true}
            styleOverrides={{
              fontSize: `${style.headerFontSize}px`,
              color: style.headerInkColor,
              textAlign: 'center',
              width: '100%',
              margin: '0',
              lineHeight: '1.2',
              minHeight: '30px',
            }}
            placeholder="Enter header..."
          />
        </div>
      )}
      <div className="content-section" style={{
        display: 'flex',
        flex: 1,
        backgroundColor: 'transparent',
        position: 'relative',
      }}>
        {!isSimpleA4 && style.showMargins && style.showSideMargins && (
          <div className="side-section" style={{
            width: `${sideNoteWidth}px`,
            borderRight: `1px solid ${style.marginColor}`,
            backgroundColor: 'transparent',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: '-3px',
              width: '1px',
              backgroundColor: style.marginColor
            }} />
            <Editor
              content={sideContent}
              setContent={setSideContent}
              showToolbar={false}
              noContainer={true}
            styleOverrides={{
              fontSize: `${style.sideNoteFontSize}px`,
              color: style.sideNoteInkColor,
              padding: '0 5px',
              lineHeight: editorLineHeight,
              fontFamily: style.fontFamily,
            }}
              placeholder="Side notes..."
            />
          </div>
        )}
        <div className="main-section" style={{ 
          width: !isSimpleA4 && style.showMargins && style.showSideMargins ? `${scaledWidth - sideNoteWidth}px` : `${scaledWidth}px`,
          position: 'relative',
          backgroundColor: 'transparent',
        }}>
          
          {showMarkupInput ? (
            <textarea
              value={markupText}
              onChange={(e) => {
                setMarkupText(e.target.value);
                try {
                  const parsed = parseMarkup(e.target.value);
                  setMainContent(parsed);
                } catch (error) {
                  console.error('Markup parsing error:', error);
                }
              }}
              style={{
                width: '100%',
                height: '100%',
                fontSize: `${style.mainContentFontSize}px`,
                color: style.mainContentInkColor,
                padding: '0 15px',
                lineHeight: editorLineHeight,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontFamily: 'monospace',
              }}
              placeholder="Enter markup text here... (e.g., {_heading: Title, color: brown})"
            />
          ) : (
            <Editor
              content={mainContent}
              setContent={setMainContent}
              showToolbar={false}
              noContainer={true}
              styleOverrides={{
                fontSize: `${style.mainContentFontSize}px`,
                color: style.mainContentInkColor,
                padding: '0 15px',
                lineHeight: editorLineHeight,
                fontFamily: style.fontFamily,
              }}
              placeholder="Start writing notes here..."
            />
          )}
        </div>
      </div>
      <div className={`overlay ${effects.shadowEnabled ? 'shadows' : ''} ${effects.scannerEnabled ? 'scanner' : ''} ${effects.paperGrainEnabled ? 'paper-grain' : ''} ${effects.noiseIntensity > 0 ? 'noise-overlay' : ''} ${effects.lightBarGradient ? 'light-bar-gradient' : ''} ${effects.documentWeathering ? 'weathering-overlay' : ''}`} style={{ 
  '--paper-grain-opacity': effects.paperGrainIntensity,
  '--noise-opacity': effects.noiseIntensity,
  '--weathering-opacity': effects.weatheringIntensity
} as CSSProperties}></div>
      </div>
    </div>
  );
};

export default PaperEditor;
