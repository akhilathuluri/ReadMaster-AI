import katex from 'katex';
import 'katex/dist/katex.min.css';

export const renderMath = (expression: string, displayMode: boolean = false): string => {
  try {
    return katex.renderToString(expression, {
      displayMode,
      throwOnError: false,
      output: 'html',
      strict: false
    });
  } catch (error) {
    console.error('Math rendering error:', error);
    return expression;
  }
};

export const processMathInText = (text: string): string => {
  // Handle inline math: $expression$
  text = text.replace(/\$([^\$]+)\$/g, (match, expr) => {
    return renderMath(expr, false);
  });

  // Handle display math: $$expression$$
  text = text.replace(/\$\$([^\$]+)\$\$/g, (match, expr) => {
    return renderMath(expr, true);
  });

  return text;
}; 