# Inkwell: Realistic Handwritten Document Generator

Inkwell is a Next.js application that allows users to create and customize documents with realistic handwriting effects, mathematical notation support, and various realism enhancements. It uses Slate.js for the editor, KaTeX for math rendering, and canvas-based rendering for previews and exports.

## Features

- **Rich Text Editing**: Powered by Slate.js with support for bold, italic, underline, superscript, subscript, and more.
- **Mathematical Notation**: Seamless LaTeX integration via KaTeX for inline and block math equations.
- **Realism Effects**: Includes ink flow variation, baseline wobble, font size variation, paper textures, document weathering, shadows, and more.
- **Preview and Export**: Canvas-based preview with export to PNG and PDF.
- **Customization Panels**: Adjust styles, formatting, effects, and advanced realism settings.
- **Plugin System**: Extensible with community plugins for fonts, textures, etc. (in development).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/inkwell.git
   cd inkwell
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Editor**: Type or paste content into the editor. Use Ctrl + keys for formatting (e.g., Ctrl+B for bold).
- **Math Insertion**: Use the 'fx' button or Ctrl+M to insert LaTeX math.
- **Customization**: Use side panels to adjust styles, effects, and export settings.
- **Preview**: Live canvas preview updates with changes.
- **Export**: Click 'Export PNG' or 'Export PDF' in the preview section.

## Project Structure

- `src/app/`: Next.js pages and layout.
- `src/components/`: React components like Editor, PreviewCanvas, panels.
- `src/stores/`: Zustand stores for state management.
- `src/types/`: TypeScript definitions.
- `src/utils/`: Utilities like generate.ts, paperTexture.ts.

## Dependencies

- Next.js
- Slate.js & slate-react
- react-katex
- html2canvas
- jspdf
- tailwindcss
- zustand
- And others (see package.json)

## Troubleshooting

- **Hydration Errors**: Ensure inline elements like math use <span> not <div>.
- **Math Rendering Issues**: Verify LaTeX syntax; fallback to plain text if invalid.
- **Build Errors**: If encountering missing modules like lightningcss, ensure all dependencies are installed. For CI issues, add 'lightningcss' explicitly to package.json.
- **Performance**: For large documents, reduce realism effects intensity.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Open a pull request.

## License

MIT License. See LICENSE file for details.