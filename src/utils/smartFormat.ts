interface FormatOptions {
  fixHeadings: boolean;
  cleanLists: boolean;
  formatTables: boolean;
  removeExtraWhitespace: boolean;
  fixLinks: boolean;
}

export function smartFormatMarkdown(content: string, options: FormatOptions = {
  fixHeadings: true,
  cleanLists: true,
  formatTables: true,
  removeExtraWhitespace: true,
  fixLinks: true,
}): string {
  let formattedContent = content;

  // Fix heading hierarchy
  if (options.fixHeadings) {
    const lines = formattedContent.split('\n');
    let currentLevel = 0;
    formattedContent = lines.map(line => {
      if (line.startsWith('#')) {
        const level = line.match(/^#+/)[0].length;
        if (level - currentLevel > 1) {
          const newLevel = currentLevel + 1;
          currentLevel = newLevel;
          return '#'.repeat(newLevel) + line.slice(level);
        }
        currentLevel = level;
      }
      return line;
    }).join('\n');
  }

  // Clean up lists
  if (options.cleanLists) {
    formattedContent = formattedContent
      // Standardize unordered lists to use '-'
      .replace(/^\s*[*+]\s/gm, '- ')
      // Fix list indentation
      .replace(/^(\s*)-\s/gm, (match, spaces) => {
        const indent = Math.floor(spaces.length / 2) * 2;
        return ' '.repeat(indent) + '- ';
      })
      // Fix ordered lists
      .replace(/^\s*(\d+)\.\s/gm, (match, num) => {
        return `${num}. `;
      });
  }

  // Format tables
  if (options.formatTables) {
    const tableRegex = /\|.*\|/g;
    const tables = formattedContent.match(tableRegex);
    if (tables) {
      tables.forEach(table => {
        const rows = table.split('\n').filter(row => row.trim());
        if (rows.length >= 2) {
          // Get maximum column widths
          const cols = rows[0].split('|').filter(Boolean);
          const colWidths = cols.map(col => col.trim().length);
          
          rows.forEach(row => {
            const cells = row.split('|').filter(Boolean);
            cells.forEach((cell, i) => {
              colWidths[i] = Math.max(colWidths[i], cell.trim().length);
            });
          });

          // Format each row
          const formattedRows = rows.map((row, rowIndex) => {
            const cells = row.split('|').filter(Boolean);
            const formattedCells = cells.map((cell, i) => {
              const content = cell.trim();
              return ` ${content.padEnd(colWidths[i])} `;
            });
            return `|${formattedCells.join('|')}|`;
          });

          // Replace original table with formatted version
          formattedContent = formattedContent.replace(table, formattedRows.join('\n'));
        }
      });
    }
  }

  // Remove extra whitespace
  if (options.removeExtraWhitespace) {
    formattedContent = formattedContent
      // Remove multiple blank lines
      .replace(/\n{3,}/g, '\n\n')
      // Remove trailing whitespace
      .replace(/[ \t]+$/gm, '')
      // Ensure single blank line after headings
      .replace(/^(#+.*)\n+/gm, '$1\n\n')
      // Remove spaces before punctuation
      .replace(/\s+([.,!?;:])/g, '$1');
  }

  // Fix common link syntax issues
  if (options.fixLinks) {
    formattedContent = formattedContent
      // Fix spaces in links
      .replace(/\[([^\]]+)\]\s+\(([^)]+)\)/g, '[$1]($2)')
      // Fix missing closing brackets
      .replace(/\[([^\]]+)\([^)]+\)/g, '[$1]($2)')
      // Fix image syntax
      .replace(/!\[([^\]]*)\]\s*\(([^)]+)\)/g, '![$1]($2)');
  }

  return formattedContent.trim();
} 