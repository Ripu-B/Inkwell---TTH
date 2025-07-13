
# Technical Product Requirements Document: "Inkwell"

## 1. Introduction

### 1.1. Vision

Inkwell is a next-generation digital-to-analog document simulator. Its core purpose is to transform plain text into highly realistic, aesthetically pleasing, and customizable handwritten documents. The system will prioritize photorealism, deep customization, and community-driven extensibility, allowing users to create digital artifacts that are indistinguishable from physical paper documents.

### 1.2. Guiding Principles

*   **Realism First**: All features should serve the primary goal of creating a believable analog artifact.
*   **Modular by Design**: The system architecture must be decoupled and modular to facilitate maintenance, testing, and future enhancements.
*   **Extensibility as a Core Feature**: The tool should be built around a robust plugin system, empowering the community to contribute new styles, textures, fonts, and effects.
*   **Performance by Default**: The rendering pipeline must be optimized for a smooth user experience, even with complex documents and effects.

---

## 2. System Architecture

The system will be a client-side, browser-based application built with a modern web stack. The architecture is designed to be modular, separating concerns between state management, UI, and the core rendering engine.

```mermaid
graph TD
    subgraph User Interface (React Components)
        A[UI Shell] --> B(Editor View);
        A --> C(Customization Panel);
        A --> D(Live Preview Canvas);
        A --> E(Plugin Manager);
    end

    subgraph State Management (Zustand/Context)
        F[Content Store] -- Manages --> G{Text, Drawings, Math};
        H[Style Store] -- Manages --> I{Font, Color, Spacing, Paper};
        J[Effects Store] -- Manages --> K{Shadows, Textures, Scanner};
        L[Plugin Store] -- Manages --> M{Loaded Plugins};
    end

    subgraph Core Systems
        N[Rendering Engine]
        O[Plugin System]
        P[Export Module]
    end

    B & C -- Update State --> F & H & J;
    F & H & J -- Provide Data --> N;
    M -- Provide Assets/Effects --> N;
    O -- Loads Plugins --> L;
    N -- Renders to --> D;
    N -- Sends Data to --> P;

    classDef coreSystem fill:#f9f,stroke:#333,stroke-width:2px;
    class N,O,P coreSystem;
```

### 2.1. Frontend Framework

*   **Framework**: Next.js with TypeScript and React.
*   **Deployment**: Static export (`output: 'export'`) for deployment on static hosting platforms (e.g., GitHub Pages, Vercel).
*   **Styling**: Tailwind CSS for utility-first styling, ensuring a consistent and maintainable design system.

### 2.2. State Management

A centralized state management solution (e.g., **Zustand**) will be used to manage the application's state. State will be divided into logical stores:
*   **`contentStore`**: Holds the raw user content, including Slate.js document state for text, vector data for drawings, and LaTeX strings for mathematical formulas.
*   **`styleStore`**: Manages all visual customization options: font properties, ink and paper colors, spacing, margins, page size, etc.
*   **`effectsStore`**: Manages the configuration for all realism effects, such as shadow parameters, texture settings, and scanner emulation options.
*   **`pluginStore`**: Tracks loaded plugins and their provided assets (fonts, textures) and configurations.

### 2.3. Rendering Engine

This is the heart of Inkwell. It will be a canvas-based pipeline that is completely decoupled from the DOM.

*   **Input**: It takes the current state from the `contentStore`, `styleStore`, and `effectsStore`.
*   **Process**: It constructs a "Virtual Page" model—a data structure representing everything to be drawn. This model is then processed by a series of rendering passes.
*   **Output**: A final, composited image rendered onto an HTML5 `<canvas>` element for live preview. This same engine will be used for generating high-resolution output for the export module.

**Key Advantage**: By not relying on HTML/CSS for the final rendering (unlike an `html2canvas` approach), we gain precise, pixel-level control over all effects, ensuring superior realism and performance.

### 2.4. Plugin System

The plugin system allows for community-driven extensibility. It will define a clear API for different types of plugins.
*   **Plugin Loader**: A module responsible for discovering and loading plugins from a user-specified local directory or from URLs.
*   **Plugin Registry**: A central registry where loaded plugins register their assets and capabilities. The `pluginStore` will be the stateful representation of this registry.

---

## 3. Feature Breakdown

### 3.1. Core Content Features

*   **Rich Text Editor**: A robust text editor based on Slate.js, supporting standard formatting (bold, italics, etc.).
*   **Mathematical & Physics Notation**: First-class support for LaTeX rendering via KaTeX, seamlessly integrated into the text editor to handle complex equations from both mathematics and physics.
*   **Vector Drawing**: A separate drawing canvas that allows users to create freeform vector-based drawings (lines, shapes) that can be placed onto the main document.

### 3.2. Realism Engine Features

#### 3.2.1. Dynamic Page Shadows

Instead of a static CSS `box-shadow`, shadows will be rendered dynamically on the canvas.
*   **Parameters**: Users can control Light Source Angle, Distance, Blur, and Color (opacity).
*   **Implementation**: The rendering engine will draw the page content onto an offscreen canvas, then use that canvas as a source to draw a transformed (offset, blurred, and colorized) shadow onto the main canvas before drawing the page itself on top.

#### 3.2.2. Procedural Page Textures

The system will support both image-based and procedurally generated textures.
*   **Image Textures**: Users can select from a library of high-resolution paper textures or upload their own. These will be provided via the Plugin System.
*   **Procedural Generation**: The rendering engine will include a module for generating textures using noise algorithms (e.g., Perlin or Simplex noise). This allows for infinite, unique paper variations. Users can control parameters like Noise Scale, Detail (Octaves), and Strength.
*   **Implementation**: The texture is rendered as the base layer on the canvas.

#### 3.2.3. Handwriting Randomization

To simulate natural handwriting, multiple layers of randomization will be applied during the text rendering pass.
*   **Glyph-level**: Subtle variations in rotation, baseline offset, and scale for each character.
*   **Word-level**: Minor adjustments to letter-spacing and word-spacing.
*   **Line-level**: Slight, non-uniform waviness or slant to entire lines of text.
*   **Ink-level**: Opacity and thickness variations to simulate inconsistent ink flow from a pen.

#### 3.2.4. Scanner Emulation

This is a post-processing effect applied to the final rendered canvas.
*   **Implementation**: A series of filters will be applied to the canvas's image data:
    1.  **Contrast Boost**: Increase the image contrast to mimic a scanner's light processing.
    2.  **Chromatic Aberration**: A very subtle red/blue channel shift on high-contrast edges.
    3.  **Noise**: A layer of monochromatic noise to simulate sensor imperfections.
    4.  **Light Bar Gradient**: A faint, wide linear gradient applied at a slight angle to simulate the scanner's light source.

### 3.3. Advanced Realism and AI-Powered Enhancements

*   **Advanced Ink & Paper Simulation**:
    *   **Ink Flow Simulation**: Simulate variations in ink flow, including subtle pooling at the end of strokes.
    *   **Paper Grain Interaction**: Model how ink interacts with the paper grain, causing micro-bleeds along fibers.
    *   **Pen Pressure Variation**: Simulate changes in line thickness and opacity based on virtual pen pressure.
    *   **Document Weathering**: Add effects to simulate aging, such as yellowing, stains, and folded creases.
*   **AI-Powered Text Humanization**:
    *   **Service Integration**: An optional feature to connect to an external AI service.
    *   **Functionality**: The service will analyze the text and suggest subtle grammatical and stylistic changes to make it sound more natural and less like it was written by a machine. This is not for correcting grammar, but for adding a human-like flow.

### 3.4. Community-Driven Extensibility (Plugin System)

*   **Plugin Manifest**: Each plugin will include a `manifest.json` file defining its name, author, version, and the type of content it provides.
*   **Plugin Types**:
    *   `texture-pack`: Provides a set of paper texture images.
    *   `font-pack`: Provides custom handwriting font files (`.ttf`, `.otf`, `.woff2`) and metadata.
    *   `style-preset`: Provides a `.json` file with a complete configuration of `styleStore` and `effectsStore` for one-click style application.
    *   `effect-plugin` (Advanced): A JavaScript file that conforms to a specific API, allowing it to register custom rendering passes or post-processing filters.

---

## 4. Phased Roadmap

### Phase 1: Core Engine & UI Scaffolding

*   **Objective**: Build the foundational application shell and a basic, functional rendering pipeline.
*   **Features**:
    *   Set up Next.js project with TypeScript and Tailwind CSS.
    *   Implement the main UI layout (Editor, Preview, Customization Panel).
    *   Integrate Slate.js for basic text input.
    *   Build the initial canvas-based rendering engine: renders unstyled text to the canvas.
    *   Implement basic state management for content (`contentStore`).
    *   Basic image export (PNG).

*   ## Phase Completion Markers
    *   User can type text in the editor.
    *   Text appears on the live preview canvas.
    *   The document can be exported as a single PNG image.

### Phase 2: Customization & Realism

*   **Objective**: Implement all user-facing customization options and the core realism features.
*   **Features**:
    *   Build out the full Customization Panel UI.
    *   Implement `styleStore` and `effectsStore` for state management.
    *   Integrate all styling options into the rendering engine (fonts, colors, spacing).
    *   Implement the Handwriting Randomization engine.
    *   Implement Dynamic Shadows, Image Textures, and the Scanner Emulation effect.
    *   Implement multi-page support and PDF export via `jsPDF`.

*   ## Phase Completion Markers
    *   All customization controls are functional and affect the canvas preview.
    *   Shadow, texture, and scanner effects are working.
    *   Handwriting looks believably random.
    *   Multi-page documents can be generated and exported as a PDF.

### Phase 3: Extensibility & Advanced Features

*   **Objective**: Build the plugin system and add advanced content features.
*   **Features**:
    *   Design and implement the Plugin System API.
    *   Build the Plugin Loader and Manager UI.
    *   Implement support for `texture-pack`, `font-pack`, and `style-preset` plugins.
    *   Integrate KaTeX for math rendering.
    *   Integrate the vector drawing canvas.
    *   Implement Procedural Texture generation.

*   ## Phase Completion Markers
    *   Users can load custom fonts and textures via plugins.
    *   Users can save and apply style presets.
    *   Mathematical formulas and user drawings can be added to the document.
    *   Procedurally generated paper textures are available.

### Phase 4: Polish, Optimization & Release

*   **Objective**: Refine the user experience, optimize performance, and prepare for a public release.
*   **Features**:
    *   Conduct a full UX/UI review and apply polish.
    *   Performance optimization of the rendering pipeline (e.g., using offscreen canvases, minimizing re-renders).
    *   Add comprehensive error handling and user feedback mechanisms.
    *   Write user documentation and tutorials for the plugin system.
    *   Final bug bash and stability testing.

*   ## Phase Completion Markers
    *   The application is stable and performs well with large documents.
    *   The UI is intuitive and polished.
    *   The plugin creation process is well-documented.
    *   The application is ready for a `v1.0` release.

---

## 5. Bug Tracking & Quality Assurance

*   **Platform**: GitHub Issues will be the single source of truth for all bugs, feature requests, and tasks.
*   **Bug Report Template**: All bug reports must follow a strict template:
    *   **Summary**: A concise title.
    *   **Steps to Reproduce**: Detailed, step-by-step instructions.
    *   **Expected Behavior**: What should have happened.
    *   **Actual Behavior**: What actually happened (include screenshots/videos).
    *   **Environment**: Browser version, OS.
*   **Labeling**: A standardized set of labels will be used for prioritization and organization: `bug`, `critical-bug`, `enhancement`, `question`, `p1` (high priority) to `p3` (low priority).
*   **Testing**:
    *   **Unit Tests**: Jest/Vitest will be used to test individual functions, especially within the rendering engine and state stores.
    *   **Integration Tests**: React Testing Library will be used to test component interactions.
    *   **E2E Tests**: Playwright or Cypress will be used for end-to-end testing of critical user flows (e.g., creating a document, applying effects, exporting to PDF).

---

## 6. Technical Appendices

### Appendix A: Rendering Pipeline Detailed Flow

The rendering process for a single page occurs in layered passes:

1.  **Clear Canvas**: The main canvas is cleared.
2.  **Texture Pass**:
    *   If using a procedural texture, the noise function is executed and drawn to the canvas.
    *   If using an image texture, the image is drawn to the canvas.
3.  **Shadow Pass**:
    *   An offscreen canvas is created.
    *   The page background color and content (text, drawings) are rendered onto this offscreen canvas.
    *   The main canvas's context is configured with the shadow parameters (offset, blur, color).
    *   The offscreen canvas is drawn onto the main canvas, which only renders its shadow due to the context settings.
    *   The shadow settings are cleared.
4.  **Page Pass**:
    *   The page background color is drawn.
    *   Margins and lines (if enabled) are drawn.
5.  **Content Pass**:
    *   **Text**: The rendering engine iterates through the text from the `contentStore`, applying all styling and handwriting randomization effects, and draws it to the canvas using `fillText`.
    *   **Drawings**: Vector drawing data is rendered onto the canvas.
6.  **Post-Processing Pass**:
    *   If effects like Scanner Emulation are enabled, the `getImageData` method is called on the canvas.
    *   The filter functions manipulate the pixel data directly.
    *   The modified pixel data is written back to the canvas using `putImageData`.

### Appendix B: Plugin API Interface (TypeScript)

```typescript
// manifest.json
interface PluginManifest {
  id: string; // e.g., "com.author.vintage-textures"
  name: string; // e.g., "Vintage Paper Textures"
  author: string;
  version: string;
  pluginType: 'texture-pack' | 'font-pack' | 'style-preset';
}

// For a texture-pack, the plugin folder would contain the manifest and image files.
// For a font-pack, it would contain the manifest and font files.

// For a style-preset, it provides a JSON file matching this structure:
interface StylePreset {
  style: Partial<StyleState>; // from styleStore
  effects: Partial<EffectsState>; // from effectsStore
}

// For an advanced effect-plugin:
interface EffectPlugin {
  manifest: PluginManifest; // with pluginType: 'effect-plugin'

  /**
   * Registers a custom rendering pass.
   * @param context The canvas rendering context.
   * @param pageData The current virtual page data.
   */
  onRender?: (context: CanvasRenderingContext2D, pageData: any) => void;

  /**
   * Registers a custom post-processing filter.
   * @param imageData The canvas ImageData to be manipulated.
   * @returns The modified ImageData.
   */
  onPostProcess?: (imageData: ImageData) => ImageData;
}
```
