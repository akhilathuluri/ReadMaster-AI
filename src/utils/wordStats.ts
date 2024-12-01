interface WordStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
  headings: { level: number; count: number }[];
  links: number;
  codeBlocks: number;
}

export function getWordStats(content: string): WordStats {
  // Count words
  const words = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks for word count
    .replace(/[#*`]/g, '') // Remove markdown symbols
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length;

  // Count characters
  const characters = content.length;
  const charactersNoSpaces = content.replace(/\s/g, '').length;

  // Count sentences
  const sentences = content
    .split(/[.!?]+/)
    .filter(sentence => sentence.trim().length > 0).length;

  // Count paragraphs
  const paragraphs = content
    .split(/\n\s*\n/)
    .filter(para => para.trim().length > 0).length;

  // Calculate reading time (assuming 200 words per minute)
  const minutes = Math.ceil(words / 200);
  const readingTime = minutes === 1 ? '1 minute' : `${minutes} minutes`;

  // Count headings by level
  const headings = [1, 2, 3, 4, 5, 6].map(level => ({
    level,
    count: (content.match(new RegExp(`^#{${level}}\\s`, 'gm')) || []).length
  })).filter(h => h.count > 0);

  // Count links
  const links = (content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length;

  // Count code blocks
  const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTime,
    headings,
    links,
    codeBlocks
  };
} 