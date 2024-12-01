import { FC, useEffect, useState } from 'react';
import { FileText, FileDown } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { formatFileSize, estimateMarkdownSize, estimateRichPDFSize } from '../utils/fileSize';

export const FileSizeDisplay: FC = () => {
  const { content, isDarkMode } = useEditorStore();
  const [sizes, setSizes] = useState({
    markdown: '0 B',
    richPdf: '0 B'
  });

  useEffect(() => {
    setSizes({
      markdown: formatFileSize(estimateMarkdownSize(content)),
      richPdf: formatFileSize(estimateRichPDFSize(content))
    });
  }, [content]);

  return (
    <div className={`flex items-center justify-between px-4 py-2 border-t ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <FileText size={16} className="shrink-0" />
          <span className="text-sm whitespace-nowrap">MD: {sizes.markdown}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <FileDown size={16} className="shrink-0" />
          <span className="text-sm whitespace-nowrap">PDF: {sizes.richPdf}</span>
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
        Estimated file sizes
      </div>
    </div>
  );
}; 