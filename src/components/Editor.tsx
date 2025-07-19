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
import { Editor as SlateEditor, Node, Path, Element, Text } from 'slate';

const withConstraints = (editor: SlateEditor) => {
  const { normalizeNode } = editor;
  editor.normalizeNode = (entry: [Node, Path]) => {
    const [node, path] = entry;
    
    // Ensure root level has at least one child
    if (path.length === 0) {
      if (editor.children.length === 0) {
        Transforms.insertNodes(editor, [{ type: 'paragraph', children: [{ text: '\u200B' }] }] as Node[]);
        return;
      }
      // Ensure all top-level children are block elements
      for (const [child, childPath] of Node.children(editor, [])) {
        if (Element.isElement(child) && !editor.isInline(child) && 
            !['paragraph', 'math', 'heading', 'indented', 'centered'].includes(child.type)) {
          Transforms.setNodes(editor, { type: 'paragraph' }, { at: childPath });
          return;
        }
      }
    }
    
    // Prevent invalid nesting by ensuring block elements are only at root level
    if (Element.isElement(node) && path.length > 1) {
      const parent = Node.parent(editor, path);
      if (Element.isElement(parent)) {
        // Block elements should not be nested inside other block elements
        if (['heading', 'math', 'paragraph'].includes(node.type) && 
            ['paragraph', 'heading', 'math'].includes(parent.type)) {
          // Split the parent and move this node to root level
          Transforms.liftNodes(editor, { at: path });
          return;
        }
      }
    }
    
    // Ensure text nodes are properly wrapped
    if (Element.isElement(node) && path.length === 1) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (!Element.isElement(child) && !Text.isText(child)) {
          Transforms.removeNodes(editor, { at: childPath });
          return;
        }
      }
    }
    
    return normalizeNode(entry);
  };
  return editor;
};

const withInlines = (editor: SlateEditor) => {
  const { isInline } = editor;
  editor.isInline = (element) => {
    // Only inline math should be treated as inline
    if (element.type === 'math' && element.inline) {
      return true;
    }
    // Block elements should never be inline
    if (['heading', 'math', 'paragraph'].includes(element.type)) {
      return false;
    }
    // Other custom elements like indented and centered can be inline
    return element.type === 'indented' || element.type === 'centered' || isInline(element);
  };
  return editor;
};

const withVoids = (editor: SlateEditor) => {
  const { isVoid } = editor;
  editor.isVoid = (element) => element.type === 'math' || isVoid(element);
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
  
  const editor = useMemo(() => 
    withVoids(withInlines(withConstraints(withHistory(withReact(createEditor()))))), 
    [editorKey] // eslint-disable-next-line react-hooks/exhaustive-deps
  );
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
    let elStyle: React.CSSProperties = { lineHeight: style.lineHeight };
    if (props.element.marginLeft) elStyle.paddingLeft = `${props.element.marginLeft}px`;
    if (props.element.marginTop) elStyle.marginTop = `${props.element.marginTop}px`;
    if (props.element.color) elStyle.color = props.element.color;
    if (props.element.fontSize) elStyle.fontSize = `${props.element.fontSize}px`;
    if (props.element.align === 'center') elStyle.textAlign = 'center';

    switch (props.element.type) {
      case 'heading':
        return <h2 {...props.attributes} style={elStyle}>{props.children}</h2>;
      case 'math':
        const mathStyle = {
          ...elStyle,
          margin: `0 ${style.mathSpacing}px`,
          display: props.element.inline ? 'inline-block' : 'block',
          fontFamily: style.fontFamily,
          fontSize: `${style.fontSize * 1.5}px`,  // Further increased size
          color: style.inkColor,
          lineHeight: props.element.inline ? style.lineHeight : 2.0  // Increased spacing for block math
        };
        const Wrapper = props.element.inline ? 'span' : 'div';
        return (
          <Wrapper {...props.attributes} style={mathStyle} className="math-container">
            {props.element.inline ? (
              <InlineMath math={props.element.formula || ''} />
            ) : (
              <BlockMath math={props.element.formula || ''} />
            )}
            {props.children}
          </Wrapper>
        );
      case 'indented':
        return <div {...props.attributes} style={{ ...elStyle, paddingLeft: '20px' }}>{props.children}</div>;
      case 'centered':
        return <div {...props.attributes} style={{ ...elStyle, textAlign: 'center' }}>{props.children}</div>;
      default:
        return <p {...props.attributes} style={elStyle}>{props.children}</p>;
    }
  }, [style.mathSpacing, style.lineHeight, style.fontFamily, style.fontSize, style.inkColor]);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    let { children } = props;
    // Existing formatting
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
    // New formatting
    if (props.leaf.strike) {
      children = <s>{children}</s>;
    }
    if (props.leaf.small) {
      children = <small>{children}</small>;
    }
    if (props.leaf.mark) {
      children = <mark>{children}</mark>;
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
    
    // For focused or no effects, add styles to the span
    const leafStyle: React.CSSProperties = {};
    if (props.leaf.color) leafStyle.color = props.leaf.color;
    if (props.leaf.fontSize) leafStyle.fontSize = `${props.leaf.fontSize}px`;
    
    return <span {...props.attributes} style={leafStyle}>{children}</span>;
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
  }, [editor]); // eslint-disable-next-line react-hooks/exhaustive-deps

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