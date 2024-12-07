import * as pdfjsLib from 'pdfjs-dist';

// Use CDN URL for the worker
const WORKER_CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let workerInitialized = false;

export async function initializeWorker(): Promise<void> {
  if (workerInitialized) return;
  
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_CDN_URL;
    workerInitialized = true;
  } catch (error) {
    console.error('Worker initialization failed:', error);
    throw new Error('PDF worker initialization failed. Please try again.');
  }
}

export function cleanupWorker(): void {
  workerInitialized = false;
}