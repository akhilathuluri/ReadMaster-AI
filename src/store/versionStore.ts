import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Version {
  id: string;
  content: string;
  timestamp: number;
  description: string;
}

interface VersionState {
  versions: Version[];
  addVersion: (content: string, description: string) => void;
  revertToVersion: (id: string) => string;
  deleteVersion: (id: string) => void;
  clearVersions: () => void;
}

export const useVersionStore = create<VersionState>()(
  persist(
    (set, get) => ({
      versions: [],
      addVersion: (content: string, description: string) => {
        const newVersion: Version = {
          id: Date.now().toString(),
          content,
          timestamp: Date.now(),
          description,
        };
        set((state) => ({
          versions: [newVersion, ...state.versions].slice(0, 50), // Keep last 50 versions
        }));
      },
      revertToVersion: (id: string) => {
        const version = get().versions.find((v) => v.id === id);
        if (!version) return '';
        return version.content;
      },
      deleteVersion: (id: string) => {
        set((state) => ({
          versions: state.versions.filter((v) => v.id !== id),
        }));
      },
      clearVersions: () => set({ versions: [] }),
    }),
    {
      name: 'document-versions',
    }
  )
); 