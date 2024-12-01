export const parseMetadata = (content: string): { [key: string]: string } => {
  const metadata: { [key: string]: string } = {};
  const lines = content.split('\n');
  let inFrontMatter = false;
  let startIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '---') {
      if (!inFrontMatter) {
        inFrontMatter = true;
        startIndex = i;
        continue;
      } else {
        break;
      }
    }

    if (inFrontMatter && line !== '---') {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        metadata[match[1]] = match[2];
      }
    }
  }

  return metadata;
};

export const stringifyMetadata = (metadata: { [key: string]: string }, content: string): string => {
  if (Object.keys(metadata).length === 0) {
    return content;
  }

  const metadataString = Object.entries(metadata)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  const lines = content.split('\n');
  let inFrontMatter = false;
  let startIndex = -1;
  let endIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === '---') {
      if (!inFrontMatter) {
        inFrontMatter = true;
        startIndex = i;
      } else {
        endIndex = i;
        break;
      }
    }
  }

  if (startIndex === -1) {
    // No existing front matter, add new one
    return `---\n${metadataString}\n---\n\n${content}`;
  } else {
    // Replace existing front matter
    lines.splice(startIndex + 1, endIndex - startIndex - 1, metadataString);
    return lines.join('\n');
  }
}; 