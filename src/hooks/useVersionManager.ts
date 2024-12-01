import { useEffect, useCallback } from 'react';
import { useVersionStore } from '../store/versionStore';
import { useEditorStore } from '../store/editorStore';

export const useVersionManager = () => {
  const { content } = useEditorStore();
  const { addVersion } = useVersionStore();

  const saveVersion = useCallback((description: string) => {
    addVersion(content, description);
  }, [content, addVersion]);

  // Auto-save version every 5 minutes if there are changes
  useEffect(() => {
    let lastContent = content;
    const interval = setInterval(() => {
      if (content !== lastContent) {
        addVersion(content, 'Auto-saved version');
        lastContent = content;
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [content, addVersion]);

  return { saveVersion };
}; 