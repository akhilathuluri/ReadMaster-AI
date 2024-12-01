import { FC, useState } from 'react';
import { Search, Replace, X } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export const FindReplace: FC = () => {
  const { content, setContent } = useEditorStore();
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [matches, setMatches] = useState<number>(0);

  const countMatches = (text: string) => {
    if (!findText) return 0;
    let searchText = findText;
    let contentText = content;
    
    if (!matchCase) {
      searchText = searchText.toLowerCase();
      contentText = contentText.toLowerCase();
    }

    if (wholeWord) {
      const regex = new RegExp(`\\b${searchText}\\b`, 'g');
      return (contentText.match(regex) || []).length;
    }

    return contentText.split(searchText).length - 1;
  };

  const handleFind = () => {
    const count = countMatches(findText);
    setMatches(count);
  };

  const handleReplace = () => {
    if (!findText) return;

    let flags = matchCase ? 'g' : 'gi';
    let searchText = findText;

    if (wholeWord) {
      searchText = `\\b${findText}\\b`;
    }

    const regex = new RegExp(searchText, flags);
    const newContent = content.replace(regex, replaceText);
    setContent(newContent);
    handleFind();
  };

  const handleReplaceAll = () => {
    if (!findText) return;

    let flags = matchCase ? 'g' : 'gi';
    let searchText = findText;

    if (wholeWord) {
      searchText = `\\b${findText}\\b`;
    }

    const regex = new RegExp(searchText, flags);
    const newContent = content.replace(regex, replaceText);
    setContent(newContent);
    setMatches(0);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Find & Replace
        </h3>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={matchCase}
              onChange={(e) => setMatchCase(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Match case</span>
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(e) => setWholeWord(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Whole word</span>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            placeholder="Find text..."
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleFind}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Search size={16} />
          </button>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replace with..."
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleReplace}
            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Replace size={16} />
          </button>
        </div>

        {matches > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {matches} match{matches !== 1 ? 'es' : ''} found
            </span>
            <button
              onClick={handleReplaceAll}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Replace All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 