import { create } from 'zustand';
import { Descendant } from 'slate';

type ContentState = {
  headerContent: Descendant[];
  sideContent: Descendant[];
  mainContent: Descendant[];
  setHeaderContent: (content: Descendant[]) => void;
  setSideContent: (content: Descendant[]) => void;
  setMainContent: (content: Descendant[]) => void;
};

const emptyInitialValue: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }];

export const useContentStore = create<ContentState>((set) => ({
  headerContent: emptyInitialValue,
  sideContent: emptyInitialValue,
  mainContent: emptyInitialValue,
  setHeaderContent: (headerContent: Descendant[]) => set({ headerContent }),
  setSideContent: (sideContent: Descendant[]) => set({ sideContent }),
  setMainContent: (mainContent: Descendant[]) => set({ mainContent }),
})); 