'use client';
import React, { useState } from 'react';
import { useSlate, ReactEditor } from 'slate-react';
import { Editor, Transforms, Element } from 'slate';
import { parseMarkup } from '../utils/markupParser';

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format as keyof typeof marks] === true : false;
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// Set color mark on the selected text
const setColorMark = (editor: Editor, color: string) => {
  Editor.addMark(editor, 'color', color);
};

const MarkButton = ({ format, icon }: { format: string, icon: string }) => {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);
  return (
    <button
      className={`p-2 rounded ${isActive ? 'bg-gray-300' : 'bg-gray-100'}`}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </button>
  );
};

const ColorButton = () => {
  const editor = useSlate();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  
  const commonColors = [
    '#000000', // Black
    '#0000FF', // Blue
    '#FF0000', // Red
    '#008000', // Green
    '#800080', // Purple
    '#FFA500', // Orange
  ];
  
  return (
    <div className="relative">
      <button
        className="p-2 rounded bg-gray-100 flex items-center"
        style={{ borderBottom: `3px solid ${selectedColor}` }}
        onMouseDown={(event) => {
          event.preventDefault();
          setShowColorPicker(!showColorPicker);
        }}
      >
        <span style={{ color: selectedColor }}>A</span>
      </button>
      
      {showColorPicker && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-white shadow-lg rounded z-50 flex flex-col gap-2">
          <div className="flex flex-wrap gap-1">
            {commonColors.map((color) => (
              <button
                key={color}
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setColorMark(editor, color);
                  setSelectedColor(color);
                  setShowColorPicker(false);
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full"
            />
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
              onMouseDown={(e) => {
                e.preventDefault();
                setColorMark(editor, selectedColor);
                setShowColorPicker(false);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const insertMath = (editor: Editor) => {
  const formula = prompt('Enter LaTeX formula:');
  if (formula) {
    const inline = prompt('Inline? (y/n)') === 'y';
    Transforms.insertNodes(editor, [{
      type: 'math',
      inline,
      formula,
      children: [{ text: '' }],
    }]);
    ReactEditor.focus(editor);
  }
};

const MathButton = () => {
    const editor = useSlate();
    return (
        <button
            className="p-2 rounded bg-gray-100"
            onMouseDown={(event) => {
                event.preventDefault();
                insertMath(editor);
            }}
        >
            fx
        </button>
    )
}

const InsertMarkupButton = () => {
  const editor = useSlate();
  return (
    <button
      className="p-2 rounded bg-gray-100"
      onMouseDown={(event) => {
        event.preventDefault();
        const markup = prompt('Enter markup syntax:');
        if (markup) {
          const parsed = parseMarkup(markup);
          // @ts-ignore
          Transforms.insertNodes(editor, parsed as unknown as Node[]);
        }
      }}
    >
      Markup
    </button>
  );
};

const SlateToolbar = () => {
  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-t-lg border-b">
      <MarkButton format="bold" icon="B" />
      <MarkButton format="italic" icon="I" />
      <MarkButton format="underline" icon="U" />
      <MarkButton format="superscript" icon="x²" />
      <MarkButton format="subscript" icon="x₂" />
      <ColorButton />
      <MathButton />
      <InsertMarkupButton />
    </div>
  );
};

export default SlateToolbar;