Project: "Nocturne PDF" - A Client-Side Night Mode PDF Viewer
Architectural Vision & Core Principles

    100% Client-Side Processing: All operations, from file reading to rendering, will occur in the user's browser. This is our primary architectural pillar, guaranteeing user privacy and eliminating server costs.

    Asynchronous & Non-Blocking UI: The user interface must remain responsive at all times. Heavy processing (PDF parsing and rendering) will be offloaded to a Web Worker to prevent the main thread from freezing.

    Component-Based Architecture: We will leverage React's component model to build a modular and reusable UI. Key features like the uploader and viewer will be self-contained components.

    Optimized Rendering: We will render PDF pages to <canvas> elements. The core logic will intercept the rendering commands to apply the night mode theme, ensuring images and non-text elements are preserved.

    Simplicity in State Management: For this single-feature application, we will rely on React's built-in hooks (useState, useReducer, useContext) for state management to avoid unnecessary complexity.

Technology Stack

    Frontend Framework: React, Typescirpt

    PDF Processing: Mozilla's PDF.js , Must work with other browsers (Chrome)

    Drag & Drop: react-dropzone library for a polished and accessible file input experience.

    Styling: CSS Modules or a CSS-in-JS library like Styled-Components for scoped, conflict-free styling.

    Deployment: Any static hosting provider (Vercel, Netlify, GitHub Pages).

Implementation Plan: Epics & Tasks

Here is the project broken down into three main epics.
EPIC 1: The Landing Page & File Ingestion

Goal: Create an engaging entry point for the user and a robust mechanism for them to provide a PDF file.

    Task 1.1: Setup Project & Basic Routing

        Description: Initialize a new React project (create-react-app or Vite). Set up a basic router (react-router-dom) with two routes: the home/upload page (/) and the viewer page (/view).

        Definition of Done: A new React app is running locally. The user can navigate between the home and (empty) viewer pages.

    Task 1.2: Implement Hero Block

        Description: Create a HomePage component. Design a visually appealing hero section with a catchy title (e.g., "Read in the Dark. Instantly."), a brief description of the privacy benefits, and clean styling.

        Definition of Done: The landing page is styled and responsive on both desktop and mobile.

    Task 1.3: Create the Drag & Drop Upload Component (CRUCIAL TASK)

        Description: Integrate the react-dropzone library to create a component that accepts file drops and clicks.

        Sub-tasks:

            Implement file validation logic. Reject files that are not application/pdf.

            Implement file size validation. Reject files over a configurable limit (default: 20MB). Provide clear user feedback on rejection.

            On successful file acceptance, update the application's state with the file object and automatically navigate the user to the /view page.

        Definition of Done: The component is styled, handles valid files, and provides clear error messages for invalid files (wrong type, too large).

EPIC 2: The Core Processing Engine (Web Worker)

Goal: To process the PDF file in a background thread, apply the night mode effect, and report progress without blocking the UI.

    Task 2.1: Web Worker Setup & Communication

        Description: Create the Web Worker script file (pdf.worker.js). Set up the communication channel between the main React app and the worker. The main thread will post the file to the worker, and the worker will post back messages for progress and completion.

        Definition of Done: The React app can instantiate the worker, send it a file object, and receive a simple "acknowledgement" message back.

    Task 2.2: Implement PDF Parsing and Night Mode Rendering (CRUCIAL TASK)

        Description: This is the core logic that will live inside the Web Worker.

        Sub-tasks:

            Receive the File object from the main thread and read it into an ArrayBuffer.

            Initialize PDF.js with the ArrayBuffer.

            Implement a loop to iterate through all pages of the PDF.

            For each page, create an off-screen canvas.

            Render the page onto the off-screen canvas using the custom rendering logic (overriding fillStyle for black text as discussed previously).

            As each page is processed, send a progress update message to the main thread (e.g., { type: 'progress', data: { currentPage: 3, totalPages: 10 } }).

            Once a page is rendered to its canvas, convert the canvas content to an ImageBitmap for efficient transfer back to the main thread.

            When all pages are processed, send a final "complete" message containing an array of all the ImageBitmap objects.

        Definition of Done: The worker can successfully receive a PDF, process every page into a night-mode ImageBitmap, and send the results and progress updates back to the main thread.

EPIC 3: The PDF Viewer Experience

Goal: To present the processed, night-mode PDF to the user in a clean, readable interface.

    Task 3.1: Create the Viewer Page and Loading Indicator

        Description: Build the ViewPage component. This component will be responsible for orchestrating the worker and displaying the results.

        Sub-tasks:

            When the page loads with a file in the state, it should immediately trigger the Web Worker process.

            While the worker is processing, display a prominent loading indicator. This indicator must listen to the progress messages from the worker and update in real-time (e.g., "Processing page 3 of 10...").

        Definition of Done: The user sees a clear loading state after uploading a file, and it accurately reflects the processing progress.

    Task 3.2: Render the Final PDF Content (CRUCIAL TASK)

        Description: Once the worker sends the "complete" message with the ImageBitmap array, the loading indicator should be hidden.

        Sub-tasks:

            Dynamically create a <canvas> element for each ImageBitmap received.

            Draw each ImageBitmap onto its corresponding canvas.

            Display the canvases vertically in a scrollable container, mimicking a standard PDF reader.

        Definition of Done: The night-mode PDF is fully rendered and readable on the screen.

    Task 3.3: Implement Minimal UI for the Viewer

        Description: The viewer should be distraction-free. Add a minimal, floating, or fixed UI bar.

        Sub-tasks:

            Display the current page number and total pages (e.g., "5 / 12").

            Add a "Back to Home" or "Convert Another" button.

            (Optional but recommended) Add a "Download" button that allows the user to save the current view as an image (canvas.toDataURL()) or use a library like jsPDF to re-compile the canvases into a new PDF document.

        Definition of Done: The user can easily navigate the document and has a clear path to exit or download their result.