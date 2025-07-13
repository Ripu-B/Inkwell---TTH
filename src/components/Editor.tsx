'use client';

import React, { useCallback, useMemo, type ReactNode } from 'react';
import { createEditor, Descendant, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { useContentStore } from '@/stores/contentStore';
import { useStyleStore } from '@/stores/styleStore';
import { useFormattingStore } from '@/stores/formattingStore';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SlateToolbar from './SlateToolbar';

import { CustomElement, CustomText } from '@/types/slate.d';

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'Start writing your notes here...' }],
  },
];

interface RenderElementProps {
  attributes: Record<string, unknown>;
  children: ReactNode;
  element: CustomElement;
}

interface RenderLeafProps {
  attributes: Record<string, unknown>;
  children: ReactNode;
  leaf: CustomText;
}

interface EditorProps {
  content: Descendant[];
  setContent: (newValue: Descendant[]) => void;
  showToolbar?: boolean;
  noContainer?: boolean;
  styleOverrides?: React.CSSProperties;
  placeholder?: string;
}

const Editor = ({
  content,
  setContent,
  showToolbar = true,
  noContainer = false,
  styleOverrides = {},
  placeholder = 'Enter your text here...',
}: EditorProps) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const style = useStyleStore();
  const formatting = useFormattingStore();

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'math':
        return (
          <span {...props.attributes} style={{ margin: `0 ${style.mathSpacing}px` }}>
            {props.element.inline ? (
              <InlineMath math={props.element.formula || ''} />
            ) : (
              <BlockMath math={props.element.formula || ''} />
            )}
            {props.children}
          </span>
        );
      default:
        return <p {...props.attributes} style={{ lineHeight: style.lineHeight }}>{props.children}</p>;
    }
  }, [style.mathSpacing, style.lineHeight]);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    let { children } = props;
    if (formatting.bold || props.leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (formatting.italic || props.leaf.italic) {
      children = <em>{children}</em>;
    }
    if (formatting.underline || props.leaf.underline) {
      children = <u>{children}</u>;
    }
    if (formatting.superscript || props.leaf.superscript) {
      children = <sup style={{ fontSize: `${style.superscriptSize}em` }}>{children}</sup>;
    }
    if (formatting.subscript || props.leaf.subscript) {
      children = <sub style={{ fontSize: `${style.subscriptSize}em` }}>{children}</sub>;
    }
    return <span {...props.attributes}>{children}</span>;
  }, [style.superscriptSize, style.subscriptSize, formatting.bold, formatting.italic, formatting.underline, formatting.superscript, formatting.subscript]);

  const isMarkActive = (format: string) => {
    const marks = editor.marks;
    return marks ? marks[format as keyof typeof marks] === true : false;
  };

  const toggleFormat = (format: 'bold' | 'italic' | 'underline' | 'superscript' | 'subscript') => {
    const isActive = isMarkActive(format);
    if (isActive) {
      editor.removeMark(format);
    } else {
      editor.addMark(format, true);
    }
  };

  const insertMath = () => {
    const formula = prompt('Enter LaTeX formula:');
    if (formula) {
      const inline = prompt('Inline? (y/n)') === 'y';
      Transforms.insertNodes(editor, [{
        type: 'math',
        formula,
        inline,
        children: [{ text: '' }],
      }]);
    }
  };

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    switch (event.key) {
      case 'b': toggleFormat('bold'); break;
      case 'i': toggleFormat('italic'); break;
      case 'u': toggleFormat('underline'); break;
      case 'S': if (event.shiftKey) toggleFormat('superscript'); break;
      case 's': if (event.shiftKey) toggleFormat('subscript'); break;
      case 'm': insertMath(); break;
    }
  }, [editor]);

  const editorContent = (
    <Slate editor={editor} initialValue={content} onValueChange={(newValue) => setContent(newValue as Descendant[])}>
      {showToolbar && <SlateToolbar />}
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        className="outline-none slate-editor"
        style={{
          color: style.inkColor,
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSize}px`,
          letterSpacing: `${style.letterSpacing}px`,
          wordSpacing: `${style.wordSpacing}px`,
          lineHeight: style.lineHeight,
          ...styleOverrides
        }}
      />
    </Slate>
  );

  return noContainer ? editorContent : (
    <div className="editor-container p-4 bg-white rounded-lg shadow-md">
      {editorContent}
    </div>
  );
};

export default Editor; 