import { FC, useState } from 'react';
import { BookOpen, Copy, X, Search } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

interface Snippet {
  title: string;
  description: string;
  content: string;
  category: string;
}

const snippets: Snippet[] = [
  {
    title: 'Basic Table',
    description: 'A simple table with headers',
    category: 'Tables',
    content: 
`| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`
  },
  {
    title: 'Aligned Table',
    description: 'Table with different alignments',
    category: 'Tables',
    content:
`| Left | Center | Right |
|:-----|:------:|------:|
|Left|Center|Right|
|Text|Text|Text|`
  },
  {
    title: 'Code Block',
    description: 'Code block with syntax highlighting',
    category: 'Code',
    content:
`\`\`\`javascript
// Your code here
function example() {
  return "Hello World!";
}
\`\`\``
  },
  {
    title: 'Mermaid Diagram',
    description: 'Basic flowchart diagram',
    category: 'Diagrams',
    content:
`\`\`\`mermaid
graph TD;
    A[Start] --> B[Process];
    B --> C[End];
    B --> D[Alternative];
\`\`\``
  },
  {
    title: 'Task List',
    description: 'Checklist with tasks',
    category: 'Lists',
    content:
`- [ ] Task 1
- [x] Completed task
- [ ] Task 3
  - [ ] Subtask 1
  - [ ] Subtask 2`
  },
  {
    title: 'Footnotes',
    description: 'Text with footnotes',
    category: 'References',
    content:
`Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.`
  },
  {
    title: 'Collapsible Section',
    description: 'Expandable content section',
    category: 'Advanced',
    content:
`<details>
<summary>Click to expand</summary>

Your content here...
- Point 1
- Point 2

</details>`
  },
  {
    title: 'Math Equation',
    description: 'Mathematical equation using KaTeX',
    category: 'Math',
    content: 
`Inline equation: $E = mc^2$

Block equation:
$$
\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}
$$`
  },
  {
    title: 'Image Gallery',
    description: 'Grid of images with captions',
    category: 'Media',
    content:
`<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">

![Image 1](url1)
*Caption 1*

![Image 2](url2)
*Caption 2*

![Image 3](url3)
*Caption 3*

![Image 4](url4)
*Caption 4*
</div>`
  },
  {
    title: 'Definition List',
    description: 'Terms and their definitions',
    category: 'Lists',
    content:
`Term 1
: Definition of term 1
: Additional definition

Term 2
: Definition of term 2
  - Sub point 1
  - Sub point 2`
  },
  {
    title: 'Timeline',
    description: 'Chronological events list',
    category: 'Advanced',
    content:
`## Timeline

### 2024
- Event 1
- Event 2

### 2023
- Earlier event 1
- Earlier event 2

### 2022
- Past event 1
- Past event 2`
  },
  {
    title: 'Sequence Diagram',
    description: 'Mermaid sequence diagram',
    category: 'Diagrams',
    content:
`\`\`\`mermaid
sequenceDiagram
    participant A as User
    participant B as System
    A->>B: Request Data
    B-->>A: Send Response
    A->>B: Process Data
    B-->>A: Confirm Success
\`\`\``
  },
  {
    title: 'Keyboard Shortcuts',
    description: 'List of keyboard shortcuts',
    category: 'References',
    content:
`| Action | Windows/Linux | macOS |
|--------|---------------|--------|
| Save | <kbd>Ctrl</kbd> + <kbd>S</kbd> | <kbd>⌘</kbd> + <kbd>S</kbd> |
| Copy | <kbd>Ctrl</kbd> + <kbd>C</kbd> | <kbd>⌘</kbd> + <kbd>C</kbd> |
| Paste | <kbd>Ctrl</kbd> + <kbd>V</kbd> | <kbd>⌘</kbd> + <kbd>V</kbd> |`
  },
  {
    title: 'Warning Box',
    description: 'Highlighted warning message',
    category: 'Advanced',
    content:
`> ⚠️ **Warning**
> 
> This is an important warning message that needs attention.
> - Key point 1
> - Key point 2`
  },
  {
    title: 'API Endpoint',
    description: 'API documentation template',
    category: 'Code',
    content:
`### Endpoint: \`GET /api/resource\`

**Description:** Brief description of the endpoint

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | Yes | Resource ID |
| type | string | No | Resource type |

**Response:**
\`\`\`json
{
  "id": "123",
  "name": "Example",
  "status": "active"
}
\`\`\``
  },
  {
    title: 'Class Diagram',
    description: 'Mermaid class diagram',
    category: 'Diagrams',
    content:
`\`\`\`mermaid
classDiagram
    class Animal {
        +name: string
        +age: int
        +makeSound()
    }
    class Dog {
        +breed: string
        +bark()
    }
    Animal <|-- Dog
\`\`\``
  },
  {
    title: 'Tabbed Content',
    description: 'Content in tabs using HTML',
    category: 'Advanced',
    content:
`<div class="tabs">
  <details>
    <summary>Tab 1</summary>
    Content for tab 1
    - Point 1
    - Point 2
  </details>
  
  <details>
    <summary>Tab 2</summary>
    Content for tab 2
    1. Item 1
    2. Item 2
  </details>
</div>`
  },
  {
    title: 'Chemical Equations',
    description: 'Math-based chemical equations',
    category: 'Math',
    content:
`Chemical equation:
$$
\\ce{2H2 + O2 -> 2H2O}
$$

With state symbols:
$$
\\ce{CO2(g) + C(s) -> 2CO(g)}
$$`
  }
];

export const SnippetsLibrary: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { content, setContent } = useEditorStore();

  const categories = ['All', ...new Set(snippets.map(s => s.category))];

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || snippet.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const insertSnippet = (snippetContent: string) => {
    const cursorPosition = content.length;
    const newContent = content + (content.endsWith('\n\n') ? '' : '\n\n') + snippetContent + '\n';
    setContent(newContent);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Snippets Library"
      >
        <BookOpen size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Markdown Snippets
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search snippets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                  </div>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
              {filteredSnippets.map((snippet, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">
                        {snippet.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {snippet.description}
                      </p>
                    </div>
                    <button
                      onClick={() => insertSnippet(snippet.content)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                      title="Insert snippet"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                  <pre className="text-sm bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
                    <code>{snippet.content}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 