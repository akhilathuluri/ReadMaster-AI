import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SettingsState } from '../types';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiKey: '',
      setApiKey: (key: string) => set({ apiKey: key }),
      isSettingsOpen: false,
      toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
    }),
    {
      name: 'readmaster-settings',
    }
  )
);