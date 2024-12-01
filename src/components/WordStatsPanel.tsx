import { FC } from 'react';
import { Hash, Type, Clock, Link2, Code } from 'lucide-react';
import { getWordStats } from '../utils/wordStats';

interface WordStatsPanelProps {
  content: string;
}

export const WordStatsPanel: FC<WordStatsPanelProps> = ({ content }) => {
  const stats = getWordStats(content);

  // Calculate max width for heading bars (max 100px)
  const maxHeadingCount = Math.max(...stats.headings.map(h => h.count));
  const getBarWidth = (count: number) => Math.min(100, (count / maxHeadingCount) * 100);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm space-y-6">
      {/* Basic Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-sm text-gray-500 dark:text-gray-400">Words</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {stats.words.toLocaleString()}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-gray-500 dark:text-gray-400">Characters</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {stats.characters.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <Type size={16} className="text-blue-500" />
            <span>Sentences</span>
          </div>
          <span className="font-medium">{stats.sentences}</span>
        </div>

        <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <Hash size={16} className="text-green-500" />
            <span>Paragraphs</span>
          </div>
          <span className="font-medium">{stats.paragraphs}</span>
        </div>

        <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-purple-500" />
            <span>Reading Time</span>
          </div>
          <span className="font-medium">{stats.readingTime}</span>
        </div>

        <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <Link2 size={16} className="text-orange-500" />
            <span>Links</span>
          </div>
          <span className="font-medium">{stats.links}</span>
        </div>

        <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <Code size={16} className="text-pink-500" />
            <span>Code Blocks</span>
          </div>
          <span className="font-medium">{stats.codeBlocks}</span>
        </div>
      </div>

      {/* Heading Distribution */}
      {stats.headings.length > 0 && (
        <div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Heading Distribution
          </div>
          <div className="space-y-2">
            {stats.headings.map(({ level, count }) => (
              <div key={level} className="relative">
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
                  <span className="font-medium">H{level}</span>
                  <span>{count}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${getBarWidth(count)}%`,
                      background: `linear-gradient(90deg, 
                        ${level === 1 ? '#3B82F6' : 
                          level === 2 ? '#10B981' : 
                          level === 3 ? '#8B5CF6' : 
                          level === 4 ? '#F59E0B' : 
                          level === 5 ? '#EF4444' : '#EC4899'}
                        , 
                        ${level === 1 ? '#60A5FA' : 
                          level === 2 ? '#34D399' : 
                          level === 3 ? '#A78BFA' : 
                          level === 4 ? '#FBBF24' : 
                          level === 5 ? '#F87171' : '#F472B6'}
                      )`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 