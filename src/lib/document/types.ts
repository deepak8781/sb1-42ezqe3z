export interface DocumentGeneratorOptions {
  size?: 'A4' | 'Letter';
  margin?: number;
}

export interface DownloadOptions {
  filename: string;
  type: string;
}