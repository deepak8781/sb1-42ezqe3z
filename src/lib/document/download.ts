import type { DownloadOptions } from './types';

export function createDownloadLink(
  data: Blob | Uint8Array, 
  options: DownloadOptions
): void {
  const blob = data instanceof Blob ? data : new Blob([data], { type: options.type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = options.filename;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}