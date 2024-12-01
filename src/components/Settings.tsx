import { FC, useState } from 'react';
import { Settings as SettingsIcon, X, Eye, EyeOff } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

export const Settings: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Load existing settings
    const settings = JSON.parse(localStorage.getItem('readmaster-settings') || '{}');
    setApiKey(settings.state?.apiKey || '');

    // Listen for settings trigger
    const handleOpenSettings = (event: CustomEvent) => {
      setIsOpen(true);
      if (event.detail?.isFirstVisit) {
        setShowWelcome(true);
      }
    };

    window.addEventListener('open-settings' as any, handleOpenSettings);
    return () => window.removeEventListener('open-settings' as any, handleOpenSettings);
  }, []);

  const handleSave = () => {
    const settings = {
      state: {
        apiKey,
        isSettingsOpen: false
      },
      version: 0
    };
    localStorage.setItem('readmaster-settings', JSON.stringify(settings));
    setIsOpen(false);
    setShowWelcome(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Settings"
      >
        <SettingsIcon size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {showWelcome ? 'Welcome to ReadMaster AI! 🎉' : 'Settings'}
              </h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowWelcome(false);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              {showWelcome && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-blue-600 dark:text-blue-400 mb-2">
                    To get started with AI features, please configure your Gemini API key.
                  </p>
                  <p className="text-sm text-blue-500 dark:text-blue-300">
                    You can get your API key from the{' '}
                    <a
                      href="https://makersuite.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-700 dark:hover:text-blue-200"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {showWelcome ? 'Get Started' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
