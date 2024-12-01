import { FC, useEffect, useRef, useState } from 'react';
import { Cloud, CloudIcon, X } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

interface WordData {
  text: string;
  size: number;
  color: string;
}

export const WordCloud: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { content, isDarkMode } = useEditorStore();
  const [words, setWords] = useState<WordData[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const processText = (text: string) => {
    // Remove markdown syntax and common words
    const cleanText = text
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Clean links
      .replace(/[#*`_~\[\](){}|]/g, '') // Remove markdown symbols
      .toLowerCase();

    const commonWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
    ]);

    // Count word frequencies
    const wordCount = cleanText.split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word))
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Convert to array and sort by frequency
    const sortedWords = Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 100); // Take top 100 words

    // Generate color palette
    const colors = isDarkMode
      ? ['#60A5FA', '#34D399', '#A78BFA', '#F472B6', '#FBBF24']
      : ['#2563EB', '#059669', '#7C3AED', '#DB2777', '#D97706'];

    // Create word data with sizes and colors
    const maxFreq = Math.max(...sortedWords.map(([, freq]) => freq));
    return sortedWords.map(([text, freq], i) => ({
      text,
      size: 10 + (freq / maxFreq) * 50, // Scale sizes between 10 and 60
      color: colors[i % colors.length],
    }));
  };

  const generateWordCloud = () => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 400;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create layout
    const layout = cloud()
      .size([width, height])
      .words(words.map(d => ({ ...d, text: d.text })))
      .padding(5)
      .rotate(() => 0)
      .font('Inter')
      .fontSize(d => (d as WordData).size)
      .on('end', draw);

    layout.start();

    function draw(words: any[]) {
      d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', 'Inter')
        .style('fill', d => (d as WordData).color)
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .text(d => d.text);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const processedWords = processText(content);
      setWords(processedWords);
    }
  }, [content, isOpen, isDarkMode]);

  useEffect(() => {
    if (words.length > 0) {
      generateWordCloud();
    }
  }, [words]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Word Cloud"
      >
        <Cloud size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Document Word Cloud
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex justify-center">
                <svg
                  ref={svgRef}
                  className="max-w-full h-auto"
                  style={{ minHeight: '400px' }}
                />
              </div>

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                Showing the most frequently used words in your document
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 