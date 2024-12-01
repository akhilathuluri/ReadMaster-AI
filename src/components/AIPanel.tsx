import { FC, useState } from 'react';
import { Wand2, Search, Loader, BookOpen, Type } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { getContentSuggestions, analyzeSEO, analyzeReadability, generateHeadlines } from '../services/ai';
import { AIOutput } from './AIOutput';

export const AIPanel: FC = () => {
  const { content } = useEditorStore();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'seo' | 'readability' | 'headlines'>('suggestions');

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setActiveTab('suggestions');
    const result = await getContentSuggestions(content);
    if (result.error) {
      setError(result.error);
    } else {
      setSuggestions(result.suggestions);
    }
    setIsLoading(false);
  };

  const handleAnalyzeSEO = async () => {
    setIsLoading(true);
    setError(null);
    setActiveTab('seo');
    const result = await analyzeSEO(content);
    if (result.error) {
      setError(result.error);
    } else {
      setSuggestions(result.suggestions);
    }
    setIsLoading(false);
  };

  const handleAnalyzeReadability = async () => {
    setIsLoading(true);
    setError(null);
    setActiveTab('readability');
    const result = await analyzeReadability(content);
    if (result.error) {
      setError(result.error);
    } else {
      setSuggestions(result.suggestions);
    }
    setIsLoading(false);
  };

  const handleGenerateHeadlines = async () => {
    setIsLoading(true);
    setError(null);
    setActiveTab('headlines');
    const result = await generateHeadlines(content);
    if (result.error) {
      setError(result.error);
    } else {
      setSuggestions(result.suggestions);
    }
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">AI Assistant</h2>
        <div className="space-y-3">
          <button
            onClick={handleGetSuggestions}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Wand2 size={20} />
            <span>Get Suggestions</span>
          </button>
          <button
            onClick={handleAnalyzeSEO}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Search size={20} />
            <span>Analyze SEO</span>
          </button>
          <button
            onClick={handleAnalyzeReadability}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 p-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <BookOpen size={20} />
            <span>Check Readability</span>
          </button>
          <button
            onClick={handleGenerateHeadlines}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Type size={20} />
            <span>Generate Headlines</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <Loader className="animate-spin text-gray-500" size={24} />
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {suggestions.length > 0 && !isLoading && (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <AIOutput 
                key={index}
                type={activeTab}
                content={suggestion}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};