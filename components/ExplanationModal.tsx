
import React, { useState, useEffect } from 'react';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  textToExplain: string;
}

// A simple component to render basic markdown (paragraphs, lists, bold)
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const renderWithBold = (text: string) => {
    // Split by **bold** tags, keeping the delimiters
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // Split content into blocks by one or more empty lines
  const blocks = content.trim().split(/\n\s*\n/);

  return (
    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        // Check if all lines in the block are list items
        if (lines.length > 0 && lines.every(line => line.trim().startsWith('* ') || line.trim().startsWith('- '))) {
          return (
            <ul key={i} className="list-disc list-outside pl-5 space-y-1 mb-4">
              {lines.map((item, j) => (
                <li key={j} className="pl-2">{renderWithBold(item.replace(/^[-*]\s*/, ''))}</li>
              ))}
            </ul>
          );
        }
        // Otherwise, render as a paragraph
        return <p key={i} className="mb-4">{renderWithBold(block)}</p>;
      })}
    </div>
  );
};

const ExplanationModal: React.FC<ExplanationModalProps> = ({ isOpen, onClose, textToExplain }) => {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && textToExplain) {
      const getExplanation = async () => {
        setIsLoading(true);
        setError('');
        setExplanation('');

        try {
          // Dynamically import the module ONLY when needed.
          // This uses the import map alias and solves the Vite "Failed to resolve import" error.
          const { GoogleGenAI } = await import('@google/genai');

          // This try...catch block is crucial. It prevents a ReferenceError
          // if `process` is not defined in a browser environment, which would
          // otherwise crash the entire application.
          let apiKey;
          try {
            apiKey = process.env.API_KEY;
          } catch (e) {
             throw new Error("API key is not configured.");
          }

          if (!apiKey) {
            throw new Error("API key is not configured.");
          }
          
          const ai = new GoogleGenAI({ apiKey });

          const prompt = `Explain the following concept in simple terms for a beginner. Use bullet points (using * or -) for lists and bold text (using **text**) for key terms. Keep it concise and clear.\n\nConcept: "${textToExplain}"`;
          
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });

          setExplanation(response.text);

        } catch (err) {
          console.error("Error fetching explanation:", err);
          const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred.';
           if (errorMessage.includes("API key is not configured")) {
               setError('Sorry, I couldn\'t get an explanation. The AI service has not been configured correctly by the developer.');
           } else {
               setError('Sorry, I couldn\'t get an explanation at this time. The AI service may be temporarily unavailable.');
           }
        } finally {
          setIsLoading(false);
        }
      };
      getExplanation();
    }
  }, [isOpen, textToExplain]);

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="explanation-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col opacity-0 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
          <h2 id="explanation-title" className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Simplified Explanation
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-red-600 transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="p-6 overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-slate-500 py-8">
              <svg className="animate-spin h-8 w-8 text-sky-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="font-semibold">Generating explanation...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}
          {explanation && (
            <MarkdownRenderer content={explanation} />
          )}
        </div>
        <footer className="p-3 bg-slate-50 border-t border-slate-200 text-right flex-shrink-0">
            <p className="text-xs text-slate-400">Powered by Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default ExplanationModal;
