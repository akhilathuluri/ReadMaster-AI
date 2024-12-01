import { FC } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Bot, Layout, Moon, Download, FileDown, 
  List, Wand, Timer, History, Search, Smile, Scale,
  BookOpen, Sparkles, BarChart, FileCheck, Palette,
  Table, Type, Clock, Hash
} from 'lucide-react';

export const LandingPage: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              ReadMaster <span className="text-blue-600">AI</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              The intelligent Markdown editor powered by AI, designed for modern documentation and note-taking.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Link
                to="/editor"
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Start Writing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-12">
          Powerful Features
        </h2>

        {/* AI Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">AI-Powered Features</h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<Bot className="text-blue-600" size={24} />}
              title="AI Assistant"
              description="Get intelligent suggestions and content improvements"
            />
            <Feature
              icon={<BookOpen className="text-indigo-600" size={24} />}
              title="Readability Analysis"
              description="AI-powered readability scoring and suggestions"
            />
            <Feature
              icon={<Sparkles className="text-purple-600" size={24} />}
              title="SEO Optimization"
              description="Smart SEO analysis and improvement tips"
            />
            <Feature
              icon={<Type className="text-pink-600" size={24} />}
              title="Headline Generator"
              description="Generate catchy and SEO-friendly headlines"
            />
            <Feature
              icon={<Search className="text-violet-600" size={24} />}
              title="Smart Query"
              description="Ask questions about Markdown with AI answers"
            />
            <Feature
              icon={<Wand className="text-rose-600" size={24} />}
              title="Smart Formatting"
              description="AI-powered content formatting suggestions"
            />
          </div>
        </div>

        {/* Editor Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Editor Features</h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<Layout className="text-green-600" size={24} />}
              title="Split View"
              description="Real-time preview with synchronized scrolling"
            />
            <Feature
              icon={<Moon className="text-yellow-600" size={24} />}
              title="Dark Mode"
              description="Comfortable writing in light or dark theme"
            />
            <Feature
              icon={<Palette className="text-orange-600" size={24} />}
              title="Syntax Highlighting"
              description="Beautiful code and content highlighting"
            />
            <Feature
              icon={<Table className="text-teal-600" size={24} />}
              title="Auto TOC"
              description="Automatic table of contents generation"
            />
            <Feature
              icon={<FileText className="text-cyan-600" size={24} />}
              title="Templates"
              description="Ready-to-use document templates"
            />
            <Feature
              icon={<Smile className="text-amber-600" size={24} />}
              title="Emoji Picker"
              description="Quick emoji insertion support"
            />
          </div>
        </div>

        {/* Productivity Features */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Productivity Tools</h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<Timer className="text-red-600" size={24} />}
              title="Focus Timer"
              description="Built-in Pomodoro timer for productivity"
            />
            <Feature
              icon={<History className="text-emerald-600" size={24} />}
              title="Version Control"
              description="Document history and version management"
            />
            <Feature
              icon={<Clock className="text-blue-600" size={24} />}
              title="Auto-Save"
              description="Automatic document saving and backup"
            />
            <Feature
              icon={<BarChart className="text-indigo-600" size={24} />}
              title="Word Statistics"
              description="Word count and reading time estimates"
            />
            <Feature
              icon={<Hash className="text-purple-600" size={24} />}
              title="Smart TOC"
              description="Intelligent heading organization"
            />
            <Feature
              icon={<FileCheck className="text-pink-600" size={24} />}
              title="File Management"
              description="Efficient document organization"
            />
          </div>
        </div>

        {/* Export Features */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Export Options</h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              icon={<FileDown className="text-violet-600" size={24} />}
              title="Rich PDF Export"
              description="Beautifully formatted PDF documents"
            />
            <Feature
              icon={<Download className="text-rose-600" size={24} />}
              title="Markdown Export"
              description="Clean Markdown file export"
            />
            <Feature
              icon={<Scale className="text-teal-600" size={24} />}
              title="File Size Display"
              description="Real-time file size estimation"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>ReadMaster AI - Powered by Google Gemini</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <p className="text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}; 