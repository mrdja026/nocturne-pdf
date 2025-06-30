Phase 3: The Viewer Experience (The "Payoff")

  This phase focuses on what the user sees and interacts with after uploading their file.


   1. Loading & Progress UI:
       * Create the ViewPage component. When it loads, it will immediately start the Web Worker from Phase 2.
       * While the worker is processing, the UI will display a clear loading indicator that listens to the
         worker's progress messages and updates in real-time (e.g., "Converting page 3 of 10...").


   2. Displaying the Final Result:
       * When the worker sends the complete message, the loading indicator will be hidden.
       * The ViewPage will then dynamically render the array of page images into a series of <canvas> elements,
         displayed in a vertical, scrollable container that mimics a standard PDF reader.


   3. Minimal Viewer Controls:
       * Add a simple, floating UI to the viewer.
       * It will include essential controls: a page counter ("Page 5 / 12"), a button to return to the home
         page, and a "Download" button to save the generated night-mode PDF.