import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { processMathInText } from './mathRenderer';
import 'katex/dist/katex.min.css';

export const exportToMarkdown = (content: string) => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.md';
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToRichPDF = async (content: string) => {
  const containerStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    width: '100%',
    maxWidth: '65ch',
    margin: '0 auto',
    padding: '24px 32px',
    color: '#24292f',
    backgroundColor: '#ffffff',
    fontSize: '16px',
    lineHeight: '1.75',
  };

  const markdownComponents = {
    h1: ({ children }: { children: React.ReactNode }) => 
      React.createElement('h1', {
        style: {
          color: '#111827',
          fontWeight: '800',
          fontSize: '2.25em',
          marginTop: '0',
          marginBottom: '0.8888889em',
          lineHeight: '1.1111111',
        }
      }, children),

    h2: ({ children }: { children: React.ReactNode }) => 
      React.createElement('h2', {
        style: {
          color: '#111827',
          fontWeight: '700',
          fontSize: '1.5em',
          marginTop: '2em',
          marginBottom: '1em',
          lineHeight: '1.3333333',
        }
      }, children),

    h3: ({ children }: { children: React.ReactNode }) => 
      React.createElement('h3', {
        style: {
          color: '#111827',
          fontWeight: '600',
          fontSize: '1.25em',
          marginTop: '1.6em',
          marginBottom: '0.6em',
          lineHeight: '1.6',
        }
      }, children),

    p: ({ children }: { children: React.ReactNode }) => {
      if (typeof children === 'string') {
        return React.createElement('p', {
          style: {
            marginTop: '1.25em',
            marginBottom: '1.25em',
            lineHeight: '1.75',
          },
          dangerouslySetInnerHTML: { __html: processMathInText(children) }
        });
      }
      return React.createElement('p', {
        style: {
          marginTop: '1.25em',
          marginBottom: '1.25em',
          lineHeight: '1.75',
        }
      }, children);
    },

    blockquote: ({ children }: { children: React.ReactNode }) => 
      React.createElement('blockquote', {
        style: {
          fontWeight: '500',
          fontStyle: 'italic',
          color: '#111827',
          borderLeftWidth: '0.25rem',
          borderLeftColor: '#e5e7eb',
          quotes: '"\\201C""\\201D""\\2018""\\2019"',
          marginTop: '1.6em',
          marginBottom: '1.6em',
          paddingLeft: '1em',
        }
      }, children),

    code: ({ inline, className, children }: { inline?: boolean; className?: string; children: React.ReactNode }) => {
      if (inline) {
        return React.createElement('code', {
          style: {
            color: '#111827',
            fontSize: '0.875em',
            fontWeight: '600',
            backgroundColor: '#f3f4f6',
            padding: '0.2em 0.4em',
            borderRadius: '0.25rem',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          }
        }, children);
      }

      return React.createElement('pre', {
        style: {
          color: '#111827',
          backgroundColor: '#f3f4f6',
          overflowX: 'auto',
          fontSize: '0.875em',
          lineHeight: '1.7142857',
          marginTop: '1.7142857em',
          marginBottom: '1.7142857em',
          borderRadius: '0.375rem',
          paddingTop: '0.8571429em',
          paddingRight: '1.1428571em',
          paddingBottom: '0.8571429em',
          paddingLeft: '1.1428571em',
          pageBreakInside: 'avoid',
        }
      }, React.createElement('code', {
        className,
        style: {
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '1em',
        }
      }, children));
    },

    ul: ({ children }: { children: React.ReactNode }) => 
      React.createElement('ul', {
        style: {
          listStyleType: 'disc',
          marginTop: '1.25em',
          marginBottom: '1.25em',
          paddingLeft: '1.625em',
        }
      }, children),

    ol: ({ children }: { children: React.ReactNode }) => 
      React.createElement('ol', {
        style: {
          listStyleType: 'decimal',
          marginTop: '1.25em',
          marginBottom: '1.25em',
          paddingLeft: '1.625em',
        }
      }, children),

    li: ({ children }: { children: React.ReactNode }) => 
      React.createElement('li', {
        style: {
          marginTop: '0.5em',
          marginBottom: '0.5em',
        }
      }, children),

    table: ({ children }: { children: React.ReactNode }) => 
      React.createElement('table', {
        style: {
          width: '100%',
          tableLayout: 'auto',
          textAlign: 'left',
          marginTop: '2em',
          marginBottom: '2em',
          fontSize: '0.875em',
          lineHeight: '1.7142857',
        }
      }, children),

    th: ({ children }: { children: React.ReactNode }) => 
      React.createElement('th', {
        style: {
          fontWeight: '600',
          padding: '0.5714286em',
          verticalAlign: 'bottom',
          borderBottomWidth: '2px',
          borderBottomColor: '#e5e7eb',
        }
      }, children),

    td: ({ children }: { children: React.ReactNode }) => 
      React.createElement('td', {
        style: {
          padding: '0.5714286em',
          verticalAlign: 'top',
          borderBottomWidth: '1px',
          borderBottomColor: '#e5e7eb',
        }
      }, children),
  };

  const styledContent = renderToString(
    React.createElement('div', { style: containerStyle },
      React.createElement(ReactMarkdown, {
        remarkPlugins: [remarkGfm],
        components: markdownComponents,
        children: content
      })
    )
  );

  const element = document.createElement('div');
  element.innerHTML = styledContent;

  const opt = {
    margin: [40, 40, 40, 40],
    filename: 'document.pdf',
    image: { 
      type: 'jpeg', 
      quality: 1
    },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      scrollY: 0,
      windowWidth: 816, // A4 width at 96 DPI
    },
    jsPDF: { 
      unit: 'pt',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
      precision: 16,
    },
    pagebreak: { 
      mode: 'avoid-all',
      before: '.page-break',
      avoid: ['pre', 'blockquote', 'table', 'img']
    }
  };

  try {
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error('Failed to export rich PDF:', error);
    return false;
  }
};