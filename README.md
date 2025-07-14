# Inkwell: The Analog Document Simulator

Inkwell is a cutting-edge digital writing application designed to bridge the gap between digital text and analog artifacts. It transforms plain text into highly realistic, customizable, and aesthetically pleasing handwritten documents. The system prioritizes photorealism, offering deep customization and a powerful engine for simulating real-world paper, ink, and writing instruments.

## Table of Contents
1. [Core Philosophy](#core-philosophy)
2. [How It Works: The Rendering Pipeline](#how-it-works-the-rendering-pipeline)
3. [The Realism Engine: A Deep Dive](#the-realism-engine-a-deep-dive)
4. [Technical Architecture](#technical-architecture)
5. [Key Components](#key-components)
6. [State Management](#state-management)
7. [Setup & Installation](#setup--installation)
8. [Known Issues & Future Work](#known-issues--future-work)

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

Inkwell's realism comes from a combination of procedural generation, subtle randomization, and layered post-processing effects. Here’s how some of the key effects are achieved:

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

## State Management

Inkwell uses **Zustand** for lightweight and efficient state management. The state is divided into several stores:

*   `contentStore`: Holds the Slate.js document state for the header, main content, and side notes.
*   `styleStore`: Manages all visual styling options (colors, fonts, spacing, paper size, etc.).
*   `effectsStore`: Manages the settings for all realism effects (shadows, textures, scanner emulation, etc.).
*   `formattingStore`: Tracks the currently active formatting options (bold, italic, etc.).

## Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
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

## Known Issues & Future Work

This project is under active development. For a detailed list of current bugs, architectural challenges, and planned improvements, please see the **`ISSUES.md`** file in the root of the repository. The most significant planned change is the unification of the rendering pipeline to a single, canvas-based engine.