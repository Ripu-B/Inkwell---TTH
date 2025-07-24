import React, { useRef } from 'react';
import { useStyleStore } from '@/stores/styleStore';

const CustomBackgroundPanel = () => {
  const style = useStyleStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        style.setCustomBackgroundUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="custom-background-panel p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Custom Background Settings</h3>
      {/* Enable custom background */}
      <div className="mb-3">
        <label className="block text-sm font-medium">Enable Custom Background</label>
        <input
          type="checkbox"
          checked={style.customBackgroundEnabled}
          onChange={(e) => style.setCustomBackgroundEnabled(e.target.checked)}
        />
      </div>
      {/* URL Input */}
      {style.customBackgroundEnabled && (
        <>
          <div className="mb-3">
            <label className="block text-sm font-medium">Image Source</label>
            <div className="space-y-2">
              <input
                type="text"
                value={style.customBackgroundUrl}
                onChange={(e) => style.setCustomBackgroundUrl(e.target.value)}
                className="w-full p-1 border rounded"
                placeholder="Enter image URL or upload file"
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => style.setCustomBackgroundUrl('')}
                  className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                >
                  Clear
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Scale ({style.customBackgroundScale.toFixed(1)}x)</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={style.customBackgroundScale}
                onChange={(e) => style.setCustomBackgroundScale(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Opacity ({Math.round(style.customBackgroundOpacity * 100)}%)</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={style.customBackgroundOpacity}
                onChange={(e) => style.setCustomBackgroundOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Offset X</label>
              <input
                type="number"
                value={style.customBackgroundOffsetX}
                onChange={(e) => style.setCustomBackgroundOffsetX(Number(e.target.value))}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Offset Y</label>
              <input
                type="number"
                value={style.customBackgroundOffsetY}
                onChange={(e) => style.setCustomBackgroundOffsetY(Number(e.target.value))}
                className="w-full p-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Rotation ({style.customBackgroundRotation}°)</label>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={style.customBackgroundRotation}
                onChange={(e) => style.setCustomBackgroundRotation(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomBackgroundPanel;

