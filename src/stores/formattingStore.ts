'use client';

import { create } from 'zustand';

type FormattingState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  superscript: boolean;
  subscript: boolean;
  textColor: string | null;
  toggleBold: () => void;
  toggleItalic: () => void;
  toggleUnderline: () => void;
  toggleSuperscript: () => void;
  toggleSubscript: () => void;
  setTextColor: (color: string | null) => void;
  resetFormatting: () => void;
};

export const useFormattingStore = create<FormattingState>((set) => ({
  bold: false,
  italic: false,
  underline: false,
  superscript: false,
  subscript: false,
  textColor: null,
  toggleBold: () => set((state) => ({ bold: !state.bold })),
  toggleItalic: () => set((state) => ({ italic: !state.italic })),
  toggleUnderline: () => set((state) => ({ underline: !state.underline })),
  toggleSuperscript: () => set((state) => ({ superscript: !state.superscript })),
  toggleSubscript: () => set((state) => ({ subscript: !state.subscript })),
  setTextColor: (textColor) => set({ textColor }),
  resetFormatting: () => set({ 
    bold: false, 
    italic: false, 
    underline: false, 
    superscript: false, 
    subscript: false,
    textColor: null
  }),
}));
