'use client';

import { useState } from 'react';
import { generateImage, downloadAsPDF, clearOutput, addPage, newDocument } from '@/utils/generate';

const ExportPanel = () => {
  const [exportFormat, setExportFormat] = useState<'png' | 'pdf'>('png');
  const [exportQuality, setExportQuality] = useState<'standard' | 'high'>('standard');
  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (exportFormat === 'pdf') {
        await downloadAsPDF();
      } else {
        await generateImage();
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      await generateImage();
      
      // Scroll to the output section
      const outputElement = document.getElementById('output');
      if (outputElement) {
        outputElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      console.error('Image generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-semibold mb-4">Export Options</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="exportFormat"
              value="png"
              checked={exportFormat === 'png'}
              onChange={() => setExportFormat('png')}
            />
            <span className="ml-2">PNG Image</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="exportFormat"
              value="pdf"
              checked={exportFormat === 'pdf'}
              onChange={() => setExportFormat('pdf')}
            />
            <span className="ml-2">PDF Document</span>
          </label>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
        <select
          className="form-select block w-full border-gray-300 rounded-md shadow-sm"
          value={exportQuality}
          onChange={(e) => setExportQuality(e.target.value as 'standard' | 'high')}
        >
          <option value="standard">Standard</option>
          <option value="high">High Resolution</option>
        </select>
      </div>
      
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleGenerateImage}
          disabled={isGenerating}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </button>
        
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
        </button>
        
        <button
          onClick={addPage}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Add Current Page
        </button>
        
        <button
          onClick={newDocument}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          New Document
        </button>
        
        <button
          onClick={clearOutput}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Output
        </button>
      </div>
    </div>
  );
};

export default ExportPanel; 