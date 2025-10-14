import React, { useState, useEffect } from 'react';
import { ContentType } from '../types';
import type { ContentBlock, HighlightColor, ColoredText, ListItem } from '../types';

// --- START: Rendering Logic (from ContentDisplay.tsx for preview) ---
const inlineColorMap: Record<HighlightColor, { bg: string; text: string }> = {
    green: { bg: 'bg-green-300/80', text: 'text-green-900' },
    fuchsia: { bg: 'bg-fuchsia-300/80', text: 'text-fuchsia-900' },
    yellow: { bg: 'bg-yellow-300/80', text: 'text-yellow-900' },
    red: { bg: 'bg-red-300/80', text: 'text-red-900' },
    purple: { bg: 'bg-purple-300/80', text: 'text-purple-900' },
    blue: { bg: 'bg-blue-300/80', text: 'text-blue-900' },
    cyan: { bg: 'bg-cyan-300/80', text: 'text-cyan-900' },
    indigo: { bg: 'bg-indigo-300/80', text: 'text-indigo-900' },
};

const highlightBlockMap: Record<HighlightColor, { border: string; bg: string; text: string }> = {
    green: { border: 'border-green-500', bg: 'bg-green-50/50', text: 'text-green-800' },
    fuchsia: { border: 'border-fuchsia-500', bg: 'bg-fuchsia-50/50', text: 'text-fuchsia-800' },
    yellow: { border: 'border-yellow-500', bg: 'bg-yellow-50/50', text: 'text-yellow-800' },
    red: { border: 'border-red-500', bg: 'bg-red-50/50', text: 'text-red-800' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-50/50', text: 'text-purple-800' },
    blue: { border: 'border-blue-500', bg: 'bg-blue-50/50', text: 'text-blue-800' },
    cyan: { border: 'border-cyan-500', bg: 'bg-cyan-50/50', text: 'text-cyan-800' },
    indigo: { border: 'border-indigo-500', bg: 'bg-indigo-50/50', text: 'text-indigo-800' },
};

const ColoredTextSpan: React.FC<{ part: string | ColoredText }> = ({ part }) => {
    if (typeof part === 'string') {
        return <span>{part}</span>;
    }
    const colorClasses = inlineColorMap[part.color];
    return (
        <span className={`${colorClasses.bg} ${colorClasses.text} font-semibold px-1.5 py-0.5 rounded-md`}>
            {part.text}
        </span>
    );
};

const renderPreviewBlock = (block: ContentBlock, index: number) => {
  switch (block.type) {
    case ContentType.HEADING2:
      return (
        <h2 key={index} className="text-xl font-bold mt-4 mb-2 pb-1 border-b border-slate-200 text-slate-800">{block.text}</h2>
      );
    case ContentType.HEADING3:
      return (
        <h3 key={index} className="text-lg font-semibold mt-3 mb-1 text-slate-700">{block.text}</h3>
      );
    case ContentType.PARAGRAPH:
      return (
        <p key={index} className="text-slate-600 leading-relaxed mb-3 text-sm">{block.text}</p>
      );
    case ContentType.LIST:
      return (
        <ul key={index} className="space-y-1 mb-3 list-disc list-outside pl-5 marker:text-sky-500 text-sm">
          {block.items?.map((item, i) => {
             // Simplified for preview
            const text = (typeof item === 'string') ? item : (item as any).text || JSON.stringify(item);
            return <li key={i} className="text-slate-600 pl-1">{text}</li>
          })}
        </ul>
      );
    case ContentType.ORDERED_LIST:
        return (
          <ol key={index} className="space-y-1 mb-3 list-decimal list-outside pl-5 marker:text-sky-600 text-sm">
            {block.items?.map((item, i) => {
              const text = (typeof item === 'string') ? item : (item as any).text || JSON.stringify(item);
              return <li key={i} className="text-slate-600 pl-1">{text}</li>
            })}
          </ol>
        );
    case ContentType.HIGHLIGHT:
      const color = block.color || 'blue';
      const classes = highlightBlockMap[color];
      return (
        <div key={index} className={`${classes.bg} border-l-4 ${classes.border} p-3 my-4 rounded-md`}>
          <p className={`${classes.text} leading-5 font-medium text-sm`}>{block.text}</p>
        </div>
      );
    case ContentType.COLORED_PARAGRAPH:
      return (
        <p key={index} className="text-slate-600 leading-relaxed mb-3 text-sm">
          {block.parts?.map((part, i) => <ColoredTextSpan key={i} part={part} />)}
        </p>
      );
    case ContentType.TABLE:
       return <p key={index} className="text-xs italic text-slate-400 my-2">[Table preview not supported here]</p>;
    default:
      return null;
  }
};

const markdownToContentBlocks = (markdown: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  const lines = markdown.split('\n');
  let i = 0;

  while (i < lines.length) {
    let line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push({ type: ContentType.HEADING2, text: line.substring(3).trim() });
      i++;
    } else if (line.startsWith('### ')) {
      blocks.push({ type: ContentType.HEADING3, text: line.substring(4).trim() });
      i++;
    } else if (line.match(/^[\*\-\+] /)) {
      const listItems: ListItem[] = [];
      while (i < lines.length && lines[i].match(/^[\*\-\+] /)) {
        listItems.push(lines[i].substring(2).trim());
        i++;
      }
      blocks.push({ type: ContentType.LIST, items: listItems });
    } else if (line.match(/^\d+\. /)) {
      const listItems: ListItem[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        listItems.push(lines[i].replace(/^\d+\. /, '').trim());
        i++;
      }
      blocks.push({ type: ContentType.ORDERED_LIST, items: listItems });
    } else if (line.trim() === '```json') {
      let jsonString = '';
      i++;
      while (i < lines.length && lines[i].trim() !== '```') {
        jsonString += lines[i] + '\n';
        i++;
      }
      i++; // Skip closing ```
      try {
        const parsedBlock = JSON.parse(jsonString);
        if (parsedBlock.type) {
          blocks.push(parsedBlock);
        }
      } catch (e) {
        console.error("Invalid JSON in code block:", e);
        blocks.push({ type: ContentType.PARAGRAPH, text: '```json\n' + jsonString + '```' });
      }
    } else {
      let paragraphText = '';
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].match(/^(## |### |[\*\-\+] |\d+\. |```json)/)) {
        paragraphText += (paragraphText ? '\n' : '') + lines[i];
        i++;
      }
      blocks.push({ type: ContentType.PARAGRAPH, text: paragraphText });
    }
  }
  return blocks;
};
// --- END: Logic ---

interface AddArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, markdownContent: string) => void;
}

const AddArticleModal: React.FC<AddArticleModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [previewBlocks, setPreviewBlocks] = useState<ContentBlock[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
      setPreviewBlocks([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setPreviewBlocks(markdownToContentBlocks(content));
    }, 250);

    return () => clearTimeout(handler);
  }, [content]);

  if (!isOpen) return null;

  const handleSaveClick = () => {
    if (!title.trim()) {
      alert('Title is required.');
      return;
    }
    onSave(title, content);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-article-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl text-slate-800 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
          <h2 id="add-article-title" className="text-lg font-bold">
            Add New Article
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <main className="p-6 space-y-4 flex-grow overflow-y-auto">
          <div>
            <label htmlFor="article-title" className="block text-sm font-medium text-slate-700 mb-1">
              Title
            </label>
            <input
              id="article-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Enter article title..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-[400px]">
            <div>
              <label htmlFor="article-content" className="block text-sm font-medium text-slate-700 mb-1">
                Content (Markdown-like syntax supported)
              </label>
              <textarea
                id="article-content"
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full h-full min-h-[400px] border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm font-mono p-3 resize-none"
                placeholder="## Heading 2&#10;### Heading 3&#10;* A list item&#10;1. An ordered list item"
              />
            </div>
            <div className="h-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Live Preview
              </label>
              <div className="w-full h-full min-h-[400px] border border-slate-300 rounded-md bg-slate-50 p-3 overflow-y-auto">
                {previewBlocks.length > 0 ? (
                  previewBlocks.map((block, index) => renderPreviewBlock(block, index))
                ) : (
                  <p className="text-slate-400 text-sm italic">Preview will appear here...</p>
                )}
              </div>
            </div>
          </div>
        </main>

        <footer className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl flex justify-end items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="bg-white text-slate-700 font-medium py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveClick}
            className="bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors text-sm"
          >
            Save Article
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AddArticleModal;
