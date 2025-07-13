import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

export type CustomElement = {
  type: 'paragraph' | 'math';
  inline?: boolean;
  formula?: string;
  children: (CustomElement | CustomText)[];
};

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  superscript?: boolean;
  subscript?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
} 