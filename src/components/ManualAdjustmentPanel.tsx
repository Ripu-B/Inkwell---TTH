'use client';

import React, { useState } from 'react';
import { useStyleStore } from '@/stores/styleStore';

const ManualAdjustmentPanel = () => {
  const style = useStyleStore();
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);

  const handleAddLine = () => {
    // Add a line at the middle of the editor bounds
    const newY = style.customEditorBounds.y + style.customEditorBounds.height / 2;
    style.addCustomLine(newY);
  };

  const handleRemoveLine = (index: number) => {
    style.removeCustomLine(index);
    if (selectedLineIndex === index) {
      setSelectedLineIndex(null);
    }
  };

  const handleLinePositionChange = (index: number, y: number) => {
    style.updateCustomLine(index, y);
  };

  const handleLineVisibilityToggle = (index: number) => {
    const line = style.customLinePositions[index];
    style.updateCustomLine(index, line.y, !line.visible);
  };

  return (
    <div className="manual-adjustment-panel p-4 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Manual Adjustment Mode</h3>
      
      {/* Toggle manual adjustment mode */}
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={style.manualAdjustmentMode}
            onChange={(e) => style.setManualAdjustmentMode(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Enable Manual Adjustment</span>
        </label>
        <p className="text-xs text-gray-600 mt-1">
          Allows you to manually position lines, margins, and editor boundaries
        </p>
      </div>

      {style.manualAdjustmentMode && (
        <>
          {/* Editor Bounds */}
          <div className="mb-4 p-3 bg-white rounded border">
            <h4 className="text-md font-medium mb-2">Editor Boundaries</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium">X Position</label>
                <input
                  type="number"
                  value={style.customEditorBounds.x}
                  onChange={(e) => style.setCustomEditorBounds({
                    ...style.customEditorBounds,
                    x: Number(e.target.value)
                  })}
                  className="w-full p-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium">Y Position</label>
                <input
                  type="number"
                  value={style.customEditorBounds.y}
                  onChange={(e) => style.setCustomEditorBounds({
                    ...style.customEditorBounds,
                    y: Number(e.target.value)
                  })}
                  className="w-full p-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium">Width</label>
                <input
                  type="number"
                  value={style.customEditorBounds.width}
                  onChange={(e) => style.setCustomEditorBounds({
                    ...style.customEditorBounds,
                    width: Number(e.target.value)
                  })}
                  className="w-full p-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium">Height</label>
                <input
                  type="number"
                  value={style.customEditorBounds.height}
                  onChange={(e) => style.setCustomEditorBounds({
                    ...style.customEditorBounds,
                    height: Number(e.target.value)
                  })}
                  className="w-full p-1 border rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* Custom Margins */}
          <div className="mb-4 p-3 bg-white rounded border">
            <h4 className="text-md font-medium mb-2">Custom Margins</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium">Top</label>
                <input
                  type="number"
                  value={style.customMarginPositions.top}
                  onChange={(e) => style.setCustomMarginPositions({
                    ...style.customMarginPositions,
                    top: Number(e.target.value)
                  })}
                  className="w-full p-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium">Bottom</label>
                <input
                  type="number"
                  value={style.customMarginPositions.bottom}
                  onChange={(e) => style.setCustomMarginPositions({
                    ...style.customMarginPositions,
                    bottom: Number(e.target.value)
                  })}
                  className="w-full p-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium">Left</label>
                <input
                  type="number"
                  value={style.customMarginPositions.left}
                  onChange={(e) => style.setCustomMarginPositions({
                    ...style.customMarginPositions,
                    left: Number(e.target.value)
                  })}
                  className="w-full p-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium">Right</label>
                <input
                  type="number"
                  value={style.customMarginPositions.right}
                  onChange={(e) => style.setCustomMarginPositions({
                    ...style.customMarginPositions,
                    right: Number(e.target.value)
                  })}
                  className="w-full p-1 border rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* Custom Lines */}
          <div className="mb-4 p-3 bg-white rounded border">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-medium">Custom Lines</h4>
              <button
                onClick={handleAddLine}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
              >
                Add Line
              </button>
            </div>
            
            <div className="max-h-40 overflow-y-auto">
              {style.customLinePositions.map((line, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2 p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <label className="block text-xs font-medium">Y Position</label>
                    <input
                      type="number"
                      value={line.y}
                      onChange={(e) => handleLinePositionChange(index, Number(e.target.value))}
                      className="w-full p-1 border rounded text-sm"
                    />
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <button
                      onClick={() => handleLineVisibilityToggle(index)}
                      className={`px-2 py-1 text-xs rounded ${
                        line.visible 
                          ? 'bg-green-500 text-white hover:bg-green-600' 
                          : 'bg-gray-400 text-white hover:bg-gray-500'
                      }`}
                    >
                      {line.visible ? 'Show' : 'Hide'}
                    </button>
                    <button
                      onClick={() => handleRemoveLine(index)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {style.customLinePositions.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-2">
                No custom lines added yet
              </p>
            )}
          </div>

          {/* Helper text */}
          <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
            <strong>Tip:</strong> Use the controls above to position your text editor and lines to match your custom background image. 
            The editor will automatically adjust to these custom positions when manual adjustment mode is enabled.
          </div>
        </>
      )}
    </div>
  );
};

export default ManualAdjustmentPanel;
