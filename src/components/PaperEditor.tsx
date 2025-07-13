'use client';

import React, { useRef } from 'react';
import Editor from './Editor';
import { useStyleStore } from '@/stores/styleStore';
import { useEffectsStore } from '@/stores/effectsStore';
import { useContentStore } from '@/stores/contentStore';

const PaperEditor = () => {
  const paperRef = useRef<HTMLDivElement>(null);
  const style = useStyleStore();
  const effects = useEffectsStore();
  const { headerContent, setHeaderContent, sideContent, setSideContent, mainContent, setMainContent } = useContentStore();

  // Calculate shadow properties
  const rad = effects.shadowAngle * Math.PI / 180;
  const offsetX = effects.shadowDistance * Math.cos(rad);
  const offsetY = effects.shadowDistance * Math.sin(rad);
  const shadowStyle = effects.shadowEnabled ? {
    boxShadow: `${offsetX}px ${offsetY}px ${effects.shadowBlur}px rgba(0,0,0,${effects.shadowOpacity})`,
  } : {};

  // Calculate dimensions based on A4 proportions
  const paperWidth = 595; // in pixels (210mm at 72dpi)
  const paperHeight = 842; // in pixels (297mm at 72dpi)
  
  // Calculate header height (similar to standard notebook headers - around 40-50px)
  const headerHeight = 45;
  
  // Calculate side note width (about 15% of width)
  const sideNoteWidth = Math.floor(paperWidth * 0.15);

  const lineSpacing = 24; // in pixels, matches globals.css

  // Determine paper classes
  const paperClasses = [
    'paper',
    style.showRuledLines ? 'lines' : '',
  ].filter(Boolean).join(' ');

  return (
    <div 
      ref={paperRef} 
      className={paperClasses} 
      style={{
        backgroundColor: style.paperColor,
        width: `${paperWidth}px`,
        height: `${paperHeight}px`,
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
        position: 'relative',
        ...shadowStyle
      }}
    >
      {style.showMargins && style.showHeaderMargin && (
        <div className="header-section" style={{
          height: `${headerHeight}px`,
          borderBottom: `1px solid ${style.marginColor}`,
          backgroundColor: style.paperColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '5px 20px',
        }}>
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
        {style.showMargins && style.showSideMargins && (
          <div className="side-section" style={{
            width: `${sideNoteWidth}px`,
            borderRight: `1px solid ${style.marginColor}`,
            backgroundColor: 'transparent',
            position: 'relative',
          }}>
            <Editor
              content={sideContent}
              setContent={setSideContent}
              showToolbar={false}
              noContainer={true}
              styleOverrides={{
                fontSize: `${style.sideNoteFontSize}px`,
                color: style.sideNoteInkColor,
                padding: '0 5px',
                lineHeight: `${lineSpacing}px`,
              }}
              placeholder="Side notes..."
            />
          </div>
        )}
        <div className="main-section" style={{ 
          width: `${paperWidth - sideNoteWidth}px`,
          position: 'relative',
          backgroundColor: 'transparent',
        }}>
          <Editor
            content={mainContent}
            setContent={setMainContent}
            showToolbar={false}
            noContainer={true}
            styleOverrides={{
              fontSize: `${style.mainContentFontSize}px`,
              color: style.mainContentInkColor,
              padding: '0 15px',
              lineHeight: `${lineSpacing}px`,
            }}
            placeholder="Start writing notes here..."
          />
        </div>
      </div>
      <div className={`overlay ${effects.shadowEnabled ? 'shadows' : ''} ${effects.scannerEnabled ? 'scanner' : ''}`}></div>
    </div>
  );
};

export default PaperEditor;
