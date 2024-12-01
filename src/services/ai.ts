import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIResponse } from '../types';
import { useSettingsStore } from '../store/settingsStore';

export async function getContentSuggestions(content: string): Promise<AIResponse> {
  const apiKey = useSettingsStore.getState().apiKey;
  
  if (!apiKey) {
    return {
      suggestions: [],
      error: 'Please set your Google Gemini API key in settings',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Analyze this markdown content and suggest improvements for clarity and style:\n\n${content}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { suggestions: [response.text()] };
  } catch (error) {
    return { suggestions: [], error: 'Failed to get AI suggestions' };
  }
}

export async function analyzeSEO(content: string): Promise<AIResponse> {
  const apiKey = useSettingsStore.getState().apiKey;
  
  if (!apiKey) {
    return {
      suggestions: [],
      error: 'Please set your Google Gemini API key in settings',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Analyze this content for SEO optimization and provide recommendations:\n\n${content}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { suggestions: [response.text()] };
  } catch (error) {
    return { suggestions: [], error: 'Failed to analyze SEO' };
  }
}

export async function analyzeReadability(content: string): Promise<AIResponse> {
  const apiKey = useSettingsStore.getState().apiKey;
  
  if (!apiKey) {
    return {
      suggestions: [],
      error: 'Please set your Google Gemini API key in settings',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Analyze this text and provide a detailed readability report. Format your response exactly as follows:

    Section 1: Readability Scores
    - Flesch Reading Ease: [score]
    - Grade Level: [level]
    - Average Reading Time: [time]

    Section 2: Text Statistics
    - Total Words: [count]
    - Average Word Length: [length]
    - Average Sentence Length: [length]
    - Complex Word Percentage: [percentage]
    - Paragraph Count: [count]

    Section 3: Readability Analysis
    [Provide 3-4 bullet points analyzing the text's readability]

    Section 4: Improvement Suggestions
    [Provide 3-4 specific suggestions to improve readability]

    Section 5: Target Audience
    [Describe the appropriate audience level and why]

    Text to analyze:
    ${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { suggestions: [response.text()] };
  } catch (error) {
    return { suggestions: [], error: 'Failed to analyze readability' };
  }
}

export async function generateHeadlines(content: string): Promise<AIResponse> {
  const apiKey = useSettingsStore.getState().apiKey;
  
  if (!apiKey) {
    return {
      suggestions: [],
      error: 'Please set your Google Gemini API key in settings',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `As a professional headline writer, analyze this content and generate 5 different headline options. 
    For each headline, provide:
    1. A catchy, attention-grabbing version
    2. A professional, SEO-friendly version
    3. A brief explanation of why it works

    Consider:
    - Key message and main topic
    - Target audience
    - SEO optimization
    - Emotional appeal
    - Length (keep under 60 characters)

    Content to analyze:
    ${content}

    Format each suggestion as:
    Headline Option #:
    - Catchy: [Headline]
    - SEO: [Headline]
    - Why it works: [Brief explanation]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { suggestions: [response.text()] };
  } catch (error) {
    return { suggestions: [], error: 'Failed to generate headlines' };
  }
}

export async function getMarkdownHelp(query: string): Promise<AIResponse> {
  const apiKey = useSettingsStore.getState().apiKey;
  
  if (!apiKey) {
    return {
      suggestions: [],
      error: 'Please set your Google Gemini API key in settings',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `As a Markdown expert, please answer this question about Markdown:

    Question: ${query}

    Please provide:
    1. A clear, concise explanation
    2. Practical examples with Markdown syntax
    3. Best practices and common pitfalls
    4. Any relevant tips or alternatives

    Format the response to be easy to read and implement.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { suggestions: [response.text()] };
  } catch (error) {
    return { suggestions: [], error: 'Failed to get Markdown help' };
  }
}