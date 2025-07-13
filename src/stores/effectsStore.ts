import { create } from 'zustand';

type EffectsState = {
  shadowEnabled: boolean;
  shadowAngle: number;
  shadowDistance: number;
  shadowBlur: number;
  shadowOpacity: number;
  textureStrength: number;
  scannerEnabled: boolean;
  handwritingRandomization: boolean;
  setShadowEnabled: (enabled: boolean) => void;
  setShadowAngle: (angle: number) => void;
  setShadowDistance: (distance: number) => void;
  setShadowBlur: (blur: number) => void;
  setShadowOpacity: (opacity: number) => void;
  setTextureStrength: (strength: number) => void;
  setScannerEnabled: (enabled: boolean) => void;
  setHandwritingRandomization: (enabled: boolean) => void;
};

export const useEffectsStore = create<EffectsState>((set) => ({
  shadowEnabled: true,
  shadowAngle: 45,
  shadowDistance: 5,
  shadowBlur: 10,
  shadowOpacity: 0.5,
  textureStrength: 0.5,
  scannerEnabled: false,
  handwritingRandomization: true,
  setShadowEnabled: (shadowEnabled) => set({ shadowEnabled }),
  setShadowAngle: (shadowAngle) => set({ shadowAngle }),
  setShadowDistance: (shadowDistance) => set({ shadowDistance }),
  setShadowBlur: (shadowBlur) => set({ shadowBlur }),
  setShadowOpacity: (shadowOpacity) => set({ shadowOpacity }),
  setTextureStrength: (textureStrength) => set({ textureStrength }),
  setScannerEnabled: (scannerEnabled) => set({ scannerEnabled }),
  setHandwritingRandomization: (handwritingRandomization) => set({ handwritingRandomization }),
})); 