'use client';

import Editor from '@/components/Editor';
import CustomizationPanel from '@/components/CustomizationPanel';
import PluginManager from '@/components/PluginManager';
import PaperEditor from '@/components/PaperEditor';
import { generateImage, downloadAsPDF, clearOutput } from '@/utils/generate';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header with Generate Button */}
      <header className="bg-white shadow-sm border-b border-gray-200 py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-wide" style={{ fontFamily: 'var(--font-crimson-text), serif', textTransform: 'uppercase', letterSpacing: '2px' }}>
            INKWELL
          </h1>
          <p className="text-gray-600 text-sm hidden md:block">The most advanced text to handwriting tool</p>
          <button onClick={generateImage} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md">
            Generate Image
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="flex flex-row mb-4">
          <div className="w-1/2 pr-4">
            <PaperEditor />
          </div>
          <div className="w-1/2 pl-4 overflow-y-auto">
            <CustomizationPanel />
            <PluginManager />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-4 mb-4">
          <button onClick={downloadAsPDF} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Download PDF
          </button>
          <button onClick={clearOutput} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Clear Output
          </button>
        </div>
        
        {/* Output Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Generated Output</h2>
          <div id="output" className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center text-gray-500 max-h-96 overflow-y-auto">
            Generated output will appear here
          </div>
          <button
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200"
            onClick={() => {
              const canvas = document.querySelector('canvas');
              if (canvas) {
                const img = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                const link = document.createElement('a');
                link.download = 'inkwell-output.png';
                link.href = img;
                link.click();
              }
            }}
          >
            Download Image
          </button>
        </div>
      </div>
    </main>
  );
}
