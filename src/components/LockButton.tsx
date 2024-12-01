import { FC } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export const LockButton: FC = () => {
  const { isLocked, toggleLock } = useEditorStore();

  return (
    <button
      onClick={toggleLock}
      className={`p-2 rounded-lg transition-colors ${
        isLocked 
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      title={isLocked ? 'Unlock document' : 'Lock document'}
    >
      {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
    </button>
  );
}; 