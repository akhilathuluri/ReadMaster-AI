import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from local storage with correct path
function getGeminiApiKey(): string {
  try {
    const settings = JSON.parse(localStorage.getItem('readmaster-settings') || '{}');
    return settings.state?.apiKey || '';
  } catch (error) {
    console.error('Error reading API key from settings:', error);
    return '';
  }
}

// Initialize Gemini AI with dynamic API key
function getGeminiModel() {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not found in settings');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

export type SuggestionType = 'structure' | 'heading' | 'section' | 'content' | 'style' | 'clarity';

interface Section {
  level: number;
  title: string;
  content: string;
  lineNumber: number;
}

export async function analyzeWithAI(content: string) {
  const suggestions = [];
  
  try {
    const model = getGeminiModel();
    const prompt = `Analyze this markdown document and provide specific suggestions for improvement. Focus on:
    1. Document structure and organization
    2. Clarity and readability
    3. Section balance and flow
    4. Writing style and tone
    5. Technical accuracy
    
    For each suggestion, provide:
    - A specific issue
    - Why it's important
    - How to fix it
    - An example improvement if applicable
    
    Document content:
    ${content}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    });

    if (!result.response) {
      throw new Error('No response from AI model');
    }

    const analysis = result.response.text();
    if (!analysis) {
      throw new Error('Empty response from AI model');
    }

    // Parse AI suggestions
    const aiSuggestions = parseAISuggestions(analysis, content);
    if (aiSuggestions.length === 0) {
      suggestions.push({
        id: 'no-suggestions',
        type: 'content',
        message: 'No specific suggestions were generated. Your document might be well-structured already.',
        improvement: undefined
      });
    } else {
      suggestions.push(...aiSuggestions);
    }

  } catch (error) {
    console.error('AI analysis error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key not found')) {
        suggestions.push({
          id: 'api-key-missing',
          type: 'content',
          message: 'Gemini API key not configured. Please add your API key in Settings to enable AI-powered suggestions.',
          improvement: undefined
        });
      } else if (error.message.includes('PERMISSION_DENIED')) {
        suggestions.push({
          id: 'api-key-invalid',
          type: 'content',
          message: 'The provided API key appears to be invalid. Please check your API key in Settings.',
          improvement: undefined
        });
      } else {
        suggestions.push({
          id: 'ai-error',
          type: 'content',
          message: `AI Analysis Error: ${error.message}. Please try again later.`,
          improvement: undefined
        });
      }
    } else {
      suggestions.push({
        id: 'ai-error',
        type: 'content',
        message: 'An unexpected error occurred while analyzing the content. Please try again later.',
        improvement: undefined
      });
    }
  }

  return suggestions;
}

function parseAISuggestions(analysis: string, content: string) {
  const suggestions = [];
  
  try {
    // Split analysis into individual suggestions
    const parts = analysis.split(/\d+\.\s+/).filter(Boolean);
    
    parts.forEach((part, index) => {
      const lines = part.trim().split('\n').filter(Boolean);
      if (lines.length >= 2) {
        const issue = lines[0];
        const explanation = lines.slice(1).join('\n');
        
        // Extract improvement if it exists (usually after "Example:" or "Fix:")
        const improvementMatch = explanation.match(/(?:Example|Fix|Suggestion):\s*(.+?)(?=\n|$)/s);
        const improvement = improvementMatch ? improvementMatch[1].trim() : undefined;

        suggestions.push({
          id: `ai-suggestion-${index}`,
          type: determineType(issue),
          message: `${issue}\n\n${explanation}`,
          improvement,
          lineNumber: findRelevantLineNumber(issue, content),
        });
      }
    });
  } catch (error) {
    console.error('Error parsing AI suggestions:', error);
  }

  return suggestions;
}

function determineType(issue: string): SuggestionType {
  const issue_lower = issue.toLowerCase();
  if (issue_lower.includes('structure') || issue_lower.includes('organization')) {
    return 'structure';
  }
  if (issue_lower.includes('heading') || issue_lower.includes('title')) {
    return 'heading';
  }
  if (issue_lower.includes('section') || issue_lower.includes('paragraph')) {
    return 'section';
  }
  if (issue_lower.includes('clarity') || issue_lower.includes('readability')) {
    return 'clarity';
  }
  if (issue_lower.includes('style') || issue_lower.includes('tone')) {
    return 'style';
  }
  return 'content';
}

function findRelevantLineNumber(issue: string, content: string): number | undefined {
  // Try to find a line number based on quoted text or section names
  const quotedText = issue.match(/"([^"]+)"/);
  if (quotedText) {
    const lines = content.split('\n');
    const lineIndex = lines.findIndex(line => line.includes(quotedText[1]));
    if (lineIndex !== -1) {
      return lineIndex;
    }
  }
  return undefined;
}

export function analyzeStructure(content: string) {
  const suggestions = [];
  const lines = content.split('\n');
  const headings = lines
    .map((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      return match ? { level: match[1].length, title: match[2], lineNumber: index } : null;
    })
    .filter(Boolean);

  // Check heading hierarchy
  let expectedLevel = 1;
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    if (heading && heading.level > expectedLevel + 1) {
      suggestions.push({
        id: `heading-hierarchy-${i}`,
        type: 'heading',
        message: `Heading level skipped from H${expectedLevel} to H${heading.level}`,
        lineNumber: heading.lineNumber,
        improvement: `${'#'.repeat(expectedLevel)} ${heading.title}`
      });
    }
    expectedLevel = heading?.level || expectedLevel;
  }

  // Check document structure
  const hasIntroduction = content.toLowerCase().includes('introduction') ||
                         content.toLowerCase().includes('overview');
  const hasConclusion = content.toLowerCase().includes('conclusion') ||
                       content.toLowerCase().includes('summary');

  if (!hasIntroduction) {
    suggestions.push({
      id: 'missing-introduction',
      type: 'structure',
      message: 'Document might benefit from an introduction section',
      improvement: '## Introduction\nAdd an introduction to provide context for your document.'
    });
  }

  if (!hasConclusion) {
    suggestions.push({
      id: 'missing-conclusion',
      type: 'structure',
      message: 'Document might benefit from a conclusion section',
      improvement: '## Conclusion\nSummarize the key points discussed in your document.'
    });
  }

  return suggestions;
}

export function analyzeSections(content: string) {
  const suggestions = [];
  const sections: Section[] = [];
  const lines = content.split('\n');
  let currentSection: Section | null = null;

  // Parse sections
  lines.forEach((line, index) => {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        level: headingMatch[1].length,
        title: headingMatch[2],
        content: '',
        lineNumber: index
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  // Analyze section content
  sections.forEach((section, index) => {
    const wordCount = section.content.split(/\s+/).length;
    
    // Check section length
    if (wordCount < 30 && section.level <= 2) {
      suggestions.push({
        id: `short-section-${index}`,
        type: 'section',
        message: `Section "${section.title}" seems too brief (${wordCount} words)`,
        lineNumber: section.lineNumber,
      });
    }

    // Check content balance
    if (index > 0 && wordCount > sections[index - 1].content.split(/\s+/).length * 3) {
      suggestions.push({
        id: `unbalanced-section-${index}`,
        type: 'section',
        message: `Section "${section.title}" is significantly longer than previous sections`,
        lineNumber: section.lineNumber,
      });
    }
  });

  return suggestions;
} 
