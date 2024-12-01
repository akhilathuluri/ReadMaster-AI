import { FC, useState, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

export const MarkdownCheatSheet: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const cheatSheet = [
    {
      category: 'Basic Formatting',
      items: [
        { syntax: '**bold text**', description: 'Bold text' },
        { syntax: '*italic text*', description: 'Italic text' },
        { syntax: '~~strikethrough~~', description: 'Strikethrough text' },
        { syntax: '`inline code`', description: 'Inline code' },
        { syntax: '# Heading 1\n## Heading 2\n### Heading 3', description: 'Headings (1-6 levels)' },
        { syntax: '[Link text](URL)', description: 'Hyperlink' },
        { syntax: '![Alt text](image-url)', description: 'Image' },
      ]
    },
    {
      category: 'Lists and Tasks',
      items: [
        { syntax: '1. First item\n2. Second item\n3. Third item', description: 'Ordered list' },
        { syntax: '- Item one\n- Item two\n- Item three', description: 'Unordered list' },
        { syntax: '- [ ] Todo item\n- [x] Completed item', description: 'Task list' },
        { syntax: '   - Nested item\n   - Another nested item', description: 'Nested list (indent with spaces)' },
      ]
    },
    {
      category: 'Code Blocks',
      items: [
        { 
          syntax: '```javascript\nconst greeting = "Hello";\nconsole.log(greeting);\n```', 
          description: 'Code block with syntax highlighting' 
        },
        { 
          syntax: '```python\ndef greet(name):\n    print(f"Hello, {name}!")\n```', 
          description: 'Python code example' 
        },
      ]
    },
    {
      category: 'Tables',
      items: [
        {
          syntax: '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |',
          description: 'Basic table'
        },
        {
          syntax: '| Left | Center | Right |\n|:-----|:------:|------:|\n|Left|Center|Right|',
          description: 'Aligned table columns'
        },
      ]
    },
    {
      category: 'Mathematical Expressions',
      items: [
        { 
          syntax: '$E = mc^2$', 
          description: 'Inline math expression' 
        },
        { 
          syntax: '$$\n\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}\n$$', 
          description: 'Display math equation (quadratic formula)' 
        },
        { 
          syntax: '$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$', 
          description: 'Summation formula' 
        },
        { 
          syntax: '$\\vec{F} = m\\vec{a}$', 
          description: 'Vector notation' 
        },
      ]
    },
    {
      category: 'Quotes and Notes',
      items: [
        { 
          syntax: '> This is a blockquote\n> Multiple lines\n> > Nested quote', 
          description: 'Blockquotes (can be nested)' 
        },
        { 
          syntax: '---', 
          description: 'Horizontal rule' 
        },
        {
          syntax: '[^1]: This is a footnote\n\nReference it like this[^1]',
          description: 'Footnotes'
        }
      ]
    },
    {
      category: 'Advanced Features',
      items: [
        { 
          syntax: '<details>\n<summary>Click to expand</summary>\nHidden content here\n</details>', 
          description: 'Collapsible section' 
        },
        { 
          syntax: '- [x] @mentions, #refs, [links](),\n**formatting** supported',
          description: 'Task list with formatting'
        },
        {
          syntax: '```mermaid\ngraph TD;\n    A-->B;\n    A-->C;\n```',
          description: 'Mermaid diagrams'
        }
      ]
    },
    {
      category: 'Keyboard Shortcuts',
      items: [
        { syntax: 'Ctrl + B', description: 'Bold text' },
        { syntax: 'Ctrl + I', description: 'Italic text' },
        { syntax: 'Ctrl + K', description: 'Create link' },
        { syntax: 'Ctrl + Space', description: 'Toggle cheat sheet' },
        { syntax: 'Ctrl + S', description: 'Save version' },
      ]
    }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Markdown Cheat Sheet"
      >
        <HelpCircle size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Markdown Cheat Sheet
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {cheatSheet.map((section) => (
                <div key={section.category} className="transition-all duration-200 hover:translate-x-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                    {section.category}
                  </h3>
                  <div className="space-y-3">
                    {section.items.map((item, index) => (
                      <div
                        key={index}
                        className="grid md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-pre">
                          {item.syntax}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 flex items-center">
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center space-x-2">
                <span>Press</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  Ctrl
                </kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  Space
                </kbd>
                <span>to toggle this cheat sheet</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 