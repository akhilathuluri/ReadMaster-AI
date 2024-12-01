interface TocItem {
  level: number;
  text: string;
  id: string;
}

export function generateTableOfContents(markdown: string): string {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    toc.push({ level, text, id });
  }

  let tocMarkdown = '# Table of Contents\n\n';
  toc.forEach(item => {
    const indent = '  '.repeat(item.level - 1);
    tocMarkdown += `${indent}- [${item.text}](#${item.id})\n`;
  });

  return tocMarkdown + '\n' + markdown.replace(/(#{1,6})\s+(.+)/gm, (match, hashes, title) => {
    const id = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `${hashes} ${title} {#${id}}`;
  });
} 