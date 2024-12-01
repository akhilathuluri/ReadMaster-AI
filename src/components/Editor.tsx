import { FC, useRef, useEffect, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';
import { createTheme } from '@uiw/codemirror-themes';
import { useEditorStore } from '../store/editorStore';
import { useVersionManager } from '../hooks/useVersionManager';
import { Lock } from 'lucide-react';

const lightTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#ffffff',
    foreground: '#24292f',
    selection: '#b3d7ff',
    selectionMatch: '#b3d7ff',
    gutterBackground: '#ffffff',
    gutterForeground: '#6e7781',
  },
  styles: [
    { tag: t.heading, color: '#0550ae', fontWeight: 'bold' },
    { tag: t.quote, color: '#24292f', fontStyle: 'italic' },
    { tag: t.link, color: '#0969da' },
    { tag: t.url, color: '#0969da', textDecoration: 'underline' },
    { tag: t.emphasis, fontStyle: 'italic', color: '#24292f' },
    { tag: t.strong, fontWeight: 'bold', color: '#24292f' },
    { tag: t.strikethrough, textDecoration: 'line-through' },
  ],
});

const darkTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#0d1117',
    foreground: '#c9d1d9',
    selection: '#1c2128',
    selectionMatch: '#1c2128',
    gutterBackground: '#0d1117',
    gutterForeground: '#484f58',
  },
  styles: [
    { tag: t.heading, color: '#58a6ff', fontWeight: 'bold' },
    { tag: t.quote, color: '#c9d1d9', fontStyle: 'italic' },
    { tag: t.link, color: '#58a6ff' },
    { tag: t.url, color: '#58a6ff', textDecoration: 'underline' },
    { tag: t.emphasis, fontStyle: 'italic', color: '#c9d1d9' },
    { tag: t.strong, fontWeight: 'bold', color: '#c9d1d9' },
    { tag: t.strikethrough, textDecoration: 'line-through' },
  ],
});

// Updated scrollbar styles with better visibility
const scrollbarStyles = EditorView.theme({
  "&": {
    height: "100%",
  },
  ".cm-scroller": {
    fontFamily: "inherit",
    lineHeight: "1.5",
    overflow: "auto",
    scrollBehavior: "smooth",
    paddingTop: "16px",
    paddingBottom: "16px",
    "&::-webkit-scrollbar": {
      width: "12px",
      height: "12px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
      border: "solid 3px transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(155, 155, 155, 0.5)",
      borderRadius: "20px",
      border: "solid 3px transparent",
      backgroundClip: "padding-box",
      "&:hover": {
        background: "rgba(155, 155, 155, 0.7)",
      }
    },
    "&:hover::-webkit-scrollbar-thumb": {
      background: "rgba(155, 155, 155, 0.7)",
    },
  },
  ".cm-content": {
    minHeight: "100%",
    padding: "0 16px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-line": {
    padding: "0.2rem 0",
  },
});

export const Editor: FC = () => {
  const { content, setContent, isDarkMode, isLocked } = useEditorStore();
  const editorRef = useRef<HTMLDivElement>(null);
  const { saveVersion } = useVersionManager();
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef(0);

  // Setup editor extensions with updated theme
  const extensions = [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    EditorView.lineWrapping,
    scrollbarStyles,
    EditorView.theme({
      "&": {
        height: "100%",
      },
      ".cm-content": {
        padding: "1rem",
        maxWidth: "900px",
        margin: "0 auto",
      },
      ".cm-scroller": {
        overflow: "overlay", // Better scrollbar behavior
      },
      ".cm-line": {
        padding: "0.2rem 0",
      },
      ".cm-activeLineGutter": {
        backgroundColor: isDarkMode ? "#1f2937" : "#f3f4f6",
      },
      ".cm-activeLine": {
        backgroundColor: isDarkMode ? "#1f293730" : "#f3f4f610",
      },
    }),
    EditorView.editable.of(!isLocked),
  ];

  // Updated scroll handler
  const handleScroll = useCallback((event: Event) => {
    const editor = event.target as HTMLElement;
    const indicator = scrollIndicatorRef.current?.firstElementChild as HTMLElement;
    if (!editor || !indicator) return;

    const { scrollTop, scrollHeight, clientHeight } = editor;
    
    // Only show scroll indicator if content is scrollable
    if (scrollHeight <= clientHeight) {
      indicator.style.display = 'none';
      return;
    }

    // Calculate scroll position and indicator size
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight));
    const indicatorHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 32);
    const indicatorTop = scrollPercentage * (clientHeight - indicatorHeight);

    // Update indicator
    indicator.style.display = 'block';
    indicator.style.height = `${indicatorHeight}px`;
    indicator.style.transform = `translateY(${indicatorTop}px)`;
  }, []);

  // Initialize scroll handling with ResizeObserver
  useEffect(() => {
    const editor = editorRef.current?.querySelector('.cm-scroller');
    if (!editor) return;

    // Handle initial scroll state
    handleScroll({ target: editor } as Event);

    // Watch for content size changes
    const resizeObserver = new ResizeObserver(() => {
      handleScroll({ target: editor } as Event);
    });

    resizeObserver.observe(editor);
    editor.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      editor.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Restore scroll position after content changes
  useEffect(() => {
    const editor = editorRef.current?.querySelector('.cm-scroller');
    if (editor) {
      editor.scrollTop = lastScrollPosition.current;
    }
  }, [content]);

  // Handle editor initialization
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.querySelector('.cm-editor');
      if (editor) {
        editor.setAttribute('spellcheck', 'true');
      }
    }
  }, []);

  const handleChange = useCallback((value: string) => {
    setContent(value);
  }, [setContent]);

  // Save version on significant changes
  const handleSave = useCallback(() => {
    saveVersion('Manual save');
  }, [saveVersion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  return (
    <div className="relative h-full group scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent" ref={editorRef}>
      <CodeMirror
        value={content}
        onChange={handleChange}
        extensions={extensions}
        theme={isDarkMode ? darkTheme : lightTheme}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightSelectionMatches: true,
          readOnly: isLocked,
        }}
        className="h-full overflow-auto"
      />
      
      {isLocked && (
        <div className="absolute inset-0 bg-gray-900/5 dark:bg-gray-900/20 pointer-events-none flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center space-x-2">
            <Lock className="text-blue-600 dark:text-blue-400" size={20} />
            <span className="text-gray-600 dark:text-gray-300">
              Document is locked
            </span>
          </div>
        </div>
      )}
      
      {/* Updated scroll indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute right-0 top-0 bottom-0 w-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ pointerEvents: 'none' }}
      >
        <div 
          className="absolute right-0 w-1.5 bg-gray-200 dark:bg-gray-700 rounded-full transition-all duration-150"
          style={{ 
            minHeight: '32px',
            opacity: '0',
          }} 
        />
      </div>
    </div>
  );
};