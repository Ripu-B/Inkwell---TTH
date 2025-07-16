import { create } from 'zustand';

type EffectsState = {
  // Shadow effects
  shadowEnabled: boolean;
  shadowAngle: number;
  shadowDistance: number;
  shadowBlur: number;
  shadowOpacity: number;
  
  // Texture effects
  textureStrength: number;
  
  // Scanner effects
  scannerEnabled: boolean;
  
  // Handwriting effects
  handwritingRandomization: boolean;
  
  // Ink flow effects
  inkFlowVariation: boolean;
  inkFlowIntensity: number;
  
  // Paper grain effects
  paperGrainEnabled: boolean;
  paperGrainIntensity: number;
  
  // Pen pressure effects
  penPressureVariation: boolean;
  penPressureIntensity: number;
  
  // Document weathering effects
  documentWeathering: boolean;
  weatheringIntensity: number;
  
  // Chromatic aberration effects
  chromaticAberration: boolean;
  chromaticIntensity: number;
  
  // Noise effects
  noiseIntensity: number;
  
  // Contrast effects
  contrastBoost: number;
  
  // Light bar gradient effects
  lightBarGradient: boolean;
  
  // Binding effects
  bindingEffects: boolean;
  
  // New text realism effects
  baselineWobbleEnabled: boolean;
  baselineWobbleIntensity: number;
  fontSizeVariationEnabled: boolean;
  fontSizeVariationIntensity: number;
  
  // Shadow setters
  setShadowEnabled: (enabled: boolean) => void;
  setShadowAngle: (angle: number) => void;
  setShadowDistance: (distance: number) => void;
  setShadowBlur: (blur: number) => void;
  setShadowOpacity: (opacity: number) => void;
  
  // Texture setters
  setTextureStrength: (strength: number) => void;
  
  // Scanner setters
  setScannerEnabled: (enabled: boolean) => void;
  
  // Handwriting setters
  setHandwritingRandomization: (enabled: boolean) => void;
  
  // Ink flow setters
  setInkFlowVariation: (enabled: boolean) => void;
  setInkFlowIntensity: (intensity: number) => void;
  
  // Paper grain setters
  setPaperGrainEnabled: (enabled: boolean) => void;
  setPaperGrainIntensity: (intensity: number) => void;
  
  // Pen pressure setters
  setPenPressureVariation: (enabled: boolean) => void;
  setPenPressureIntensity: (intensity: number) => void;
  
  // Document weathering setters
  setDocumentWeathering: (enabled: boolean) => void;
  setWeatheringIntensity: (intensity: number) => void;
  
  // Chromatic aberration setters
  setChromaticAberration: (enabled: boolean) => void;
  setChromaticIntensity: (intensity: number) => void;
  
  // Noise setters
  setNoiseIntensity: (intensity: number) => void;
  
  // Contrast setters
  setContrastBoost: (boost: number) => void;
  
  // Light bar gradient setters
  setLightBarGradient: (enabled: boolean) => void;
  
  // Binding effects setters
  setBindingEffects: (enabled: boolean) => void;
  
  // New text realism setters
  setBaselineWobbleEnabled: (enabled: boolean) => void;
  setBaselineWobbleIntensity: (intensity: number) => void;
  setFontSizeVariationEnabled: (enabled: boolean) => void;
  setFontSizeVariationIntensity: (intensity: number) => void;
  
  // Loading state
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
};

export const useEffectsStore = create<EffectsState>((set) => ({
  // Shadow defaults
  shadowEnabled: true,
  shadowAngle: 45,
  shadowDistance: 5,
  shadowBlur: 10,
  shadowOpacity: 0.5,
  
  // Texture defaults
  textureStrength: 0.5,
  
  // Scanner defaults
  scannerEnabled: false,
  
  // Handwriting defaults
  handwritingRandomization: true,
  
  // Ink flow defaults
  inkFlowVariation: true,
  inkFlowIntensity: 0.5,
  
  // Paper grain defaults
  paperGrainEnabled: true,
  paperGrainIntensity: 0.3,
  
  // Pen pressure defaults
  penPressureVariation: true,
  penPressureIntensity: 0.4,
  
  // Document weathering defaults
  documentWeathering: false,
  weatheringIntensity: 0.2,
  
  // Chromatic aberration defaults
  chromaticAberration: false,
  chromaticIntensity: 0.3,
  
  // Noise defaults
  noiseIntensity: 0.2,
  
  // Contrast defaults
  contrastBoost: 1.0,
  
  // Light bar gradient defaults
  lightBarGradient: false,
  
  // Binding effects defaults
  bindingEffects: false,
  
  // New text realism defaults
  baselineWobbleEnabled: false,
  baselineWobbleIntensity: 0.2,
  fontSizeVariationEnabled: false,
  fontSizeVariationIntensity: 0.1,
  
  // Loading state default
  isGenerating: false,
  
  // Shadow setters
  setShadowEnabled: (shadowEnabled) => set({ shadowEnabled }),
  setShadowAngle: (shadowAngle) => set({ shadowAngle }),
  setShadowDistance: (shadowDistance) => set({ shadowDistance }),
  setShadowBlur: (shadowBlur) => set({ shadowBlur }),
  setShadowOpacity: (shadowOpacity) => set({ shadowOpacity }),
  
  // Texture setters
  setTextureStrength: (textureStrength) => set({ textureStrength }),
  
  // Scanner setters
  setScannerEnabled: (scannerEnabled) => set({ scannerEnabled }),
  
  // Handwriting setters
  setHandwritingRandomization: (handwritingRandomization) => set({ handwritingRandomization }),
  
  // Ink flow setters
  setInkFlowVariation: (inkFlowVariation) => set({ inkFlowVariation }),
  setInkFlowIntensity: (inkFlowIntensity) => set({ inkFlowIntensity }),
  
  // Paper grain setters
  setPaperGrainEnabled: (paperGrainEnabled) => set({ paperGrainEnabled }),
  setPaperGrainIntensity: (paperGrainIntensity) => set({ paperGrainIntensity }),
  
  // Pen pressure setters
  setPenPressureVariation: (penPressureVariation) => set({ penPressureVariation }),
  setPenPressureIntensity: (penPressureIntensity) => set({ penPressureIntensity }),
  
  // Document weathering setters
  setDocumentWeathering: (documentWeathering) => set({ documentWeathering }),
  setWeatheringIntensity: (weatheringIntensity) => set({ weatheringIntensity }),
  
  // Chromatic aberration setters
  setChromaticAberration: (chromaticAberration) => set({ chromaticAberration }),
  setChromaticIntensity: (chromaticIntensity) => set({ chromaticIntensity }),
  
  // Noise setters
  setNoiseIntensity: (noiseIntensity) => set({ noiseIntensity }),
  
  // Contrast setters
  setContrastBoost: (contrastBoost) => set({ contrastBoost }),
  
  // Light bar gradient setters
  setLightBarGradient: (lightBarGradient) => set({ lightBarGradient }),
  
  // Binding effects setters
  setBindingEffects: (bindingEffects) => set({ bindingEffects }),
  
  // New text realism setters
  setBaselineWobbleEnabled: (baselineWobbleEnabled) => set({ baselineWobbleEnabled }),
  setBaselineWobbleIntensity: (baselineWobbleIntensity) => set({ baselineWobbleIntensity }),
  setFontSizeVariationEnabled: (fontSizeVariationEnabled) => set({ fontSizeVariationEnabled }),
  setFontSizeVariationIntensity: (fontSizeVariationIntensity) => set({ fontSizeVariationIntensity }),
  
  // Loading state setter
  setIsGenerating: (isGenerating) => set({ isGenerating }),
})); 