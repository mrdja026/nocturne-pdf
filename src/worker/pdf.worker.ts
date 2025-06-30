import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';

const PDF_JS_VERSION = '4.10.38'; // Corrected version from error log
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDF_JS_VERSION}/build/pdf.worker.mjs`;

self.onmessage = async (e) => {
    console.log('Worker received message:', e.data);
    const { file } = e.data;

    if (file) {
        console.log('File received in worker:', file.name, file.size, file.type);
        try {
            const fileReader = new FileReader();
            fileReader.onload = async function () {
                console.log('FileReader onload triggered.');
                try {
                    if (this.result) {
                        const typedArray = new Uint8Array(this.result as ArrayBuffer);
                        console.log('TypedArray created. Length:', typedArray.length);
                        try {
                            const loadingTask = pdfjsLib.getDocument(typedArray);
                            const pdf = await loadingTask.promise;
                            console.log('PDF document loaded. Number of pages:', pdf.numPages);
                            const numPages = pdf.numPages;
                            self.postMessage({ type: 'total_pages', total: numPages });

                            const imageBitmaps = [];

                            for (let i = 1; i <= numPages; i++) {
                                try {
                                    const page = await pdf.getPage(i);
                                    console.log(`Processing page ${i} of ${numPages}`);
                                    const viewport = page.getViewport({ scale: 2 });

                                    const canvas = new OffscreenCanvas(viewport.width, viewport.height);
                                    const context = canvas.getContext('2d', { willReadFrequently: true });

                                    if (context) {
                                        const renderContext = {
                                            canvasContext: context as unknown as CanvasRenderingContext2D,
                                            viewport: viewport,
                                        };
                                        await page.render(renderContext).promise;
                                        console.log(`Page ${i} rendered to canvas.`);

                                        // Invert colors
                                        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                                        const data = imageData.data;
                                        for (let j = 0; j < data.length; j += 4) {
                                            data[j] = 255 - data[j];     // Red
                                            data[j + 1] = 255 - data[j + 1]; // Green
                                            data[j + 2] = 255 - data[j + 2]; // Blue
                                        }
                                        context.putImageData(imageData, 0, 0);
                                        console.log(`Colors inverted for page ${i}.`);
                                    }

                                    const imageBitmap = canvas.transferToImageBitmap();
                                    imageBitmaps.push(imageBitmap);


                                    self.postMessage({ type: 'progress', page: i, total: numPages });
                                } catch (pageError) {
                                    console.error(`Error processing page ${i}:`, pageError);
                                    self.postMessage({ type: 'error', message: `Failed to process page ${i}: ${pageError instanceof Error ? pageError.message : String(pageError)}` });
                                    // Continue to next page or break, depending on desired behavior
                                    // For now, we'll break to prevent further errors if one page fails.
                                    break;
                                }
                            }

                            self.postMessage({ type: 'complete', imageBitmaps });
                        } catch (pdfLoadError) {
                            console.error('Error loading PDF document:', pdfLoadError);
                            self.postMessage({ type: 'error', message: `Failed to load PDF document: ${pdfLoadError instanceof Error ? pdfLoadError.message : String(pdfLoadError)}` });
                        }
                    }
                } catch (error) {
                    console.error('Error inside fileReader.onload:', error);
                    self.postMessage({ type: 'error', message: `Failed to process PDF: ${error instanceof Error ? error.message : String(error)}` });
                }
            };
            fileReader.onerror = (errorEvent) => {
                console.error('FileReader error event:', errorEvent);
                const errorMessage = errorEvent.target && (errorEvent.target as FileReader).error ? (errorEvent.target as FileReader).error?.message : 'Unknown FileReader error';
                self.postMessage({ type: 'error', message: `Failed to read file: ${errorMessage}` });
            };
            fileReader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('Top-level error in worker onmessage:', error);
            self.postMessage({ type: 'error', message: `A critical worker error occurred: ${error instanceof Error ? error.message : String(error)}` });
        }
    }
};

export { };
