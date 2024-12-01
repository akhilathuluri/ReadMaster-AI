import { FC, useState } from 'react';
import { Play, X, Terminal, Loader, AlertCircle } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { executeCode } from '../utils/codeExecutor';

interface ExecutionResult {
  output: string;
  error?: string;
  language: string;
}

export const CodeExecutor: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<ExecutionResult[]>([]);
  const { content } = useEditorStore();

  const extractCodeBlocks = (markdown: string) => {
    const regex = /```javascript\n([\s\S]*?)```/g;
    const blocks: { language: string; code: string }[] = [];
    let match;

    while ((match = regex.exec(markdown)) !== null) {
      blocks.push({
        language: 'javascript',
        code: match[1].trim()
      });
    }

    return blocks;
  };

  const handleExecute = async () => {
    const codeBlocks = extractCodeBlocks(content);
    setIsExecuting(true);
    setResults([]);

    try {
      const executions = codeBlocks.map(async ({ language, code }) => {
        try {
          const output = await executeCode(code, language);
          return { output, language };
        } catch (error) {
          return { output: '', error: error.message, language };
        }
      });

      const executionResults = await Promise.all(executions);
      setResults(executionResults);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Execute JavaScript Code Blocks"
      >
        <Terminal size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                JavaScript Code Execution
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Execute JavaScript code blocks
                  </p>
                  <button
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isExecuting ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        <span>Executing...</span>
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        <span>Execute All</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
                  >
                    {result.error ? (
                      <div className="flex items-center text-red-500">
                        <AlertCircle size={16} className="mr-1" />
                        <span className="text-sm">{result.error}</span>
                      </div>
                    ) : (
                      <pre className="p-3 rounded-md text-sm font-mono overflow-x-auto bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        {result.output}
                      </pre>
                    )}
                  </div>
                ))}

                {results.length === 0 && !isExecuting && (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No code blocks executed yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 