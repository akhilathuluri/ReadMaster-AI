export const executeCode = async (code: string, language: string): Promise<string> => {
  if (language !== 'javascript') {
    throw new Error(`Only JavaScript is supported`);
  }
  return executeJavaScript(code);
};

const executeJavaScript = async (code: string): Promise<string> => {
  try {
    const output: string[] = [];
    
    // Create a safe execution context with common globals
    const contextObj = {
      console: {
        log: (...args: any[]) => output.push(args.join(' ')),
        error: (...args: any[]) => output.push(`Error: ${args.join(' ')}`),
      },
      // Add Math and other safe built-ins
      Math,
      Object,
      Array,
      String,
      Number,
      Boolean,
      Date,
      RegExp,
      JSON,
      // Block dangerous operations
      setTimeout: () => { throw new Error('setTimeout is not allowed'); },
      setInterval: () => { throw new Error('setInterval is not allowed'); },
      fetch: () => { throw new Error('fetch is not allowed'); },
    };

    // Clean the code string
    const cleanCode = code
      .replace(/^\s+|\s+$/g, '')
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, '  ');

    // Create and execute the function
    const fn = new Function(
      'context',
      `
        with (context) {
          try {
            ${cleanCode}
          } catch (error) {
            console.error(error.message);
          }
        }
      `
    );

    await fn(contextObj);
    return output.join('\n');
  } catch (error) {
    throw new Error(`Execution error: ${error.message}`);
  }
}; 