import { FC, useState, useRef } from 'react';
import { Camera, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const ImageAnalyzer: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { content, setContent } = useEditorStore();

  const resetState = () => {
    setSelectedImage(null);
    setAnalysis('');
    setError('');
    setIsAnalyzing(false);
  };

  const analyzeImage = async (imageData: string) => {
    try {
      setError('');
      const settings = JSON.parse(localStorage.getItem('readmaster-settings') || '{}');
      const apiKey = settings.state?.apiKey;
      
      if (!apiKey) {
        throw new Error('Gemini API key not found');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const imageBase64 = imageData.split(',')[1];
      
      const prompt = `Analyze this image and provide a detailed markdown-formatted description. Include:
      1. Brief overview of what the image shows
      2. Key visual elements and their significance
      3. Technical details (if applicable)
      4. Suggested alt text for accessibility
      5. Any relevant context or additional notes

      Format the response in clean markdown with appropriate headings and sections.`;

      const result = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      if (!text) {
        throw new Error('Empty response from AI');
      }

      return text;
    } catch (error) {
      console.error('Image analysis error:', error);
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('Please configure your Gemini API key in settings');
        } else if (error.message.includes('PERMISSION_DENIED')) {
          throw new Error('Invalid API key. Please check your settings');
        } else if (error.message.includes('SAFETY')) {
          throw new Error('Content flagged for safety concerns. Please try a different image.');
        }
      }
      throw new Error('Failed to analyze image. Please try again');
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      if (file.size > 4 * 1024 * 1024) {
        setError('Image size should be less than 4MB');
        return;
      }

      setIsAnalyzing(true);
      setError('');
      setAnalysis('');
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        setSelectedImage(base64data);
        
        try {
          const analysisResult = await analyzeImage(base64data);
          setAnalysis(analysisResult);
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Error analyzing image');
          setSelectedImage(null);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.onerror = () => {
        setError('Error reading image file');
        setIsAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Error processing image file');
      setIsAnalyzing(false);
    }
  };

  const insertToEditor = () => {
    if (!analysis) return;
    setContent(content + '\n\n' + analysis + '\n');
    setIsOpen(false);
    resetState();
  };

  const handleClose = () => {
    setIsOpen(false);
    resetState();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Analyze Image"
      >
        <Camera size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Image Analysis
              </h3>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                  {error}
                </div>
              )}
              
              {!selectedImage ? (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <ImageIcon size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Upload an image for AI analysis
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Select Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="animate-spin mr-2" size={20} />
                      <span>Analyzing image...</span>
                    </div>
                  ) : (
                    analysis && (
                      <>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                          <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                            {analysis}
                          </pre>
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={insertToEditor}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Insert Analysis to Editor
                          </button>
                        </div>
                      </>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 
