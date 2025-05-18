import { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AIOutputProps {
  type: 'suggestions' | 'seo' | 'readability' | 'headlines';
  content: string;
}

export const AIOutput: FC<AIOutputProps> = ({ type, content }) => {
  // Clean markdown syntax from text
  const cleanMarkdown = (text: string) => {
    return text
      .replace(/^[#\s-*]+/gm, '') // Remove heading markers and list markers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markers
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Clean links
      .replace(/`(.*?)`/g, '$1') // Remove code markers
      .trim();
  };

  // Parse different types of outputs
  const parseContent = () => {
    switch (type) {
      case 'readability':
        const sections = content.split(/Section \d+:/).filter(Boolean);
        return (
          <div className="space-y-6">
            {sections.map((section, index) => {
              const [title, ...content] = section.split('\n').filter(Boolean);
              const sectionContent = content.join('\n').trim();
              
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-3">
                    {title.trim()}
                  </h3>
                  <div className="space-y-3">
                    {sectionContent.split('\n').map((line, i) => {
                      const [label, value] = line.split(':').map(s => s.trim());
                      if (line.startsWith('-')) {
                        // Handle bullet points
                        return (
                          <div key={i} className="flex items-start space-x-2 text-gray-700 dark:text-gray-300">
                            <span className="text-blue-500 mt-1">•</span>
                            <span className="flex-1">{line.replace('-', '').trim()}</span>
                          </div>
                        );
                      } else if (label && value) {
                        // Handle key-value pairs
                        return (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">{label}</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
                          </div>
                        );
                      } else {
                        // Handle regular text
                        return (
                          <p key={i} className="text-gray-700 dark:text-gray-300">
                            {line}
                          </p>
                        );
                      }
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'seo':
        const seoSections = content.split('\n\n').filter(Boolean);
        return (
          <div className="space-y-6">
            {seoSections.map((section, index) => {
              const [title, ...details] = section.split('\n');
              const cleanTitle = cleanMarkdown(title);
              const cleanDetails = details.map(detail => cleanMarkdown(detail));

              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">
                    {cleanTitle}
                  </h3>
                  <div className="space-y-2">
                    {cleanDetails.map((detail, i) => (
                      <div key={i} className="flex items-start space-x-2 text-gray-700 dark:text-gray-300">
                        <span className="text-green-500 mt-1">•</span>
                        <span className="flex-1">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'suggestions':
        const suggestions = content.split('\n').filter(line => line.trim().length > 0);
        return (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => {
              const cleanSuggestion = cleanMarkdown(suggestion);
              const isImprovement = cleanSuggestion.toLowerCase().includes('improve') || 
                                  cleanSuggestion.toLowerCase().includes('consider') ||
                                  cleanSuggestion.toLowerCase().includes('suggest');

              return (
                <div 
                  key={index} 
                  className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border ${
                    isImprovement 
                      ? 'border-blue-100 dark:border-blue-900' 
                      : 'border-gray-100 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-xl mt-1">
                      {isImprovement ? '💡' : '✨'}
                    </span>
                    <div className="flex-1">
                      <div className={`text-gray-800 dark:text-gray-200 leading-relaxed ${
                        isImprovement ? 'font-medium' : ''
                      }`}>
                        {cleanSuggestion}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'headlines':
        const headlines = content.split(/Headline Option \d+:/).filter(Boolean);
        return (
          <div className="space-y-6">
            {headlines.map((headline, index) => {
              const [catchy, seo, explanation] = headline
                .split('\n')
                .filter(line => line.trim())
                .map(line => line.replace(/^[-•]\s*(Catchy|SEO|Why it works):\s*/, '').trim());

              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Catchy Version</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{catchy}</div>
                    </div>
                    <div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">SEO Version</div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{seo}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Why it works</div>
                      <div className="text-gray-700 dark:text-gray-300">{explanation}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg overflow-hidden">
      {parseContent()}
    </div>
  );
}; 
