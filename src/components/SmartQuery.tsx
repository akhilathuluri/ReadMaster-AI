import { FC, useState, useRef, useEffect } from 'react';
import { Search, X, Loader } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { getMarkdownHelp } from '../services/ai';

export const SmartQuery: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode } = useEditorStore();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await getMarkdownHelp(query);
      if (response.error) {
        setError(response.error);
      } else {
        setAnswer(response.suggestions[0]);
      }
    } catch (err) {
      setError('Failed to get answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
    setAnswer(null);
    setError(null);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Ask about Markdown"
      >
        <Search size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Ask about Markdown
              </h3>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className="p-4 border-b dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., How do I create a table in Markdown?"
                  className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Ask
                </button>
              </div>
            </form>

            {/* Answer Area */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {isLoading && (
                <div className="flex justify-center py-8">
                  <Loader className="animate-spin text-blue-600" size={24} />
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                  {error}
                </div>
              )}

              {answer && !isLoading && (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                    Your question: {query}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                      {answer}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 