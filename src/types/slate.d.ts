import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';

// Extend CustomElement with new types and properties
export type CustomElement = {
  type: 'paragraph' | 'math' | 'heading' | 'indented' | 'centered' | 'top';
  inline?: boolean;
  formula?: string;
  align?: string;
  marginLeft?: number;
  marginTop?: number;
  color?: string;
  fontSize?: number;
  children: (CustomElement | CustomText)[];
};

// Extend CustomText with new marks
export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  superscript?: boolean;
  subscript?: boolean;
  strike?: boolean;
  small?: boolean;
  mark?: boolean;
  color?: string;
  fontSize?: number;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
} 