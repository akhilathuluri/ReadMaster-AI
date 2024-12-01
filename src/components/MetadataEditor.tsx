import { FC, useState } from 'react';
import { FileText, Plus, X, Save } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { parseMetadata, stringifyMetadata } from '../utils/metadata';

interface Metadata {
  [key: string]: string;
}

export const MetadataEditor: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { content, setContent } = useEditorStore();
  const [metadata, setMetadata] = useState<Metadata>(() => parseMetadata(content));
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleSave = () => {
    const newContent = stringifyMetadata(metadata, content);
    setContent(newContent);
    setIsOpen(false);
  };

  const handleAddField = () => {
    if (newKey && newValue) {
      setMetadata(prev => ({
        ...prev,
        [newKey]: newValue
      }));
      setNewKey('');
      setNewValue('');
    }
  };

  const handleRemoveField = (key: string) => {
    setMetadata(prev => {
      const newMetadata = { ...prev };
      delete newMetadata[key];
      return newMetadata;
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Edit Metadata"
      >
        <FileText size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Document Metadata
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {/* Existing Metadata Fields */}
              <div className="space-y-4 mb-6">
                {Object.entries(metadata).map(([key, value]) => (
                  <div key={key} className="flex items-start space-x-2">
                    <input
                      type="text"
                      value={key}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setMetadata(prev => ({
                        ...prev,
                        [key]: e.target.value
                      }))}
                      className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => handleRemoveField(key)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Field */}
              <div className="flex items-start space-x-2 mb-6">
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Field name"
                  className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg text-sm"
                />
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg text-sm"
                />
                <button
                  onClick={handleAddField}
                  disabled={!newKey || !newValue}
                  className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Common Fields Suggestions */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Suggested Fields
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['title', 'author', 'date', 'tags', 'category', 'description'].map(field => (
                    !metadata[field] && (
                      <button
                        key={field}
                        onClick={() => {
                          setNewKey(field);
                          setNewValue('');
                        }}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        {field}
                      </button>
                    )
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Save Metadata</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 