import { FC, useState, useRef, useEffect } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Smile } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import '../styles/emoji-mart.css';

export const EmojiPicker: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top?: string; bottom?: string; right?: string; left?: string }>({});
  const { content, setContent, isDarkMode } = useEditorStore();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current && isOpen) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const pickerHeight = 435; // Emoji picker height
        const pickerWidth = 352; // Emoji picker width

        let newPosition = {};

        // Vertical positioning
        if (buttonRect.bottom + pickerHeight > windowHeight) {
          // Position above if not enough space below
          newPosition = { bottom: `${window.innerHeight - buttonRect.top}px` };
        } else {
          // Position below
          newPosition = { top: `${buttonRect.bottom}px` };
        }

        // Horizontal positioning
        if (buttonRect.right + pickerWidth > windowWidth) {
          // Align to right if not enough space on the right
          newPosition = { ...newPosition, right: `${windowWidth - buttonRect.right}px` };
        } else {
          // Align to left
          newPosition = { ...newPosition, left: `${buttonRect.left}px` };
        }

        setPosition(newPosition);
      }
    };

    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen]);

  const handleEmojiSelect = (emoji: any) => {
    const textArea = document.querySelector('.cm-content') as HTMLTextAreaElement;
    if (textArea) {
      const start = textArea.selectionStart || 0;
      const end = textArea.selectionEnd || 0;
      const newContent = 
        content.substring(0, start) + 
        emoji.native + 
        content.substring(end);
      
      setContent(newContent);
      setIsOpen(false);
      
      textArea.focus();
      textArea.setSelectionRange(start + emoji.native.length, start + emoji.native.length);
    } else {
      setContent(content + emoji.native);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" data-theme={isDarkMode ? 'dark' : 'light'}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Insert Emoji"
      >
        <Smile size={20} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div 
            ref={pickerRef}
            className="fixed z-50"
            style={{
              ...position,
              margin: '8px 0',
            }}
          >
            <div className="emoji-mart-container">
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme={isDarkMode ? 'dark' : 'light'}
                previewPosition="none"
                skinTonePosition="none"
                searchPosition="top"
                navPosition="bottom"
                perLine={8}
                maxFrequentRows={1}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 