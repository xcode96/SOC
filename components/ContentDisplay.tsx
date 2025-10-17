import React, { useState } from 'react';
import { ContentType } from '../types';
import type { Topic, ContentBlock, HighlightColor, ColoredText, ContentPart } from '../types';
import ExplanationModal from './ExplanationModal';

interface ContentDisplayProps {
  topic: Topic;
}

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

const ExplainButton: React.FC<{ onClick: () => void; }> = ({ onClick }) => (
    <button 
        onClick={onClick} 
        className="absolute -top-1 -right-1 p-1.5 text-slate-400 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:text-sky-500 hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Explain this concept"
        title="Explain this concept"
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    </button>
);

const getTextFromParts = (parts?: ContentPart[]): string => {
    if (!parts) return '';
    return parts.map(p => typeof p === 'string' ? p : p.text).join('');
}

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

const renderContentBlock = (block: ContentBlock, index: number, explainHandler: (text: string) => void) => {
  switch (block.type) {
    case ContentType.HEADING2:
      return (
        <div key={index} className="group relative">
            <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-4 pb-2 border-b border-white/20 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-indigo-500">{block.text}</h2>
            <ExplainButton onClick={() => explainHandler(block.text!)} />
        </div>
      );
    case ContentType.HEADING3:
      return (
        <div key={index} className="group relative">
            <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-cyan-500">{block.text}</h3>
            <ExplainButton onClick={() => explainHandler(block.text!)} />
        </div>
      );
    case ContentType.PARAGRAPH:
      return (
        <div key={index} className="group relative">
            <p className="text-slate-700 leading-7 mb-4">{block.text}</p>
            <ExplainButton onClick={() => explainHandler(block.text!)} />
        </div>
      );
    case ContentType.LIST:
      return (
        <ul key={index} className="space-y-3 mb-4 list-disc list-outside pl-5 marker:text-sky-500">
          {block.items?.map((item, i) => {
            if (typeof item === 'string') {
                return <li key={i} className="text-slate-600 pl-2">{item}</li>;
            }
            if ('parts' in item && item.parts) {
                return (
                    <li key={i} className="text-slate-600 pl-2">
                        {item.parts.map((part, j) => <ColoredTextSpan key={j} part={part} />)}
                    </li>
                );
            }
            if ('text' in item && 'subItems' in item) {
                return (
                    <li key={i} className="text-slate-600 pl-2">
                        <span className="font-semibold text-slate-700">{item.text}</span>
                        <ul className="mt-2 space-y-2 list-[circle] list-outside pl-5 marker:text-cyan-600">
                            {item.subItems.map((sub, j) => {
                                if (typeof sub === 'string') {
                                    return <li key={j} className="text-slate-500 pl-2">{sub}</li>;
                                }
                                return (
                                    <li key={j} className="text-slate-500 pl-2">
                                        {sub.parts.map((part, k) => <ColoredTextSpan key={k} part={part} />)}
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                );
            }
            return null;
          })}
        </ul>
      );
    case ContentType.ORDERED_LIST:
        return (
          <ol key={index} className="space-y-4 mb-4 list-decimal list-outside pl-5 marker:text-sky-600">
            {block.items?.map((item, i) => {
                if (typeof item === 'string') {
                    return <li key={i} className="text-slate-600 pl-2">{item}</li>;
                }
                if ('parts' in item && item.parts) {
                    return (
                        <li key={i} className="text-slate-600 pl-2">
                            {item.parts.map((part, j) => <ColoredTextSpan key={j} part={part} />)}
                        </li>
                    );
                }
                if ('text' in item && 'subItems' in item) {
                    return (
                    <li key={i} className="text-slate-600 pl-2">
                        <span className="font-bold text-slate-700">{item.text}</span>
                        <div className="mt-2 space-y-2">
                            {item.subItems.map((sub, j) => {
                                if (typeof sub === 'string') {
                                    return <p key={j} className="text-slate-500">{sub}</p>;
                                }
                                return (
                                    <p key={j} className="text-slate-500">
                                        {sub.parts.map((part, k) => <ColoredTextSpan key={k} part={part} />)}
                                    </p>
                                );
                            })}
                        </div>
                    </li>
                    );
                }
                return null;
            })}
          </ol>
        );
    case ContentType.HIGHLIGHT:
      const color = block.color || 'blue';
      const classes = highlightBlockMap[color];
      return (
        <div key={index} className={`${classes.bg} border-l-4 ${classes.border} p-4 my-6 rounded-md shadow group relative`}>
          <p className={`${classes.text} leading-6 font-medium`}>{block.text}</p>
          <ExplainButton onClick={() => explainHandler(block.text!)} />
        </div>
      );
    case ContentType.COLORED_PARAGRAPH:
      return (
        <div key={index} className="group relative">
            <p className="text-slate-700 leading-7 mb-4 text-base">
            {block.parts?.map((part, i) => <ColoredTextSpan key={i} part={part} />)}
            </p>
            <ExplainButton onClick={() => explainHandler(getTextFromParts(block.parts))} />
        </div>
      );
    case ContentType.IMAGE:
      return (
        <div key={index} className="my-6">
          <img 
            src={block.src} 
            alt={block.alt} 
            className="rounded-lg shadow-md max-w-full h-auto mx-auto border-4 border-slate-200/80" 
            loading="lazy"
          />
          {block.alt && <p className="text-center text-sm text-slate-500 italic mt-2">{block.alt}</p>}
        </div>
      );
    case ContentType.TABLE:
      return (
        <div key={index} className="my-6 overflow-x-auto rounded-lg border border-slate-300/50 shadow-sm">
          <table className="w-full">
            <tbody>
              {block.rows?.map((row, i) => (
                <tr key={i} className="border-b border-slate-200/50 last:border-b-0">
                  {row.map((cell, j) => {
                    const cellColor = cell.color ? inlineColorMap[cell.color] : null;
                    const cellClasses = cellColor ? `${cellColor.bg} ${cellColor.text} font-semibold` : 'bg-white/50 text-slate-700';
                    return (
                      <td key={j} className={`p-3 border-r border-slate-200/50 last:border-r-0 ${cellClasses}`}>
                        {cell.text}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
};

const ContentDisplay: React.FC<ContentDisplayProps> = ({ topic }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textToExplain, setTextToExplain] = useState('');

  const handleExplainClick = (text: string) => {
    setTextToExplain(text);
    setIsModalOpen(true);
  };

  return (
    <>
        <article
        key={topic.id} 
        className="max-w-4xl mx-auto opacity-0 animate-fade-in-up will-change-transform-opacity"
        >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            {topic.title}
        </h1>
        <div>
            {topic.content.map((block, index) => renderContentBlock(block, index, handleExplainClick))}
        </div>
        </article>
        <ExplanationModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            textToExplain={textToExplain}
        />
    </>
  );
};

export default ContentDisplay;