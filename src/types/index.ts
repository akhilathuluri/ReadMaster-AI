export interface EditorState {
  content: string;
  setContent: (content: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isPanelCollapsed: boolean;
  togglePanel: () => void;
  isAIPanelCollapsed: boolean;
  toggleAIPanel: () => void;
  currentTemplate: string | null;
  setCurrentTemplate: (template: string | null) => void;
  isLocked: boolean;
  toggleLock: () => void;
}

export interface AIResponse {
  suggestions: string[];
  error?: string;
}

export interface Template {
  id: string;
  name: string;
  content: string;
}

export interface AIOutputProps {
  type: 'suggestions' | 'seo' | 'readability' | 'headlines';
  content: string;
}

declare module '@emoji-mart/data' {
  const data: any;
  export default data;
}

declare module '@emoji-mart/react' {
  const Picker: React.FC<{
    data: any;
    onEmojiSelect: (emoji: any) => void;
    theme?: 'light' | 'dark';
    previewPosition?: 'none' | 'top' | 'bottom';
    skinTonePosition?: 'none' | 'top' | 'bottom';
    searchPosition?: 'none' | 'top' | 'bottom';
    navPosition?: 'none' | 'top' | 'bottom';
    perLine?: number;
    maxFrequentRows?: number;
  }>;
  export default Picker;
}