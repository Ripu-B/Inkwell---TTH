'use client';
import React from 'react';
import { useSlate, ReactEditor } from 'slate-react';
import { Editor, Transforms, Element } from 'slate';

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

const SlateToolbar = () => {
  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-t-lg border-b">
      <MarkButton format="bold" icon="B" />
      <MarkButton format="italic" icon="I" />
      <MarkButton format="underline" icon="U" />
      <MarkButton format="superscript" icon="x²" />
      <MarkButton format="subscript" icon="x₂" />
      <MathButton />
    </div>
  );
};

export default SlateToolbar; 