'use client';

import React, { useCallback, useMemo, type ReactNode, useEffect, useState } from 'react';
import { createEditor, Descendant, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { useContentStore } from '@/stores/contentStore';
import { useStyleStore } from '@/stores/styleStore';
import { useFormattingStore } from '@/stores/formattingStore';
import { useEffectsStore } from '@/stores/effectsStore';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import SlateToolbar from './SlateToolbar';

import { CustomElement, CustomText } from '@/types/slate.d';
import { Editor as SlateEditor, Node, Path, Element } from 'slate';

const withConstraints = (editor: SlateEditor) => {
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry: [Node, Path]) => {
    const [node, path] = entry;
    if (path.length === 0) {
      if (editor.children.length === 0) {
        Transforms.insertNodes(editor, [{ type: 'paragraph', children: [{ text: '\u200B' }] }] as Node[]);
      }
      for (const [child, childPath] of Node.children(editor, [])) {
        if (Element.isElement(child) && !editor.isInline(child) && child.type !== 'paragraph') {
          Transforms.setNodes(editor, { type: 'paragraph' }, { at: childPath });
        }
      }
    }
    return normalizeNode(entry);
  };
  return editor;
};

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
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
  const [isMounted, setIsMounted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [internalContent, setInternalContent] = useState<Descendant[]>(content);
  
  const editor = useMemo(() => withConstraints(withHistory(withReact(createEditor()))), [editorKey]);
  const style = useStyleStore();
  const formatting = useFormattingStore();
  const effects = useEffectsStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Update editor when content prop changes
  useEffect(() => {
    if (JSON.stringify(content) !== JSON.stringify(internalContent)) {
      setInternalContent(content);
      setEditorKey(prev => prev + 1); // Force re-mount
    }
  }, [content, internalContent]);
  
  const handleChange = useCallback((newValue: Descendant[]) => {
    setInternalContent(newValue);
    setContent(newValue);
  }, [setContent]);

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
      children = <sub style={{ fontSize: `${style.superscriptSize}em` }}>{children}</sub>;
    }
    
    const text = props.leaf.text;
    
    if (isMounted && !isFocused && (effects.inkFlowVariation || effects.fontSizeVariationEnabled || effects.baselineWobbleEnabled)) {
      return (
        <span {...props.attributes}>
          {text.split('').map((char, index) => {
            const charStyle: React.CSSProperties = {};
            let transform = '';

            if (effects.inkFlowVariation) {
              const variation = (Math.random() - 0.5) * effects.inkFlowIntensity * 0.08;
              const rotation = (Math.random() - 0.5) * effects.inkFlowIntensity * 3;
              transform += `scale(${1 + variation}) rotate(${rotation}deg)`;
            }

            if (effects.baselineWobbleEnabled) {
              const wobble = Math.sin(index * 0.5 + Math.random() * 0.5) * effects.baselineWobbleIntensity * 2;
              transform += ` translateY(${wobble}px)`;
            }

            if (transform) {
              charStyle.transform = transform;
              charStyle.display = 'inline-block';
            }

            if (effects.fontSizeVariationEnabled && Math.random() < 0.2) {
              const variation = (Math.random() - 0.5) * effects.fontSizeVariationIntensity;
              charStyle.fontSize = `${style.fontSize * (1 + variation)}px`;
            }

            if (Object.keys(charStyle).length > 0) {
              return <span key={index} style={charStyle}>{char}</span>;
            }
            return char;
          })}
        </span>
      );
    }
    
    return <span {...props.attributes}>{children}</span>;
  }, [style, formatting, effects, isMounted, isFocused]);

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
    
    // Allow native copy/paste/select all to work
    if (event.key === 'c' || event.key === 'v' || event.key === 'a') {
      return;
    }
    
    event.preventDefault();
    switch (event.key) {
      case 'b': toggleFormat('bold'); break;
      case 'i': toggleFormat('italic'); break;
      case 'u': toggleFormat('underline'); break;
      case 'o': if (event.shiftKey) toggleFormat('superscript'); break;
      case 's': if (event.shiftKey) toggleFormat('subscript'); break;
      case 'm': insertMath(); break;
    }
  }, [editor]);

  const editorContent = (
    <Slate key={editorKey} editor={editor} initialValue={internalContent} onValueChange={handleChange}>
      {showToolbar && <SlateToolbar />}
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="outline-none slate-editor"
        style={{
          color: style.inkColor,
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSize}px`,
          letterSpacing: `${style.letterSpacing}px`,
          wordSpacing: `${style.wordSpacing}px`,
          lineHeight: style.lineHeight,
          whiteSpace: "pre-wrap",
          transform: `translateY(${style.baselineOffset}px)`,
          minHeight: '100px',
          padding: '8px',
          cursor: 'text',
          ...styleOverrides,
        }}
        spellCheck={false}
        autoFocus={false}
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