 Phase 2: The Core Processing Engine (The "Magic")


  This phase is dedicated to the background logic that performs the actual PDF transformation. It all happens
  off the main UI thread to keep the app responsive.


   1. Web Worker Scaffolding:
       * Create the Web Worker script (pdf.worker.ts).
       * Establish the communication channel: The main React app will need to be able to create the worker, post
         the PDF file to it, and listen for messages coming back from it.


   2. PDF Parsing & Rendering Logic:
       * Inside the worker, implement the logic to receive the file and read it using pdf.js.
       * Iterate through each page of the PDF. For each page, render it to an off-screen <canvas>.
       * This is the crucial step: Intercept the canvas rendering commands to invert the colors, changing black
         text to a light color and backgrounds to dark, thus creating the "night mode" effect.


   3. Communication & Progress Reporting:
       * As each page is processed, the worker will send a progress message back to the main app (e.g., { page:
         3, total: 10 }).
       * Once all pages are rendered, the worker will convert each canvas to an ImageBitmap for efficient
         transfer and send a final complete message back to the app with the array of all processed page images.