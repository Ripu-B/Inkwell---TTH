# Inkwell Color System Test Examples

## How to Use Multi-Color Text

The Inkwell color system supports multiple ways to apply colors to your text:

### Method 1: Using the Editor Toolbar
1. Type your text (e.g., "Question: What is the capital of France?")
2. Select the text you want to color (e.g., select "Question:")
3. Click the color button in the toolbar (the "A" with a colored underline)
4. Choose a color from the palette or use the color picker
5. The selected text will now have that color applied

### Method 2: Using the Customization Panel
1. Select the text you want to color in the editor
2. In the Customization Panel, under "Text Formatting"
3. Use the "Selected Text Color" picker to choose a color
4. Click one of the preset color buttons for quick access

### Method 3: Using Markup Syntax
```
{b: Question:, color: #000000} What is the capital of France?
{i: Answer:, color: #0000FF} The capital of France is Paris.
```

## Example Multi-Color Document

### Questions and Answers Format
```
{b: Q1:, color: #000000} What is 2 + 2?
{i: A1:, color: #0000FF} The answer is 4.

{b: Q2:, color: #000000} What is the largest planet?
{i: A2:, color: #0000FF} Jupiter is the largest planet in our solar system.
```

### Color-Coded Notes
```
{b: Important:, color: #FF0000} This is a critical note.
{i: Note:, color: #008000} This is a regular note.
{u: Reference:, color: #800080} See page 42 for more details.
```

## Current Issues and Workarounds

### Issue: Colors not preserved in generation
**Workaround**: Make sure to:
1. Apply colors to specific text selections, not just set the global formatting color
2. Use the toolbar color picker for more reliable results
3. Save your document before generating to ensure all formatting is preserved

### Issue: Preview canvas doesn't show colors correctly
**Workaround**: The live preview in the editor is more accurate than the canvas preview. Focus on the editor preview for color accuracy.

## Testing Instructions

1. Create a new document
2. Type: "Black text here"
3. Press Enter for new line
4. Type: "Blue text here"
5. Select "Blue text here" and apply blue color using toolbar
6. Type more text - it should return to black
7. Generate the image and verify both colors are preserved

## Color Hierarchy

The system uses this priority for colors:
1. Text-level color (applied directly to selected text)
2. Formatting color (temporary color for new text)
3. Section color (header, main content, side notes)
4. Global ink color (default for all text)

