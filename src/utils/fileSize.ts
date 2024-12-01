export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const estimateMarkdownSize = (content: string): number => {
  // Basic UTF-8 size estimation
  return new Blob([content]).size;
};

export const estimateRichPDFSize = (content: string): number => {
  // Rich PDF includes styling and potentially images
  const baseSize = 15 * 1024; // 15KB base size
  const contentSize = new Blob([content]).size;
  const formattingMultiplier = 2.0; // Account for rich formatting
  return Math.ceil(baseSize + (contentSize * formattingMultiplier));
}; 