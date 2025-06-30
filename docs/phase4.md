Phase 3: The Polished Viewer Experience


  This phase is dedicated to creating a robust, performant, and user-friendly interface for displaying the
  converted PDF. It addresses not only the successful rendering but also loading states, error handling, and
  advanced usability features.


  1. Viewer Page Setup & State Handling
   * Task: Create the ViewPage component, which serves as the orchestrator for the viewing experience.
   * Sub-tasks:
       * Implement logic to receive the File object from the HomePage, likely via router state (location.state).
       * Add a guard clause: If a user navigates directly to the /view URL without a file object in the state,
         they should be immediately redirected back to the home page to ensure a valid workflow.
       * Upon successfully receiving a file, the component will instantiate the Web Worker and post the file to
         it, officially kicking off the conversion process.


  2. Robust Loading, Progress, and Error UI
   * Task: Provide clear and constant feedback to the user while the application is processing the file.
   * Sub-tasks:
       * Display a prominent, non-blocking loading indicator as soon as the worker is initiated.
       * The indicator must listen for progress messages from the worker and update its content in real-time
         (e.g., "Optimizing page 3 of 10...").
       * Crucial: Implement robust error handling. The ViewPage must listen for an error message from the worker
         (e.g., in case of a corrupted or password-protected PDF). If an error is received, the loading indicator
          will be replaced with a clear, user-friendly error message (e.g., "Sorry, this PDF could not be
         processed. Please try another file.") and provide a button to return home.


  3. Optimized & Accessible Page Rendering
   * Task: Efficiently render the processed pages without degrading browser performance, especially for large
     documents.
   * Sub-tasks:
       * When the worker posts its complete message, the array of ImageBitmap objects is stored in the
         ViewPage's state, and the loading indicator is hidden.
       * Performance: Implement a "virtualized" or "lazy-rendering" strategy. Instead of rendering all canvases
         at once, only render the canvases for pages that are currently within or near the user's viewport. This
         is critical for maintaining smooth scrolling and low memory usage.
       * Accessibility: Each rendered <canvas> element must be given an appropriate ARIA label (e.g.,
         aria-label="Page 1 of 12") to ensure the viewer is accessible to screen reader users.


  4. Advanced & User-Friendly Viewer Controls
   * Task: Provide an intuitive and non-intrusive UI for navigating and interacting with the document.
   * Sub-tasks:
       * Design a clean, floating UI bar that auto-hides during scrolling and reappears on mouse movement or
         tap, ensuring a distraction-free reading environment.
       * Implement essential viewer controls within the UI bar:
           * An interactive page counter (e.g., "Page 5 / 12").
           * Zoom In / Zoom Out buttons to adjust the view scale.
           * A "Convert Another" button that navigates the user back to the home page.
       * Crucial - High-Quality Download:
           * The "Download" button will use a library like jsPDF to compile all the rendered canvases back into
             a single, multi-page PDF document.
           * The downloaded file will be given a descriptive name, such as [original-filename]-nocturne.pdf, for
             a polished user experience.
  4. Advanced & User-Friendly Viewer Controls
   * Task: Provide an intuitive and non-intrusive UI for navigating and interacting with the document.
   * Sub-tasks:
       * Design a clean, floating UI bar that auto-hides during scrolling and reappears on mouse movement or
         tap, ensuring a distraction-free reading environment.
       * Implement essential viewer controls within the UI bar:
           * An interactive page counter (e.g., "Page 5 / 12").
           * Zoom In / Zoom Out buttons to adjust the view scale.
           * A "Convert Another" button that navigates the user back to the home page.