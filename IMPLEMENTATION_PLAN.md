# Implementation Plan: Inkwell Phase 2 Completion & Phase 3 Kick-off

This plan outlines the next set of features to be implemented, with technical recommendations to guide development, based on the `TECHNICAL_PRODUCT_REQUIREMENTS_DOCUMENT.md` and current progress.

---

### **Task 1: Complete Phase 2 - Finalize Realism Features**

**1.1. Enhance Handwriting Randomization**
*   **Goal:** Make the handwriting simulation more natural by adding word-level and line-level variations.
*   **Technical Details:**
    *   **Current State:** We only have character-level rotation, scale, and baseline offset.
    *   **Enhancements in `PreviewCanvas.tsx`'s `drawLine` function:**
        1.  **Word Spacing:** Introduce minor, random variations to the `style.wordSpacing` value between each word.
        2.  **Line Waviness:** Apply a subtle `sin` wave to the `y` coordinate of each character. The wave's frequency can be low across the line to create a gentle, non-uniform vertical drift.
        3.  **Ink Flow Simulation:** Modulate the `globalAlpha` of the canvas context (`targetCtx.globalAlpha`) with a small, random value for each character or word to simulate inconsistent ink flow from a pen.

**1.2. Implement Full Multi-Page PDF Export**
*   **Goal:** Allow users to export documents longer than a single page into a correctly paginated PDF.
*   **Technical Details:**
    1.  **Refactor Rendering Logic:** The main rendering loop in `PreviewCanvas.tsx` needs to be adapted to handle pagination.
    2.  **Content Measurer:** Create a new utility function that takes the entire Slate `content` and the page dimensions (`pageSize`, `margins`) as input. This function will iterate through the content, measure the text, and split it into an array of pages (where each page is an array of content nodes).
    3.  **Update PDF Export:** The "Export PDF" button's `onClick` handler will:
        *   Call the new content measurer to get the paginated content.
        *   Loop through each page in the returned array.
        *   For each page, draw its content onto an offscreen canvas.
        *   Add the image from the offscreen canvas to the `jsPDF` instance using `pdf.addPage()`.
    4.  **Preview Update:** The live `PreviewCanvas` can be updated to show a single page at a time, with controls to navigate between pages.

---

### **Task 2: Begin Phase 3 - Extensibility & Advanced Content**

**2.1. Render Mathematical Formulas on Canvas**
*   **Goal:** Render LaTeX formulas from the editor onto the live preview canvas.
*   **Technical Details:**
    *   **Current State:** KaTeX components render in the DOM-based editor but are skipped by the canvas renderer.
    *   **Recommended Approach (`html2canvas`):**
        1.  In the `PreviewCanvas.tsx` rendering loop, when a `math` node is detected, we will need to render it to an image.
        2.  To do this, we can have a hidden `div` somewhere in our component. We can use `ReactDOM.createPortal` to render the `InlineMath` or `BlockMath` component into this hidden `div`.
        3.  Use the `html2canvas` library to capture this hidden `div` as a canvas image.
        4.  Draw this captured image onto our main `targetCtx` at the correct position in the text flow.
    *   **Potential Challenge:** `html2canvas` is asynchronous. This will require the rendering pipeline to be adapted to handle promises. We may need to render all text first, then overlay the math images once they have all been generated. This can cause a flicker.
    *   **Alternative (Long-term):** Investigate libraries that can convert KaTeX output directly to an SVG string or a data URL, which can then be drawn synchronously to the canvas. This would be a more performant and robust solution.

**2.2. Scaffold the Plugin System**
*   **Goal:** Build the basic infrastructure for loading community-created fonts, textures, and styles.
*   **Technical Details:**
    1.  **Plugin Store:** Create `src/stores/pluginStore.ts` using Zustand. It will hold an array of loaded plugin manifests and their associated assets.
    2.  **Plugin Manager UI:** Enhance `PluginManager.tsx` with a button that uses the browser's File System Access API (`showOpenFilePicker`) to let a user select a `manifest.json` file for a plugin.
    3.  **Manifest Processing:** When a manifest is loaded:
        *   Add it to the `pluginStore`.
        *   **For `font-pack`:** Use the `FontFace` API to dynamically load the font file (e.g., `.ttf`, `.woff2`) specified in the manifest. Once loaded, add the font name to the "Font Family" dropdown in `CustomizationPanel.tsx`.
        *   **For `texture-pack`:** Load the texture images listed in the manifest. Add them as choices in the `CustomizationPanel`, allowing the user to select them.
        *   **For `style-preset`:** When a preset is loaded, the `pluginStore` can notify the `styleStore` and `effectsStore` to update their state with the values from the preset file.

---

### **Recommendations & Potential Issues**

*   **Rendering Performance:** The current approach of re-rendering the entire canvas on every change will become a bottleneck. As we move into Phase 4 (or earlier if performance degrades noticeably), we must implement optimizations. This includes caching layers on offscreen canvases (e.g., the texture layer) and only re-rendering the content that has changed.
*   **Security and File Access:** Using the File System Access API for plugins is modern but requires user permission and is only available in secure contexts (HTTPS). We need to ensure our implementation has proper error handling for when the API is unavailable or permission is denied. For broader compatibility, we could also support loading plugins from a user-provided URL or by uploading a zip archive. 