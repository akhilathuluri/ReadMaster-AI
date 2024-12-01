import { FC, useState, useEffect } from 'react';
import { Sparkles, X, AlertCircle, Check, ThumbsUp, ThumbsDown, Lightbulb, PenTool } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { analyzeSections, analyzeStructure, SuggestionType, analyzeWithAI } from '../utils/contentAnalyzer';
import { Link } from 'react-router-dom';

interface Suggestion {
  id: string;
  type: SuggestionType;
  message: string;
  lineNumber?: number;
  improvement?: string;
  applied?: boolean;
  dismissed?: boolean;
}

export const SmartSuggestions: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { content, setContent } = useEditorStore();
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('readmaster-settings') || '{}');
    setHasApiKey(!!settings.state?.apiKey);
  }, []);

  const analyzeSuggestions = async () => {
    setIsAnalyzing(true);
    try {
      const structuralSuggestions = analyzeStructure(content);
      const sectionSuggestions = analyzeSections(content);
      
      // Only call AI analysis if API key is available
      let aiSuggestions = [];
      if (hasApiKey) {
        aiSuggestions = await analyzeWithAI(content);
      } else {
        aiSuggestions = [{
          id: 'api-key-required',
          type: 'content',
          message: 'Add your Gemini API key in Settings to enable AI-powered suggestions.',
          improvement: undefined
        }];
      }
      
      setSuggestions([
        ...structuralSuggestions,
        ...sectionSuggestions,
        ...aiSuggestions
      ]);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      analyzeSuggestions();
    }
  }, [isOpen, content]);

  const applySuggestion = (suggestion: Suggestion) => {
    if (suggestion.improvement) {
      const lines = content.split('\n');
      if (suggestion.lineNumber !== undefined) {
        lines[suggestion.lineNumber] = suggestion.improvement;
      } else {
        // Apply global improvements
        switch (suggestion.type) {
          case 'structure':
            // Add missing sections
            lines.push('\n' + suggestion.improvement);
            break;
          case 'heading':
            // Fix heading hierarchy
            const newContent = content.replace(/^(#+)\s/gm, (match, hashes) => {
              return '#'.repeat(hashes.length - 1) + ' ';
            });
            setContent(newContent);
            return;
          default:
            lines.push(suggestion.improvement);
        }
      }
      setContent(lines.join('\n'));
    }
    setSuggestions(prev => 
      prev.map(s => s.id === suggestion.id ? { ...s, applied: true } : s)
    );
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => 
      prev.map(s => s.id === suggestionId ? { ...s, dismissed: true } : s)
    );
  };

  const activeSuggestions = suggestions.filter(s => !s.applied && !s.dismissed);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className={`p-2 rounded-lg transition-colors relative ${
          activeSuggestions.length > 0
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title="Smart Suggestions"
      >
        <Sparkles size={20} />
        {activeSuggestions.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {activeSuggestions.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Smart Content Suggestions
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin mr-2">
                    <Sparkles size={20} />
                  </div>
                  <span>Analyzing content...</span>
                </div>
              ) : activeSuggestions.length > 0 ? (
                <div className="space-y-4">
                  {activeSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {suggestion.type === 'clarity' && (
                            <Lightbulb 
                              size={20} 
                              className="text-yellow-500 dark:text-yellow-400 mt-1 shrink-0" 
                            />
                          )}
                          {suggestion.type === 'style' && (
                            <PenTool 
                              size={20} 
                              className="text-purple-500 dark:text-purple-400 mt-1 shrink-0" 
                            />
                          )}
                          <div>
                            <p className="text-gray-900 dark:text-gray-100">
                              {suggestion.message}
                            </p>
                            {suggestion.improvement && (
                              <pre className="mt-2 text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
                                {suggestion.improvement}
                              </pre>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          {suggestion.improvement && (
                            <button
                              onClick={() => applySuggestion(suggestion)}
                              className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                              title="Apply suggestion"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => dismissSuggestion(suggestion.id)}
                            className="p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            title="Dismiss suggestion"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No suggestions at the moment
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {!hasApiKey && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
          <Link 
            to="/settings" 
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Configure Gemini API key
          </Link>
          {' '}to enable AI-powered suggestions
        </div>
      )}
    </div>
  );
}; 