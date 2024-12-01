import { FC } from 'react';
import { Editor } from '../components/Editor';
import { Preview } from '../components/Preview';
import { Toolbar } from '../components/Toolbar';
import { AIPanel } from '../components/AIPanel';
import { TemplateSelector } from '../components/TemplateSelector';
import { WordStatsPanel } from '../components/WordStatsPanel';
import { FileSizeDisplay } from '../components/FileSizeDisplay';
import { useEditorStore } from '../store/editorStore';

export const EditorPage: FC = () => {
  const { isDarkMode, isPanelCollapsed, isAIPanelCollapsed, content } = useEditorStore();

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <div className={`flex flex-col w-64 border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${isPanelCollapsed ? 'hidden' : ''}`}>
          <div className="flex-1 overflow-auto">
            <TemplateSelector />
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <WordStatsPanel content={content} />
          </div>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex min-h-0">
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 overflow-auto">
                <Editor />
              </div>
            </div>
            <div className={`flex-1 flex flex-col min-w-0 border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex-1 overflow-auto">
                <Preview />
              </div>
            </div>
          </div>
          <FileSizeDisplay />
        </div>
        <div className={`w-80 border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${isAIPanelCollapsed ? 'hidden' : ''}`}>
          <AIPanel />
        </div>
      </div>
    </div>
  );
}; 