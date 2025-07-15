import { create } from 'zustand';

type LineTypes = 'ruled' | 'grid' | 'dotted' | 'none';
type PageSizes = 'A4' | 'Letter' | 'Legal' | 'A5' | 'Executive';
type PaperTextures = 'none' | 'parchment' | 'linen' | 'recycled' | 'college' | 'graph';

type StyleState = {
  // Core styling
  inkColor: string;
  paperColor: string;
  fontFamily: string;
  fontSize: number;
  letterSpacing: number;
  wordSpacing: number;
  lineHeight: number;
  
  // Section-specific styling
  headerFontSize: number;
  headerInkColor: string;
  sideNoteFontSize: number;
  sideNoteInkColor: string;
  mainContentFontSize: number;
  mainContentInkColor: string;
  
  // Page configuration
  pageSize: PageSizes;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  headerMargin: number;
  sideNoteMargin: number;
  
  // Line system with individual controls
  lineType: LineTypes;
  showRuledLines: boolean;
  showGridLines: boolean;
  showDottedLines: boolean;
  lineSpacing: number;
  lineOpacity: number;
  lineColor: string;
  
  // Margin system
  showMargins: boolean;
  showHeaderMargin: boolean;
  showSideMargins: boolean;
  marginColor: string;
  
  // Paper texture and realism
  textureUrl: string;
  paperTexture: PaperTextures;
  textureOpacity: number;
  paperGrain: boolean;
  
  // Advanced realism
  paperThickness: number;
  bindingType: 'spiral' | 'ring' | 'perfect' | 'none';
  cornerRadius: number;
  
  // Scientific notation support
  enableMathMode: boolean;
  mathSpacing: number;
  subscriptSize: number;
  superscriptSize: number;
  
  // Actions
  setInkColor: (color: string) => void;
  setPaperColor: (color: string) => void;
  setFontFamily: (family: string) => void;
  setFontSize: (size: number) => void;
  setLetterSpacing: (spacing: number) => void;
  setWordSpacing: (spacing: number) => void;
  setLineHeight: (height: number) => void;
  
  // Section-specific actions
  setHeaderFontSize: (size: number) => void;
  setHeaderInkColor: (color: string) => void;
  setSideNoteFontSize: (size: number) => void;
  setSideNoteInkColor: (color: string) => void;
  setMainContentFontSize: (size: number) => void;
  setMainContentInkColor: (color: string) => void;
  
  setPageSize: (size: PageSizes) => void;
  setMargins: (margins: Partial<{top: number; right: number; bottom: number; left: number}>) => void;
  setHeaderMargin: (margin: number) => void;
  setSideNoteMargin: (margin: number) => void;
  setLineType: (lineType: LineTypes) => void;
  setShowRuledLines: (show: boolean) => void;
  setShowGridLines: (show: boolean) => void;
  setShowDottedLines: (show: boolean) => void;
  setLineSpacing: (spacing: number) => void;
  setLineOpacity: (opacity: number) => void;
  setLineColor: (color: string) => void;
  setShowMargins: (show: boolean) => void;
  setShowHeaderMargin: (show: boolean) => void;
  setShowSideMargins: (show: boolean) => void;
  setMarginColor: (color: string) => void;
  setTextureUrl: (url: string) => void;
  setPaperTexture: (texture: PaperTextures) => void;
  setTextureOpacity: (opacity: number) => void;
  setPaperGrain: (grain: boolean) => void;
  setPaperThickness: (thickness: number) => void;
  setBindingType: (binding: 'spiral' | 'ring' | 'perfect' | 'none') => void;
  setCornerRadius: (radius: number) => void;
  setEnableMathMode: (enable: boolean) => void;
  setMathSpacing: (spacing: number) => void;
  setSubscriptSize: (size: number) => void;
  setSuperscriptSize: (size: number) => void;
};

export const useStyleStore = create<StyleState>((set) => ({
  // Core styling defaults
  inkColor: '#000000',
  paperColor: '#FFFFFF',
  fontFamily: 'var(--font-homemade-apple)',
  fontSize: 16,
  letterSpacing: 0,
  wordSpacing: 0,
  lineHeight: 1.5,
  
  // Section-specific styling defaults
  headerFontSize: 20,
  headerInkColor: '#000000',
  sideNoteFontSize: 16,
  sideNoteInkColor: '#000000',
  mainContentFontSize: 16,
  mainContentInkColor: '#000000',
  
  // Page configuration defaults
  pageSize: 'A4',
  margins: { top: 40, right: 30, bottom: 40, left: 30 },
  headerMargin: 20,
  sideNoteMargin: 80,
  
  // Line system defaults
  lineType: 'ruled',
  showRuledLines: true,
  showGridLines: false,
  showDottedLines: false,
  lineSpacing: 24,
  lineOpacity: 0.3,
  lineColor: '#e0e0e0',
  
  // Margin system defaults
  showMargins: true,
  showHeaderMargin: true,
  showSideMargins: true,
  marginColor: '#ffc0c0',
  
  // Paper texture defaults
  textureUrl: '',
  paperTexture: 'none',
  textureOpacity: 0.1,
  paperGrain: false,
  
  // Advanced realism defaults
  paperThickness: 1,
  bindingType: 'none',
  cornerRadius: 2,
  
  // Scientific notation defaults
  enableMathMode: true,
  mathSpacing: 4,
  subscriptSize: 0.7,
  superscriptSize: 0.7,
  
  // Actions
  setInkColor: (inkColor) => set({ inkColor, headerInkColor: inkColor, sideNoteInkColor: inkColor, mainContentInkColor: inkColor }),
  setPaperColor: (paperColor) => set({ paperColor }),
  setFontFamily: (fontFamily) => set({ fontFamily }),
  setFontSize: (fontSize) => set({ fontSize }),
  setLetterSpacing: (letterSpacing) => set({ letterSpacing }),
  setWordSpacing: (wordSpacing) => set({ wordSpacing }),
  setLineHeight: (lineHeight) => set({ lineHeight }),
  
  // Section-specific actions
  setHeaderFontSize: (headerFontSize) => set({ headerFontSize }),
  setHeaderInkColor: (headerInkColor) => set({ headerInkColor }),
  setSideNoteFontSize: (sideNoteFontSize) => set({ sideNoteFontSize }),
  setSideNoteInkColor: (sideNoteInkColor) => set({ sideNoteInkColor }),
  setMainContentFontSize: (mainContentFontSize) => set({ mainContentFontSize }),
  setMainContentInkColor: (mainContentInkColor) => set({ mainContentInkColor }),
  
  setPageSize: (pageSize) => set({ pageSize }),
  setMargins: (newMargins) => set((state) => ({ margins: { ...state.margins, ...newMargins } })),
  setHeaderMargin: (headerMargin) => set({ headerMargin }),
  setSideNoteMargin: (sideNoteMargin) => set({ sideNoteMargin }),
  setLineType: (lineType) => set({ lineType }),
  setShowRuledLines: (showRuledLines) => set({ showRuledLines }),
  setShowGridLines: (showGridLines) => set({ showGridLines }),
  setShowDottedLines: (showDottedLines) => set({ showDottedLines }),
  setLineSpacing: (lineSpacing) => set({ lineSpacing }),
  setLineOpacity: (lineOpacity) => set({ lineOpacity }),
  setLineColor: (lineColor) => set({ lineColor }),
  setShowMargins: (showMargins) => set({ showMargins }),
  setShowHeaderMargin: (showHeaderMargin) => set({ showHeaderMargin }),
  setShowSideMargins: (showSideMargins) => set({ showSideMargins }),
  setMarginColor: (marginColor) => set({ marginColor }),
  setTextureUrl: (textureUrl) => set({ textureUrl }),
  setPaperTexture: (paperTexture) => set({ paperTexture }),
  setTextureOpacity: (textureOpacity) => set({ textureOpacity }),
  setPaperGrain: (paperGrain) => set({ paperGrain }),
  setPaperThickness: (paperThickness) => set({ paperThickness }),
  setBindingType: (bindingType) => set({ bindingType }),
  setCornerRadius: (cornerRadius) => set({ cornerRadius }),
  setEnableMathMode: (enableMathMode) => set({ enableMathMode }),
  setMathSpacing: (mathSpacing) => set({ mathSpacing }),
  setSubscriptSize: (subscriptSize) => set({ subscriptSize }),
  setSuperscriptSize: (superscriptSize) => set({ superscriptSize }),
}));
