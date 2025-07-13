'use client';

import Editor from '@/components/Editor';
import CustomizationPanel from '@/components/CustomizationPanel';
import PluginManager from '@/components/PluginManager';
import PaperEditor from '@/components/PaperEditor';
import { generateImage, downloadAsPDF, clearOutput } from '@/utils/generate';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Inkwell</h1>
      <div className="flex flex-row mb-4">
        <div className="w-1/2 pr-4">
          <PaperEditor />
        </div>
        <div className="w-1/2 pl-4 overflow-y-auto">
          <CustomizationPanel />
          <PluginManager />
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <button onClick={generateImage} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Generate Image
        </button>
        <button onClick={downloadAsPDF} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Download PDF
        </button>
        <button onClick={clearOutput} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Clear Output
        </button>
      </div>
      <div id="output" className="border p-4 bg-gray-50">
        {/* Generated output will appear here */}
      </div>
    </main>
  );
} 