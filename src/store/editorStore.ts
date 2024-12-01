import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EditorState } from '../types';

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      content: '# Welcome to ReadMaster AI\n\nStart writing your markdown here...',
      setContent: (content) => set({ content }),
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      isPanelCollapsed: false,
      togglePanel: () => set((state) => ({ isPanelCollapsed: !state.isPanelCollapsed })),
      isAIPanelCollapsed: false,
      toggleAIPanel: () => set((state) => ({ isAIPanelCollapsed: !state.isAIPanelCollapsed })),
      currentTemplate: null,
      setCurrentTemplate: (template) => set({ currentTemplate: template }),
      isLocked: false,
      toggleLock: () => set((state) => ({ isLocked: !state.isLocked })),
    }),
    {
      name: 'readmaster-storage',
    }
  )
);