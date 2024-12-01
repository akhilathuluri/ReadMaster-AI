import { FC, useState, useEffect, useCallback, useRef } from 'react';
import { Timer, Pause, Play, RotateCcw, Settings as SettingsIcon } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

export const FocusTimer: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  });
  const [position, setPosition] = useState<{ top?: string; bottom?: string; right?: string; left?: string }>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(settings.workDuration * 60);
    setIsBreak(false);
  }, [settings.workDuration]);

  const startBreak = useCallback(() => {
    const isLongBreak = sessionCount % settings.sessionsUntilLongBreak === 0;
    const breakTime = isLongBreak ? settings.longBreakDuration : settings.breakDuration;
    setTimeLeft(breakTime * 60);
    setIsBreak(true);
  }, [sessionCount, settings]);

  const handleTimerComplete = useCallback(() => {
    if (isBreak) {
      setTimeLeft(settings.workDuration * 60);
      setIsBreak(false);
    } else {
      setSessionCount(prev => prev + 1);
      startBreak();
    }
    // Play notification sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {});
    // Show browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification(isBreak ? 'Break Over!' : 'Time for a Break!', {
        body: isBreak ? 'Ready to work?' : 'Good job! Take a break.',
        icon: '/favicon.ico'
      });
    }
  }, [isBreak, settings.workDuration, startBreak]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handleTimerComplete]);

  useEffect(() => {
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current && isOpen) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const popoverHeight = 400; // Approximate height of the popover
        const popoverWidth = 288; // w-72 = 18rem = 288px

        let newPosition = {};

        // Vertical positioning
        if (buttonRect.bottom + popoverHeight > windowHeight) {
          // Position above if not enough space below
          newPosition = { bottom: `${window.innerHeight - buttonRect.top}px` };
        } else {
          // Position below
          newPosition = { top: `${buttonRect.bottom}px` };
        }

        // Horizontal positioning
        if (buttonRect.right - popoverWidth < 0) {
          // Align to left edge if too far left
          newPosition = { ...newPosition, left: '0px' };
        } else if (buttonRect.right + popoverWidth > windowWidth) {
          // Align to right edge if too far right
          newPosition = { ...newPosition, right: '0px' };
        } else {
          // Center align with button
          newPosition = { ...newPosition, left: `${buttonRect.left - popoverWidth / 2}px` };
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

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Focus Timer"
      >
        <Timer size={20} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div 
            ref={popoverRef}
            className="fixed z-50 w-72"
            style={{
              ...position,
              margin: '8px 0',
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {isBreak ? 'Break Time' : 'Focus Time'}
                  </h3>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 my-4">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setIsRunning(!isRunning)}
                      className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
                    >
                      {isRunning ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <button
                      onClick={resetTimer}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <RotateCcw size={20} />
                    </button>
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      <SettingsIcon size={20} />
                    </button>
                  </div>
                </div>

                {showSettings && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400">Work Duration (minutes)</label>
                      <input
                        type="number"
                        value={settings.workDuration}
                        onChange={(e) => setSettings(prev => ({ ...prev, workDuration: Number(e.target.value) }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400">Break Duration (minutes)</label>
                      <input
                        type="number"
                        value={settings.breakDuration}
                        onChange={(e) => setSettings(prev => ({ ...prev, breakDuration: Number(e.target.value) }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400">Long Break Duration (minutes)</label>
                      <input
                        type="number"
                        value={settings.longBreakDuration}
                        onChange={(e) => setSettings(prev => ({ ...prev, longBreakDuration: Number(e.target.value) }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400">Sessions until Long Break</label>
                      <input
                        type="number"
                        value={settings.sessionsUntilLongBreak}
                        onChange={(e) => setSettings(prev => ({ ...prev, sessionsUntilLongBreak: Number(e.target.value) }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Session {sessionCount + 1} • {isBreak ? 'Break' : 'Focus'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 