# Inkwell: The Analog Document Simulator

Inkwell is a cutting-edge digital writing application designed to bridge the gap between digital text and analog artifacts. It transforms plain text into highly realistic, customizable, and aesthetically pleasing handwritten documents. The system prioritizes photorealism, offering deep customization and a powerful engine for simulating real-world paper, ink, and writing instruments.

## Table of Contents
1. [Core Philosophy](#core-philosophy)
2. [How It Works: The Rendering Pipeline](#how-it-works-the-rendering-pipeline)
3. [The Realism Engine: A Deep Dive](#the-realism-engine-a-deep-dive)
4. [Technical Architecture](#technical-architecture)
5. [Key Components](#key-components)
6. [Markup Parser](#markup-parser)
7. [State Management](#state-management)
8. [New Features](#new-features)
9. [Setup & Installation](#setup--installation)
10. [Deployment](#deployment)
11. [Known Issues & Future Work](#known-issues--future-work)
12. [License](#license)

## Core Philosophy

Inkwell is built on three guiding principles:

*   **Realism First**: Every feature serves the primary goal of creating a believable analog artifact. The simulation must be convincing to the eye.
*   **Deep Customization**: Users should have granular control over every aspect of the final document, from the paper texture to the ink's behavior.
*   **Performance by Default**: The rendering pipeline must be optimized for a smooth user experience, even with complex documents and effects.

## How It Works: The Rendering Pipeline

Inkwell's core is its sophisticated rendering pipeline, which translates user input and style settings into a final, rendered image. This process is currently managed through two distinct but related mechanisms:

1.  **Live DOM-Based Preview (`PaperEditor.tsx`)**: For a fast and interactive editing experience, the main editor uses React components and advanced CSS to render the document in real-time. This preview is excellent for immediate feedback but is not suitable for high-fidelity image export.

2.  **Canvas-Based Export (`generate.ts` & `PreviewCanvas.tsx`)**: To generate high-quality, portable images and PDFs, Inkwell uses two different strategies:
    *   **`generate.ts` (`html2canvas`)**: This utility captures the live DOM, applies additional effects through JavaScript manipulation, and uses the `html2canvas` library to take a "screenshot." This method is powerful but can be slow and occasionally inaccurate.
    *   **`PreviewCanvas.tsx`**: This component is an independent canvas-based renderer that attempts to replicate the appearance of the live preview. It offers more control over the final output but is not yet fully synchronized with all the effects available in the CSS preview.

This dual-pipeline approach is a known issue and is slated for a future refactor into a single, unified canvas-based rendering engine. (See `ISSUES.md` for more details).

## The Realism Engine: A Deep Dive

Inkwell's realism comes from a combination of procedural generation, subtle randomization, and layered post-processing effects. Here's how some of the key effects are achieved:

### Handwriting and Ink Simulation

Instead of just rendering text, the engine simulates the nuances of handwriting:

*   **Ink Flow Variation**: To mimic the way ink flows from a pen, the engine applies character-level variations. Each character can have its `globalAlpha` (opacity) slightly modulated, and its thickness can be adjusted to simulate ink pooling or thinning.
*   **Handwriting Randomization**: No two handwritten letters are identical. The engine introduces subtle, random variations to each character's:
    *   **Rotation**: A slight tilt, left or right.
    *   **Scale**: A minor change in size.
    *   **Baseline Offset**: A small vertical shift, making the text appear to sit less rigidly on the line.
*   **Pen Pressure Simulation**: The system simulates the effect of varying pen pressure by modulating font weight and adding a subtle blur (`text-shadow`) to create a softer, more natural ink bleed.

```javascript
// Example of character-level randomization from generate.ts
for (let i = 0; i < text.length; i++) {
  const char = text[i];
  const variation = (Math.random() - 0.5) * effects.inkFlowIntensity * 0.08;
  const rotation = (Math.random() - 0.5) * effects.inkFlowIntensity * 3;

  newHTML += `<span class="ink-flow-text" style="transform: scale(${1 + variation}) rotate(${rotation}deg);">${char}</span>`;
}
```

### Paper and Document Effects

The paper is more than just a background color; it's a textured surface with its own history.

*   **Procedural Paper Texture**: The `paperTexture.ts` utility generates a unique paper texture on a canvas using multiple layers of Perlin noise, faint splotches, and procedurally drawn fibers. This avoids repetitive, tiled textures and creates a more organic feel.
*   **Document Weathering**: To simulate age and wear, a semi-transparent overlay with stains, creases, and yellowing is applied over the document.
*   **Scanner Emulation**: This is a post-processing step that mimics the artifacts of a flatbed scanner:
    *   **Contrast Boost**: Increases the difference between light and dark areas.
    *   **Chromatic Aberration**: A subtle separation of the red and blue color channels at high-contrast edges, simulating lens distortion.
    *   **Scanner Noise**: A layer of monochromatic noise to simulate sensor imperfections.
    *   **Light Bar Gradient**: A faint, wide gradient that simulates the scanner's moving light source.

```javascript
// Example of the Chromatic Aberration algorithm from generate.ts
const applyChromaticAberration = (ctx, canvas, intensity) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // ...
  // Red channel shifted left
  const redIndex = ((y * canvas.width + Math.max(0, x - offset)) * 4);
  // Blue channel shifted right
  const blueIndex = ((y * canvas.width + Math.min(canvas.width - 1, x + offset)) * 4);
  // ...
};
```

## Technical Architecture

*   **Framework**: Next.js with React
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS & PostCSS
*   **State Management**: Zustand
*   **Text Editor**: Slate.js
*   **Rendering**: DOM (for live preview) and HTML5 Canvas (for export)
*   **Libraries**: `html2canvas`, `jspdf`, `katex`

## Key Components

*   `src/app/page.tsx`: The main application layout, bringing all the pieces together.
*   `src/components/PaperEditor.tsx`: The primary user-facing component. It renders the live, editable paper using DOM elements and CSS.
*   `src/components/Editor.tsx`: The Slate.js-based rich text editor.
*   `src/components/CustomizationPanel.tsx`: The UI for controlling all the style and effect parameters.
*   `src/utils/generate.ts`: Contains the logic for generating images using `html2canvas` and applying post-processing effects.
*   `src/components/PreviewCanvas.tsx`: A secondary, canvas-based renderer used for a more accurate (though currently incomplete) preview.
*   `src/utils/markupParser.ts`: Parses custom markup syntax into Slate.js document nodes.

## Markup Parser

Inkwell includes a powerful markup parser (`src/utils/markupParser.ts`) that allows users to write content using a custom syntax, which is then transformed into richly formatted text. This parser bridges the gap between plain text input and the structured document model used by Slate.js.

### Supported Markup Commands

The markup parser supports various formatting commands:

* **Inline Formatting**:
  * `{b: text}` - Bold text
  * `{i: text}` - Italic text
  * `{u: text}` - Underlined text
  * `{strike: text}` - Strikethrough text
  * `{small: text}` - Small text
  * `{mark: text}` - Highlighted text
  * `{sup: text}` - Superscript
  * `{sub: text}` - Subscript

* **Block Formatting**:
  * `{heading: text}` - Creates a heading
  * `{center: text}` - Centers the text
  * `{margin: text}` - Adds indentation to the text
  * `{top: spacing}` - Adds top margin spacing

* **Special Elements**:
  * `{latex: formula}` - Renders mathematical formulas using KaTeX
  * `{br}` - Line break

* **Styling Parameters**:
  * `{b: text, color: #FF0000}` - Apply color to formatted text
  * `{i: text, font-size: 18}` - Apply font size to formatted text

### How the Parser Works

The markup parser processes text in several steps:

1. **Tokenization**: The text is split into lines and blocks enclosed in curly braces `{}`.
2. **Block Parsing**: Each block is parsed to extract the command, content, and parameters.
3. **Node Creation**: Appropriate Slate.js nodes are created based on the parsed commands.
4. **Formatting Application**: Styles and formatting are applied to the nodes.

This allows for complex document structures to be created from simple text input, making it easy to programmatically generate documents or import content from other sources.

## State Management

Inkwell uses **Zustand** for lightweight and efficient state management. The state is divided into several stores:

*   `contentStore`: Holds the Slate.js document state for the header, main content, and side notes.
*   `styleStore`: Manages all visual styling options (colors, fonts, spacing, paper size, etc.).
*   `effectsStore`: Manages the settings for all realism effects (shadows, textures, scanner emulation, etc.).
*   `formattingStore`: Tracks the currently active formatting options (bold, italic, etc.).

## New Features

### SimpleA4 Page Format

The SimpleA4 format provides a clean, minimalist writing experience:

* **Streamlined Design**: Only includes the main text input area without header or side margins
* **Modified A4 Size**: Slightly smaller than standard A4, with 2.6cm cut from both height and width
* **Consistent Line Spacing**: Fixed 0.7cm (26.5px) line spacing for optimal writing experience
* **No Margins**: Removes all margin elements for a distraction-free writing surface

To use the SimpleA4 format:
1. Open the Customization Panel
2. Under "Styles", find the "Page Size" dropdown
3. Select "Simple A4 (Lines Only)"

### Multi-Color Ink Feature

The multi-color ink feature allows you to use different colors for different parts of your text:

* **Color Selection**: Choose from preset colors or use a custom color picker
* **Contextual Use**: Ideal for distinguishing between different types of content (e.g., black for questions, blue for answers)
* **Real-time Preview**: See color changes immediately as you type

To use multi-color ink:
1. Select the text you want to color
2. In the Customization Panel under "Text Formatting", use the color picker or preset color buttons
3. The selected text will change to your chosen color

This feature is perfect for:
* Creating visual hierarchy in your notes
* Highlighting important information
* Distinguishing between different voices or sections
* Making your documents more visually engaging

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Ripu-B/Inkwell---TTH.git
    cd inkwell
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Deployment

Inkwell is configured for easy deployment to GitHub Pages using GitHub Actions:

1. **Build for Production:**
   ```bash
   npm run build
   ```
   This will generate static files in the `out` directory.

2. **GitHub Pages Deployment:**
   The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the application to GitHub Pages whenever changes are pushed to the main branch.

3. **Manual Deployment:**
   You can also manually deploy the application by pushing the `out` directory to the `gh-pages` branch:
   ```bash
   npm run build
   npx gh-pages -d out
   ```

## Known Issues & Future Work

This project is under active development. For a detailed list of current bugs, architectural challenges, and planned improvements, please see the **`ISSUES.md`** file in the root of the repository. The most significant planned change is the unification of the rendering pipeline to a single, canvas-based engine.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.