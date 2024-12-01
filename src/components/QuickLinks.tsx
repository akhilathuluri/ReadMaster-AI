import { FC, useState } from 'react';
import { ExternalLink, Link2, X, BookOpen, FileText, Code, Palette, Book, Keyboard } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Resource {
  title: string;
  description: string;
  url: string;
  icon: JSX.Element;
  category: string;
  content?: string;
}

const resources: Resource[] = [
  {
    title: 'Official Markdown Guide',
    description: 'Complete documentation for Markdown syntax',
    url: 'https://www.markdownguide.org',
    icon: <BookOpen size={16} />,
    category: 'Documentation'
  },
  {
    title: 'GitHub Markdown',
    description: 'GitHub Flavored Markdown specification',
    url: 'https://github.github.com/gfm/',
    icon: <FileText size={16} />,
    category: 'Documentation'
  },
  {
    title: 'Mermaid Live Editor',
    description: 'Create and edit diagrams online',
    url: 'https://mermaid.live',
    icon: <Code size={16} />,
    category: 'Tools'
  },
  {
    title: 'KaTeX Documentation',
    description: 'Math notation reference',
    url: 'https://katex.org/docs/supported.html',
    icon: <Book size={16} />,
    category: 'Documentation'
  },
  {
    title: 'Markdown Tables Generator',
    description: 'Create and format tables easily',
    url: 'https://www.tablesgenerator.com/markdown_tables',
    icon: <FileText size={16} />,
    category: 'Tools'
  },
  {
    title: 'Shields.io',
    description: 'Create badges for your documentation',
    url: 'https://shields.io',
    icon: <Palette size={16} />,
    category: 'Tools'
  },
  {
    title: 'Emoji Cheat Sheet',
    description: 'Complete list of GitHub-supported emoji',
    url: 'https://github.com/ikatyang/emoji-cheat-sheet',
    icon: <FileText size={16} />,
    category: 'References'
  },
  {
    title: 'CommonMark',
    description: 'Markdown specification and testing',
    url: 'https://commonmark.org',
    icon: <BookOpen size={16} />,
    category: 'Documentation'
  },
  {
    title: 'Carbon',
    description: 'Create beautiful code snippets',
    url: 'https://carbon.now.sh',
    icon: <Code size={16} />,
    category: 'Tools'
  },
  {
    title: 'DevDocs',
    description: 'Programming language documentation',
    url: 'https://devdocs.io',
    icon: <Book size={16} />,
    category: 'References'
  },
  {
    title: 'Keyboard Shortcuts',
    description: 'Common editor shortcuts',
    url: '#',
    icon: <Keyboard size={16} />,
    category: 'Shortcuts',
    content: `
| Action | Windows/Linux | macOS |
|--------|---------------|--------|
| Save Version | <kbd>Ctrl</kbd> + <kbd>S</kbd> | <kbd>⌘</kbd> + <kbd>S</kbd> |
| Toggle Dark Mode | <kbd>Ctrl</kbd> + <kbd>D</kbd> | <kbd>⌘</kbd> + <kbd>D</kbd> |
| Toggle Sidebar | <kbd>Ctrl</kbd> + <kbd>B</kbd> | <kbd>⌘</kbd> + <kbd>B</kbd> |
| Insert Link | <kbd>Ctrl</kbd> + <kbd>K</kbd> | <kbd>⌘</kbd> + <kbd>K</kbd> |
| Bold Text | <kbd>Ctrl</kbd> + <kbd>B</kbd> | <kbd>⌘</kbd> + <kbd>B</kbd> |
| Italic Text | <kbd>Ctrl</kbd> + <kbd>I</kbd> | <kbd>⌘</kbd> + <kbd>I</kbd> |
| Toggle AI Panel | <kbd>Ctrl</kbd> + <kbd>\\</kbd> | <kbd>⌘</kbd> + <kbd>\\</kbd> |
| Quick Search | <kbd>Ctrl</kbd> + <kbd>P</kbd> | <kbd>⌘</kbd> + <kbd>P</kbd> |
| Format Document | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> | <kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> |
| Toggle Lock | <kbd>Ctrl</kbd> + <kbd>L</kbd> | <kbd>⌘</kbd> + <kbd>L</kbd> |`
  },
  {
    title: 'Markdown Syntax',
    description: 'Complete Markdown reference',
    url: '#',
    icon: <FileText size={16} />,
    category: 'References',
    content: `
# Markdown Quick Reference

## Basic Syntax

### Headers
# H1 Header
## H2 Header
### H3 Header

### Emphasis
*italic* or _italic_
**bold** or __bold__
***bold italic*** or ___bold italic___
~~strikethrough~~

### Lists
1. Ordered list item
2. Another item
   * Unordered sub-item
   * Another sub-item

* Unordered list item
* Another item
  1. Ordered sub-item
  2. Another sub-item

### Links & Images
[Link text](URL)
![Alt text](image-URL)

### Code
Inline \`code\` with backticks

\`\`\`javascript
// Code block
function example() {
  return "Hello World!";
}
\`\`\`

### Blockquotes
> Blockquote
> > Nested blockquote

### Tables
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

### Task Lists
- [ ] Todo item
- [x] Completed item

### Math
Inline: $E = mc^2$
Block:
$$
\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
$$

### Diagrams
\`\`\`mermaid
graph TD;
    A-->B;
    B-->C;
\`\`\`

### Footnotes
Here's a sentence with a footnote[^1].
[^1]: This is the footnote.

### Definition Lists
Term
: Definition

### HTML Support
<details>
<summary>Click to expand</summary>
Hidden content here
</details>
`
  }
];

export const QuickLinks: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const categories = ['All', ...new Set(resources.map(r => r.category))];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleResourceClick = (resource: Resource) => {
    if (resource.content) {
      setSelectedResource(resource);
    } else {
      window.open(resource.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Quick Links"
      >
        <Link2 size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
            {selectedResource ? (
              <>
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedResource.title}
                  </h3>
                  <button
                    onClick={() => setSelectedResource(null)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 max-h-[70vh] overflow-y-auto prose dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedResource.content || ''}
                  </ReactMarkdown>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Quick Links
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-4 border-b dark:border-gray-700">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {filteredResources.map((resource, index) => (
                      <button
                        key={index}
                        onClick={() => handleResourceClick(resource)}
                        className="flex items-start p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group text-left w-full"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600 dark:text-blue-400">
                              {resource.icon}
                            </span>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {resource.title}
                            </h4>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {resource.description}
                          </p>
                          <span className="mt-2 inline-block text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                            {resource.category}
                          </span>
                        </div>
                        <ExternalLink 
                          size={16} 
                          className="text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 