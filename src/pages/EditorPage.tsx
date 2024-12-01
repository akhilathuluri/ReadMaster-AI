import { FC } from 'react';
import { Editor } from '../components/Editor';
import { Preview } from '../components/Preview';
import { Toolbar } from '../components/Toolbar';
import { AIPanel } from '../components/AIPanel';
import { TemplateSelector } from '../components/TemplateSelector';
import { WordStatsPanel } from '../components/WordStatsPanel';
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
          <div className="p-4">
            <WordStatsPanel content={content} />
          </div>
        </div>
        <div className="flex-1 flex">
          <div className="flex-1">
            <Editor />
          </div>
          <div className={`flex-1 border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <Preview />
          </div>
        </div>
        <div className={`w-80 border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${isAIPanelCollapsed ? 'hidden' : ''}`}>
          <AIPanel />
        </div>
      </div>
    </div>
  );
};