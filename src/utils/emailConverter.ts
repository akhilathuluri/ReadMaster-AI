import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { processMathInText } from './mathRenderer';
import 'katex/dist/katex.min.css';

const emailStyles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    color: '#333333',
    backgroundColor: '#ffffff',
    padding: '20px',
  },
  heading1: {
    color: '#2563eb',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    borderBottom: '2px solid #2563eb',
    paddingBottom: '8px',
  },
  heading2: {
    color: '#1e40af',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  paragraph: {
    marginBottom: '16px',
    fontSize: '16px',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'underline',
  },
  blockquote: {
    borderLeft: '4px solid #e5e7eb',
    paddingLeft: '16px',
    margin: '16px 0',
    fontStyle: 'italic',
    color: '#4b5563',
  },
  code: {
    backgroundColor: '#f3f4f6',
    padding: '2px 4px',
    borderRadius: '4px',
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: '14px',
    display: 'inline',
    whiteSpace: 'normal',
  },
  codeBlock: {
    backgroundColor: '#f3f4f6',
    padding: '16px',
    borderRadius: '8px',
    overflowX: 'auto',
    fontFamily: 'monospace',
    fontSize: '14px',
    marginBottom: '16px',
    display: 'block',
    whiteSpace: 'pre',
    maxWidth: '100%',
    lineHeight: '1.5',
  },
  list: {
    marginBottom: '16px',
    paddingLeft: '20px',
  },
  listItem: {
    marginBottom: '8px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '16px',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #e5e7eb',
  },
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
  },
  pre: {
    margin: '16px 0',
    padding: '16px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    overflow: 'auto',
    width: '100%',
    boxSizing: 'border-box',
    display: 'block',
  },
  preCode: {
    display: 'block',
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: '14px',
    lineHeight: '1.6',
    backgroundColor: 'transparent',
    padding: '0',
    margin: '0',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    tabSize: '2',
    color: '#333333',
  },
};

export const convertToEmailHTML = (markdown: string): string => {
  const markdownComponents = {
    h1: ({ children }: { children: React.ReactNode }) => 
      React.createElement('h1', { style: emailStyles.heading1 }, children),
    h2: ({ children }: { children: React.ReactNode }) => 
      React.createElement('h2', { style: emailStyles.heading2 }, children),
    p: ({ children }: { children: React.ReactNode }) => {
      if (typeof children === 'string') {
        return React.createElement('p', {
          style: emailStyles.paragraph,
          dangerouslySetInnerHTML: { __html: processMathInText(children) }
        });
      }
      return React.createElement('p', { style: emailStyles.paragraph }, children);
    },
    a: ({ href, children }: { href?: string; children: React.ReactNode }) => 
      React.createElement('a', { href, style: emailStyles.link }, children),
    blockquote: ({ children }: { children: React.ReactNode }) => 
      React.createElement('blockquote', { style: emailStyles.blockquote }, children),
    code: ({ inline, children }: { inline?: boolean; children: React.ReactNode }) => {
      if (inline) {
        return React.createElement('code', { style: emailStyles.code }, children);
      }
      return React.createElement('code', { style: emailStyles.preCode }, children);
    },
    ul: ({ children }: { children: React.ReactNode }) => 
      React.createElement('ul', { style: emailStyles.list }, children),
    ol: ({ children }: { children: React.ReactNode }) => 
      React.createElement('ol', { style: emailStyles.list }, children),
    li: ({ children }: { children: React.ReactNode }) => 
      React.createElement('li', { style: emailStyles.listItem }, children),
    table: ({ children }: { children: React.ReactNode }) => 
      React.createElement('table', { style: emailStyles.table }, children),
    th: ({ children }: { children: React.ReactNode }) => 
      React.createElement('th', { style: emailStyles.tableHeader }, children),
    td: ({ children }: { children: React.ReactNode }) => 
      React.createElement('td', { style: emailStyles.tableCell }, children),
    pre: ({ children }: { children: React.ReactNode }) => 
      React.createElement('pre', { style: emailStyles.pre }, children),
  };

  const emailContent = renderToString(
    React.createElement('div', { style: emailStyles.container },
      React.createElement(ReactMarkdown, {
        remarkPlugins: [remarkGfm],
        components: markdownComponents,
        children: markdown
      })
    )
  );

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email</title>
  <style>
    pre {
      background-color: #f3f4f6 !important;
      border-radius: 8px !important;
      border: 1px solid #e5e7eb !important;
      padding: 16px !important;
      margin: 16px 0 !important;
      overflow: auto !important;
      display: block !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    
    pre code {
      font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace !important;
      font-size: 14px !important;
      line-height: 1.6 !important;
      background-color: transparent !important;
      padding: 0 !important;
      margin: 0 !important;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
      display: block !important;
      color: #333333 !important;
      tab-size: 2 !important;
    }
    
    :not(pre) > code {
      background-color: #f3f4f6 !important;
      padding: 2px 4px !important;
      border-radius: 4px !important;
      font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace !important;
      font-size: 14px !important;
      white-space: normal !important;
      color: #333333 !important;
    }

    /* Additional fixes for email clients */
    .code-block {
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
      display: block !important;
      line-height: 1.6 !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0;">
  ${emailContent}
</body>
</html>`;
}; 