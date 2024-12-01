import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Columns, PanelLeftClose, Download, Copy, Share2, Home, FileDown, List, Settings as SettingsIcon, Wand, Bot, PanelRightClose, Loader, Mail } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { Settings } from './Settings';
import { EmojiPicker } from './EmojiPicker';
import { exportToPDF, exportToMarkdown, exportToRichPDF } from '../utils/export';
import { generateTableOfContents } from '../utils/toc';
import { smartFormatMarkdown } from '../utils/smartFormat';
import { FocusTimer } from './FocusTimer';
import { SmartQuery } from './SmartQuery';
import { VersionHistory } from './VersionHistory';
import { convertToEmailHTML } from '../utils/emailConverter';
import { MetadataEditor } from './MetadataEditor';
import { CodeExecutor } from './CodeExecutor';
import { SnippetsLibrary } from './SnippetsLibrary';
import { WordCloud } from './WordCloud';
import { LockButton } from './LockButton';
import { QuickLinks } from './QuickLinks';
import { SmartSuggestions } from './SmartSuggestions';
import { ImageAnalyzer } from './ImageAnalyzer';

export const Toolbar: FC = () => {
  const { isDarkMode, toggleDarkMode, isPanelCollapsed, togglePanel, isAIPanelCollapsed, toggleAIPanel, content, setContent } = useEditorStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
  };

  const handleGenerateTOC = () => {
    const contentWithTOC = generateTableOfContents(content);
    setContent(contentWithTOC);
  };

  const handleSmartFormat = () => {
    const formattedContent = smartFormatMarkdown(content);
    setContent(formattedContent);
  };

  const handleRichPDFExport = async () => {
    setIsExporting(true);
    try {
      await exportToRichPDF(content);
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailExport = () => {
    const emailHTML = convertToEmailHTML(content);
    const blob = new Blob([emailHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`h-14 border-b flex items-center justify-between px-4 ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-2">
        <Link to="/" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Home size={20} />
        </Link>
        <button
          onClick={togglePanel}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          title={isPanelCollapsed ? 'Show sidebar' : 'Hide sidebar'}
        >
          {isPanelCollapsed ? <Columns size={20} /> : <PanelLeftClose size={20} />}
        </button>
        <button
          onClick={handleGenerateTOC}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Generate Table of Contents"
        >
          <List size={20} />
        </button>
        <button
          onClick={handleSmartFormat}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Smart Format"
        >
          <Wand size={20} />
        </button>
        <MetadataEditor />
        <CodeExecutor />
        <SnippetsLibrary />
        <WordCloud />
        <QuickLinks />
        <SmartSuggestions />
        <ImageAnalyzer />
        <SmartQuery />
        <EmojiPicker />
        <FocusTimer />
        <VersionHistory />
        <LockButton />
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={toggleAIPanel}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          title={isAIPanelCollapsed ? 'Show AI Assistant' : 'Hide AI Assistant'}
        >
          {isAIPanelCollapsed ? <Bot size={20} /> : <PanelRightClose size={20} />}
        </button>
        <button
          onClick={() => exportToMarkdown(content)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Export as Markdown"
        >
          <Download size={20} />
        </button>
        <button
          onClick={handleRichPDFExport}
          disabled={isExporting}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          title="Export as PDF"
        >
          {isExporting ? (
            <div className="animate-spin">
              <Loader size={20} />
            </div>
          ) : (
            <FileDown size={20} />
          )}
        </button>
        <button
          onClick={handleEmailExport}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Export as HTML Email"
        >
          <Mail size={20} />
        </button>
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Copy to clipboard"
        >
          <Copy size={20} />
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          title={isDarkMode ? 'Light mode' : 'Dark mode'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <Settings />
      </div>
    </div>
  );
};