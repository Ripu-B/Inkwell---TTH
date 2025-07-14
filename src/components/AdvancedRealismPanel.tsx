'use client';

import React from 'react';
import { useEffectsStore } from '@/stores/effectsStore';

const AdvancedRealismPanel = () => {
  const effects = useEffectsStore();

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">Advanced Realism</h3>
      <div className="space-y-4">
        {/* Ink Flow Variation */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="ink-flow-enabled"
              checked={effects.inkFlowVariation}
              onChange={(e) => effects.setInkFlowVariation(e.target.checked)}
            />
            <label htmlFor="ink-flow-enabled" className="text-sm font-medium">Ink Flow Variation</label>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="ink-flow" className="text-xs text-gray-600 min-w-16">Intensity:</label>
            <input
              id="ink-flow"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={effects.inkFlowIntensity}
              onChange={(e) => effects.setInkFlowIntensity(parseFloat(e.target.value))}
              className="flex-1"
              disabled={!effects.inkFlowVariation}
            />
            <span className="text-xs text-gray-500 min-w-8">{effects.inkFlowIntensity.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Paper Grain */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="paper-grain-enabled"
              checked={effects.paperGrainEnabled}
              onChange={(e) => effects.setPaperGrainEnabled(e.target.checked)}
            />
            <label htmlFor="paper-grain-enabled" className="text-sm font-medium">Paper Grain</label>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="paper-grain" className="text-xs text-gray-600 min-w-16">Intensity:</label>
            <input
              id="paper-grain"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={effects.paperGrainIntensity}
              onChange={(e) => effects.setPaperGrainIntensity(parseFloat(e.target.value))}
              className="flex-1"
              disabled={!effects.paperGrainEnabled}
            />
            <span className="text-xs text-gray-500 min-w-8">{effects.paperGrainIntensity.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Pen Pressure Variation */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="pen-pressure-enabled"
              checked={effects.penPressureVariation}
              onChange={(e) => effects.setPenPressureVariation(e.target.checked)}
            />
            <label htmlFor="pen-pressure-enabled" className="text-sm font-medium">Pen Pressure Variation</label>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="pen-pressure" className="text-xs text-gray-600 min-w-16">Intensity:</label>
            <input
              id="pen-pressure"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={effects.penPressureIntensity}
              onChange={(e) => effects.setPenPressureIntensity(parseFloat(e.target.value))}
              className="flex-1"
              disabled={!effects.penPressureVariation}
            />
            <span className="text-xs text-gray-500 min-w-8">{effects.penPressureIntensity.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Document Weathering */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="weathering-enabled"
              checked={effects.documentWeathering}
              onChange={(e) => effects.setDocumentWeathering(e.target.checked)}
            />
            <label htmlFor="weathering-enabled" className="text-sm font-medium">Document Weathering</label>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="document-weathering" className="text-xs text-gray-600 min-w-16">Intensity:</label>
            <input
              id="document-weathering"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={effects.weatheringIntensity}
              onChange={(e) => effects.setWeatheringIntensity(parseFloat(e.target.value))}
              className="flex-1"
              disabled={!effects.documentWeathering}
            />
            <span className="text-xs text-gray-500 min-w-8">{effects.weatheringIntensity.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Chromatic Aberration */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="chromatic-enabled"
              checked={effects.chromaticAberration}
              onChange={(e) => effects.setChromaticAberration(e.target.checked)}
            />
            <label htmlFor="chromatic-enabled" className="text-sm font-medium">Chromatic Aberration</label>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="chromatic-aberration" className="text-xs text-gray-600 min-w-16">Intensity:</label>
            <input
              id="chromatic-aberration"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={effects.chromaticIntensity}
              onChange={(e) => effects.setChromaticIntensity(parseFloat(e.target.value))}
              className="flex-1"
              disabled={!effects.chromaticAberration}
            />
            <span className="text-xs text-gray-500 min-w-8">{effects.chromaticIntensity.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Noise Intensity */}
        <div>
          <div className="flex items-center space-x-2">
            <label htmlFor="noise-intensity" className="text-sm font-medium min-w-20">Noise:</label>
            <input
              id="noise-intensity"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={effects.noiseIntensity}
              onChange={(e) => effects.setNoiseIntensity(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs text-gray-500 min-w-8">{effects.noiseIntensity.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Contrast Boost */}
        <div>
          <div className="flex items-center space-x-2">
            <label htmlFor="contrast-boost" className="text-sm font-medium min-w-20">Contrast:</label>
            <input
              id="contrast-boost"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={effects.contrastBoost}
              onChange={(e) => effects.setContrastBoost(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs text-gray-500 min-w-8">{effects.contrastBoost.toFixed(1)}</span>
          </div>
        </div>
        
        {/* Light Bar Gradient */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={effects.lightBarGradient}
              onChange={(e) => effects.setLightBarGradient(e.target.checked)}
            />
            <span className="text-sm font-medium">Light Bar Gradient</span>
          </label>
        </div>
        
        {/* Binding Effects */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={effects.bindingEffects}
              onChange={(e) => effects.setBindingEffects(e.target.checked)}
            />
            <span className="text-sm font-medium">Binding Effects</span>
          </label>
        </div>

        {/* Baseline Wobble */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="baseline-wobble-enabled"
              checked={effects.baselineWobbleEnabled}
              onChange={(e) => effects.setBaselineWobbleEnabled(e.target.checked)}
            />
            <label htmlFor="baseline-wobble-enabled" className="text-sm font-medium">Baseline Wobble</label>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="baseline-wobble" className="text-xs text-gray-600 min-w-16">Intensity:</label>
            <input
              id="baseline-wobble"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={effects.baselineWobbleIntensity}
              onChange={(e) => effects.setBaselineWobbleIntensity(parseFloat(e.target.value))}
              className="flex-1"
              disabled={!effects.baselineWobbleEnabled}
            />
            <span className="text-xs text-gray-500 min-w-8">{effects.baselineWobbleIntensity.toFixed(1)}</span>
          </div>
        </div>

        {/* Font Size Variation */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id="font-size-variation-enabled"
              checked={effects.fontSizeVariationEnabled}
              onChange={(e) => effects.setFontSizeVariationEnabled(e.target.checked)}
            />
            <label htmlFor="font-size-variation-enabled" className="text-sm font-medium">Font Size Variation</label>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="font-size-variation" className="text-xs text-gray-600 min-w-16">Intensity:</label>
            <input
              id="font-size-variation"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={effects.fontSizeVariationIntensity}
              onChange={(e) => effects.setFontSizeVariationIntensity(parseFloat(e.target.value))}
              className="flex-1"
              disabled={!effects.fontSizeVariationEnabled}
            />
            <span className="text-xs text-gray-500 min-w-8">{effects.fontSizeVariationIntensity.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedRealismPanel;

