import { FC, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEditorStore } from '../store/editorStore';
import { processMathInText } from '../utils/mathRenderer';
import mermaid from 'mermaid';
import 'katex/dist/katex.min.css';

export const Preview: FC = () => {
  const { content, isDarkMode } = useEditorStore();

  // Initialize mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: isDarkMode ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'monospace',
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
      },
    });
  }, [isDarkMode]);

  const components = {
    p: ({ children, ...props }) => {
      if (typeof children === 'string') {
        return (
          <p {...props} dangerouslySetInnerHTML={{ __html: processMathInText(children) }} />
        );
      }

      if (Array.isArray(children)) {
        const hasCodeBlock = children.some(child => 
          typeof child === 'object' && child?.props?.node?.tagName === 'code' && !child?.props?.inline
        );
        if (hasCodeBlock) {
          return <>{children}</>;
        }
      }

      return <p {...props}>{children}</p>;
    },

    code: ({ inline, className, children }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      if (inline) {
        if (typeof children === 'string' && children.match(/^\$.*\$$/)) {
          const mathExpr = children.slice(1, -1);
          return <span dangerouslySetInnerHTML={{ __html: processMathInText(mathExpr) }} />;
        }
        return (
          <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-gray-800 dark:text-gray-200">
            {children}
          </code>
        );
      }

      // Handle Mermaid diagrams
      if (language === 'mermaid') {
        return (
          <div className="mermaid my-4 flex justify-center">
            {children}
          </div>
        );
      }

      // Regular code blocks with better syntax colors
      return (
        <div className="relative my-4">
          {language && (
            <div className="absolute top-0 right-0 px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-tr rounded-bl border-b border-l border-gray-200 dark:border-gray-700">
              {language}
            </div>
          )}
          <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-200 dark:border-gray-700">
            <code className={`${className} block font-mono text-sm`}>
              <div className="token-line">
                {typeof children === 'string' 
                  ? children.split('\n').map((line, i) => (
                    <div key={i} className="table-row">
                      <span className="table-cell pr-4 text-gray-500 dark:text-gray-400 select-none">
                        {i + 1}
                      </span>
                      <span className={`table-cell ${
                        isDarkMode 
                          ? 'text-gray-200' 
                          : 'text-gray-800'
                      }`}>
                        {line || '\n'}
                      </span>
                    </div>
                  ))
                  : children}
              </div>
            </code>
          </pre>
        </div>
      );
    },

    pre: ({ children }) => children,
  };

  // Re-initialize Mermaid diagrams when content changes
  useEffect(() => {
    if (content.includes('```mermaid')) {
      setTimeout(() => {
        try {
          mermaid.init('.mermaid');
        } catch (error) {
          console.error('Mermaid initialization error:', error);
        }
      }, 100);
    }
  }, [content]);

  return (
    <div 
      className={`h-full overflow-auto px-8 py-6 prose prose-sm md:prose-base lg:prose-lg max-w-none ${
        isDarkMode 
          ? 'bg-[#1e1e1e] text-gray-200 prose-headings:text-gray-100 prose-a:text-blue-400 prose-blockquote:text-gray-300 prose-strong:text-gray-100 prose-code:text-gray-200' 
          : 'bg-white text-gray-900 prose-a:text-blue-600 prose-code:text-gray-800'
      }`}
    >
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};