import { FC } from 'react';
import { Link } from 'react-router-dom';
import { 
  List, 
  Wand, 
  FileText, 
  Code2, 
  BookOpen, 
  Cloud, 
  Link2, 
  Smile, 
  Timer, 
  History, 
  Lock,
  Bot,
  Search,
  BarChart,
  BookCheck,
  Type,
  Sparkles,
  Github,
  Camera,
} from 'lucide-react';

export const LandingPage: FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">ReadMaster AI</span>
              <span className="block text-blue-600 dark:text-blue-400">Intelligent Markdown Editor</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              The next-generation markdown editor powered by AI, designed for developers, technical writers, and documentation experts.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/editor"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Start Writing
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a
                  href="https://github.com/yourusername/readmaster"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10"
                >
                  <Github className="mr-2" size={20} /> View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Powerful Features
            </h2>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
              Everything you need for professional documentation
            </p>
          </div>

          {/* Core Features */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Most Used Tools
            </h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<List />}
                title="Auto Table of Contents"
                description="Automatically generate and update table of contents for your documents"
              />
              <FeatureCard
                icon={<Wand />}
                title="Smart Formatting"
                description="Intelligent text formatting with a single click"
              />
              <FeatureCard
                icon={<FileText />}
                title="Metadata Editor"
                description="Edit document metadata with an intuitive interface"
              />
              <FeatureCard
                icon={<Code2 />}
                title="Code Execution"
                description="Execute JavaScript code blocks directly in the editor"
              />
              <FeatureCard
                icon={<BookOpen />}
                title="Snippets Library"
                description="Quick access to common markdown patterns and templates"
              />
              <FeatureCard
                icon={<Cloud />}
                title="Word Cloud"
                description="Visualize most used terms in your document"
              />
              <FeatureCard
                icon={<Link2 />}
                title="Quick References"
                description="Easy access to helpful markdown resources"
              />
              <FeatureCard
                icon={<Smile />}
                title="Emoji Picker"
                description="Insert emojis with an intuitive picker interface"
              />
              <FeatureCard
                icon={<Timer />}
                title="Focus Timer"
                description="Stay productive with built-in focus timer"
              />
              <FeatureCard
                icon={<History />}
                title="Version History"
                description="Track and restore previous versions of your document"
              />
              <FeatureCard
                icon={<Lock />}
                title="Document Locking"
                description="Prevent accidental changes to your content"
              />
              <FeatureCard
                icon={<BarChart />}
                title="Word Statistics"
                description="Track document metrics and reading time"
              />
            </div>
          </div>

          {/* AI Features */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              AI-Powered Features
            </h3>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Sparkles />}
                title="Smart Suggestions"
                description="Get AI-powered suggestions for improving your content"
                isAI
              />
              <FeatureCard
                icon={<Bot />}
                title="AI Chat Query"
                description="Ask questions about your markdown content"
                isAI
              />
              <FeatureCard
                icon={<Search />}
                title="SEO Analysis"
                description="Analyze and optimize content for search engines"
                isAI
              />
              <FeatureCard
                icon={<BookCheck />}
                title="Readability Check"
                description="Get readability scores and improvement suggestions"
                isAI
              />
              <FeatureCard
                icon={<Type />}
                title="Headline Generator"
                description="Generate engaging headlines for your content"
                isAI
              />
              <FeatureCard
                icon={<Camera />}
                title="Image Analysis"
                description="Get AI-powered descriptions and insights from your images for better documentation"
                isAI
              />
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 dark:bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Start writing now.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Experience the future of markdown editing with AI-powered features.
          </p>
          <Link
            to="/editor"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Try ReadMaster AI
          </Link>
        </div>
      </div>

      {/* Credits Footer */}
      <footer className="bg-white dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-500 dark:text-gray-400">
              Built and crafted with ❤️ by{' '}
              <a 
                href="https://github.com/athulurakhil" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Athuluri Akhil
              </a>
            </p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              © {new Date().getFullYear()} ReadMaster AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isAI?: boolean;
}

const FeatureCard: FC<FeatureCardProps> = ({ icon, title, description, isAI }) => (
  <div className="relative group">
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md ${
          isAI ? 'bg-purple-500 dark:bg-purple-600' : 'bg-blue-500 dark:bg-blue-600'
        } text-white`}>
          {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {isAI && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            AI Powered
          </span>
        </div>
      )}
    </div>
  </div>
);