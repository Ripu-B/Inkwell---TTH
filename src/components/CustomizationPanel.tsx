'use client';

import React from 'react';
import { useStyleStore } from '@/stores/styleStore';
import { useEffectsStore } from '@/stores/effectsStore';
import { useFormattingStore } from '@/stores/formattingStore';
import { generateImage } from '@/utils/generate';
import AdvancedRealismPanel from './AdvancedRealismPanel';

const CustomizationPanel = () => {
  const style = useStyleStore();
  const effects = useEffectsStore();
  const formatting = useFormattingStore();

  return (
    <div className="customization-panel p-4 bg-white rounded-lg shadow-md overflow-y-auto max-h-screen space-y-6 divide-y divide-gray-200">
      <h2 className="text-xl font-bold mb-4">Customization Options</h2>
      
      {/* Styles section */}
      <section className="pt-4 first:pt-0">
        <h3 className="text-lg font-semibold mb-2">Styles</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Ink Color</label>
            <input type="color" value={style.inkColor} onChange={(e) => style.setInkColor(e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Paper Color</label>
            <input type="color" value={style.paperColor} onChange={(e) => style.setPaperColor(e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Font Size</label>
            <input type="number" value={style.fontSize} onChange={(e) => style.setFontSize(Number(e.target.value))} className="w-full p-1 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Font Family</label>
            <select value={style.fontFamily} onChange={(e) => style.setFontFamily(e.target.value)} className="w-full p-1 border rounded">
              <option value="var(--font-homemade-apple)">Homemade Apple</option>
              <option value="var(--font-caveat)">Caveat</option>
              <option value="var(--font-liu-jian-mao-cao)">Liu Jian Mao Cao</option>
              <option value="var(--font-indie-flower)">Indie Flower</option>
              <option value="var(--font-zeyada)">Zeyada</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Letter Spacing</label>
            <input type="number" value={style.letterSpacing} onChange={(e) => style.setLetterSpacing(Number(e.target.value))} className="w-full p-1 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Word Spacing</label>
            <input type="number" value={style.wordSpacing} onChange={(e) => style.setWordSpacing(Number(e.target.value))} className="w-full p-1 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Line Height</label>
            <input 
              type="number" 
              step="0.1"
              min="1"
              max="3"
              value={style.lineHeight} 
              onChange={(e) => style.setLineHeight(Number(e.target.value))} 
              className="w-full p-1 border rounded" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Page Size</label>
            <select value={style.pageSize} onChange={(e) => style.setPageSize(e.target.value as any)} className="w-full p-1 border rounded">
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
              <option value="A5">A5</option>
              <option value="Executive">Executive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Baseline Offset</label>
            <input type="number" step="0.1" value={style.baselineOffset} onChange={(e) => style.setBaselineOffset(Number(e.target.value))} className="w-full p-1 border rounded" />
          </div>
        </div>
      </section>
      
      {/* Section-specific styles */}
      <section className="pt-4 first:pt-0">
        <h3 className="text-lg font-semibold mb-2">Section Styles</h3>
        
        {/* Header section styles */}
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">Header Section</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Font Size</label>
              <input 
                type="number" 
                value={style.headerFontSize} 
                onChange={(e) => style.setHeaderFontSize(Number(e.target.value))} 
                className="w-full p-1 border rounded" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Ink Color</label>
              <input 
                type="color" 
                value={style.headerInkColor} 
                onChange={(e) => style.setHeaderInkColor(e.target.value)} 
                className="w-full" 
              />
            </div>
          </div>
        </div>
        
        {/* Side notes section styles */}
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">Side Notes Section</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Font Size</label>
              <input 
                type="number" 
                value={style.sideNoteFontSize} 
                onChange={(e) => style.setSideNoteFontSize(Number(e.target.value))} 
                className="w-full p-1 border rounded" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Ink Color</label>
              <input 
                type="color" 
                value={style.sideNoteInkColor} 
                onChange={(e) => style.setSideNoteInkColor(e.target.value)} 
                className="w-full" 
              />
            </div>
          </div>
        </div>
        
        {/* Main content section styles */}
        <div>
          <h4 className="text-md font-medium mb-2">Main Content Section</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Font Size</label>
              <input 
                type="number" 
                value={style.mainContentFontSize} 
                onChange={(e) => style.setMainContentFontSize(Number(e.target.value))} 
                className="w-full p-1 border rounded" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Ink Color</label>
              <input 
                type="color" 
                value={style.mainContentInkColor} 
                onChange={(e) => style.setMainContentInkColor(e.target.value)} 
                className="w-full" 
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Text Formatting section */}
      <section className="pt-4 first:pt-0">
        <h3 className="text-lg font-semibold mb-2">Text Formatting</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Bold</label>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="bold-checkbox"
                checked={formatting.bold} 
                onChange={() => formatting.toggleBold()} 
                className="w-4 h-4"
              />
              <span className="text-xs text-gray-500">Ctrl+B</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Italic</label>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="italic-checkbox"
                checked={formatting.italic} 
                onChange={() => formatting.toggleItalic()} 
                className="w-4 h-4"
              />
              <span className="text-xs text-gray-500">Ctrl+I</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Underline</label>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="underline-checkbox"
                checked={formatting.underline} 
                onChange={() => formatting.toggleUnderline()} 
                className="w-4 h-4"
              />
              <span className="text-xs text-gray-500">Ctrl+U</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Superscript</label>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="superscript-checkbox"
                checked={formatting.superscript} 
                onChange={() => formatting.toggleSuperscript()} 
                className="w-4 h-4"
              />
              <span className="text-xs text-gray-500">Ctrl+Shift+O</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Subscript</label>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="subscript-checkbox"
                checked={formatting.subscript} 
                onChange={() => formatting.toggleSubscript()} 
                className="w-4 h-4"
              />
              <span className="text-xs text-gray-500">Ctrl+Shift+S</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Lines section */}
      <section className="pt-4 first:pt-0">
        <h3 className="text-lg font-semibold mb-2">Lines</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Show Lines</label>
            <input 
              type="checkbox" 
              checked={style.showRuledLines} 
              onChange={(e) => style.setShowRuledLines(e.target.checked)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Line Type</label>
            <select 
              value={style.lineType} 
              onChange={(e) => style.setLineType(e.target.value as any)} 
              className="w-full p-1 border rounded"
            >
              <option value="ruled">Ruled</option>
              <option value="grid">Grid</option>
              <option value="dotted">Dotted</option>
              <option value="none">None</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Line Spacing (px)</label>
            <input 
              type="number" 
              value={style.lineSpacing} 
              onChange={(e) => style.setLineSpacing(Number(e.target.value))} 
              className="w-full p-1 border rounded" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Line Color</label>
            <input 
              type="color" 
              value={style.lineColor} 
              onChange={(e) => style.setLineColor(e.target.value)} 
              className="w-full" 
            />
          </div>
        </div>
      </section>
      
      {/* Margins section */}
      <section className="pt-4 first:pt-0">
        <h3 className="text-lg font-semibold mb-2">Margins</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Show Margins</label>
            <input 
              type="checkbox" 
              checked={style.showMargins} 
              onChange={(e) => style.setShowMargins(e.target.checked)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Show Header Margin</label>
            <input 
              type="checkbox" 
              checked={style.showHeaderMargin} 
              onChange={(e) => style.setShowHeaderMargin(e.target.checked)} 
              disabled={!style.showMargins}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Show Side Margins</label>
            <input 
              type="checkbox" 
              checked={style.showSideMargins} 
              onChange={(e) => style.setShowSideMargins(e.target.checked)} 
              disabled={!style.showMargins}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Margin Color</label>
            <input 
              type="color" 
              value={style.marginColor} 
              onChange={(e) => style.setMarginColor(e.target.value)} 
              className="w-full" 
              disabled={!style.showMargins}
            />
          </div>
        </div>
      </section>
      
      {/* Effects section */}
      <section className="pt-4 first:pt-0">
        <h3 className="text-lg font-semibold mb-2">Effects</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Shadow Enabled</label>
            <input type="checkbox" checked={effects.shadowEnabled} onChange={(e) => effects.setShadowEnabled(e.target.checked)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Scanner Effect</label>
            <input type="checkbox" checked={effects.scannerEnabled} onChange={(e) => effects.setScannerEnabled(e.target.checked)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Shadow Angle</label>
            <input type="range" min="0" max="360" value={effects.shadowAngle} onChange={(e) => effects.setShadowAngle(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Shadow Distance</label>
            <input type="range" min="0" max="20" value={effects.shadowDistance} onChange={(e) => effects.setShadowDistance(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Shadow Blur</label>
            <input type="range" min="0" max="50" value={effects.shadowBlur} onChange={(e) => effects.setShadowBlur(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Shadow Opacity</label>
            <input type="range" min="0" max="1" step="0.1" value={effects.shadowOpacity} onChange={(e) => effects.setShadowOpacity(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Handwriting Randomization</label>
            <input type="checkbox" checked={effects.handwritingRandomization} onChange={(e) => effects.setHandwritingRandomization(e.target.checked)} />
          </div>
        </div>
      </section>
      
      {/* Advanced Realism section */}
      <section className="pt-4 first:pt-0">
        <AdvancedRealismPanel />
      </section>
      
      <button onClick={generateImage} className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
        Generate Image
      </button>
    </div>
  );
};

export default CustomizationPanel; 