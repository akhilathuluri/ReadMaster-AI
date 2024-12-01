import { FC, useState } from 'react';
import { History, ChevronDown, ChevronUp, RotateCcw, Trash2, X } from 'lucide-react';
import { useVersionStore, Version } from '../store/versionStore';
import { useEditorStore } from '../store/editorStore';

export const VersionHistory: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const { versions, revertToVersion, deleteVersion } = useVersionStore();
  const { setContent } = useEditorStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleRevert = (version: Version) => {
    setSelectedVersion(version);
    setShowConfirm(true);
  };

  const confirmRevert = () => {
    if (selectedVersion) {
      const content = revertToVersion(selectedVersion.id);
      setContent(content);
      setShowConfirm(false);
      setSelectedVersion(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Version History"
      >
        <History size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Version History
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {versions.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No versions available yet
                </div>
              ) : (
                <div className="space-y-4">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(version.timestamp)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleRevert(version)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                            title="Revert to this version"
                          >
                            <RotateCcw size={16} />
                          </button>
                          <button
                            onClick={() => deleteVersion(version.id)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-red-500"
                            title="Delete version"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="text-gray-900 dark:text-gray-100">
                        {version.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Confirm Revert
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to revert to this version? Current changes will be saved as a new version.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmRevert}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Revert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};