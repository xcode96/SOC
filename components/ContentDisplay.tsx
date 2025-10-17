import React, { useState, useEffect } from 'react';
import { ContentType } from '../types';
import type { Topic, ContentBlock, HighlightColor, ColoredText, ContentPart } from '../types';
import ExplanationModal from './ExplanationModal';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markdown';


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

const CodeBlock: React.FC<{ language?: string; code: string }> = ({ language, code }) => {
    const [buttonText, setButtonText] = useState('Copy');
    
    useEffect(() => {
        Prism.highlightAll();
    }, [code, language]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setButtonText('Copied!');
            setTimeout(() => setButtonText('Copy'), 2000);
        }, (err) => {
            setButtonText('Failed!');
            console.error('Could not copy text: ', err);
        });
    };

    const langClass = language ? `language-${language}` : '';

    return (
        <div className="my-6 relative group text-left">
            <div className="flex justify-between items-center px-4 py-2 bg-slate-200 rounded-t-lg border-b border-slate-300">
                <span className="text-xs font-sans text-slate-500 select-none">{language || 'code'}</span>
                <button 
                    onClick={handleCopy}
                    className="text-xs font-sans text-slate-600 bg-slate-300 hover:bg-slate-400 rounded-md px-3 py-1 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                    {buttonText}
                </button>
            </div>
            <pre className="p-4 text-sm text-slate-200 overflow-x-auto font-mono !bg-slate-800 rounded-b-lg !m-0">
                <code className={langClass}>{code}</code>
            </pre>
        </div>
    );
};


const getTextFromParts = (parts?: ContentPart[]): string => {
    if (!parts) return '';
    return parts.map(p => {
        if (typeof p === 'string') return p;
        if ('text' in p) return p.text;
        return '';
    }).join('');
}

const renderContentParts = (parts?: ContentPart[]) => {
    if (!parts) return null;
    return parts.map((part, i) => <ContentPartSpan key={i} part={part} />);
};

const ContentPartSpan: React.FC<{ part: ContentPart }> = ({ part }) => {
    if (typeof part === 'string') {
        const segments = part.split(/(\*\*.*?\*\*|~~.*?~~)/g);
        return (
            <>
                {segments.map((segment, i) => {
                    if (segment.startsWith('**') && segment.endsWith('**')) {
                        return <strong key={i}>{segment.slice(2, -2)}</strong>;
                    }
                    if (segment.startsWith('~~') && segment.endsWith('~~')) {
                        return <s key={i}>{segment.slice(2, -2)}</s>;
                    }
                    return <span key={i}>{segment}</span>;
                })}
            </>
        );
    }
    if (typeof part === 'object' && 'type' in part) {
        switch (part.type) {
            case ContentType.STRIKETHROUGH:
                return <s>{part.text}</s>;
            case ContentType.LINK:
                return <a href={part.href} className="text-sky-600 underline hover:text-sky-700 transition-colors" target="_blank" rel="noopener noreferrer">{part.text}</a>;
        }
    }
    if ('color' in part) {
      const colorClasses = inlineColorMap[part.color];
      return (
          <span className={`${colorClasses.bg} ${colorClasses.text} font-semibold px-1.5 py-0.5 rounded-md`}>
              {part.text}
          </span>
      );
    }
    return null;
};

const alertStyles = {
    note: {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>,
      classes: 'bg-blue-50 border-blue-400 text-blue-800',
    },
    warning: {
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.37-1.21 3.006 0l4.312 8.216c.63 1.202-.294 2.685-1.503 2.685H5.448c-1.21 0-2.133-1.483-1.503-2.685L8.257 3.099zM10 6a1 1 0 011 1v3a1 1 0 11-2 0V7a1 1 0 011-1zm-1 6a1 1 0 102 0 1 1 0 00-2 0z" clipRule="evenodd" /></svg>,
      classes: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    },
};

const parseLineToParts = (line: string): ContentPart[] => {
    const parts: ContentPart[] = [];
    const regex = /\{([^}]+?)\}\[([a-z]+?)\]|~~(.*?)~~|\[([^\]]+?)\]\(([^)]+?)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
            parts.push(line.substring(lastIndex, match.index));
        }
        
        if (match[1] !== undefined) { // Colored text
            const text = match[1];
            const color = match[2] as HighlightColor;
            const validColors: HighlightColor[] = ['green', 'fuchsia', 'yellow', 'red', 'purple', 'blue', 'cyan', 'indigo'];
            if (validColors.includes(color)) {
                parts.push({ text, color });
            } else {
                parts.push(match[0]);
            }
        } else if (match[3] !== undefined) { // Strikethrough
            parts.push({ type: ContentType.STRIKETHROUGH, text: match[3] });
        } else if (match[4] !== undefined) { // Link
            parts.push({ type: ContentType.LINK, text: match[4], href: match[5] });
        }
        
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
    }

    return parts;
};

const renderContentBlock = (block: ContentBlock, index: number, explainHandler: (text: string) => void) => {
  switch (block.type) {
    case ContentType.HEADING1:
        return (
          <div key={index} className="group relative">
              <h1 className="text-3xl md:text-4xl font-bold mt-12 mb-5 pb-2 border-b-2 border-slate-300 text-slate-900">{block.text}</h1>
              <ExplainButton onClick={() => explainHandler(block.text!)} />
          </div>
        );
    case ContentType.HEADING2:
      return (
        <div key={index} className="group relative">
            <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-4 pb-2 border-b border-slate-300 text-slate-800">{block.text}</h2>
            <ExplainButton onClick={() => explainHandler(block.text!)} />
        </div>
      );
    case ContentType.HEADING3:
      return (
        <div key={index} className="group relative">
            <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-3 text-slate-700">{block.text}</h3>
            <ExplainButton onClick={() => explainHandler(block.text!)} />
        </div>
      );
    case ContentType.HEADING4:
      return (
        <div key={index} className="group relative">
            <h4 className="text-lg md:text-xl font-semibold mt-6 mb-2 text-slate-700">{block.text}</h4>
            <ExplainButton onClick={() => explainHandler(block.text!)} />
        </div>
      );
    case ContentType.PARAGRAPH:
      return (
        <div key={index} className="group relative">
            <p className="text-slate-700 leading-7 mb-4">{renderContentParts(block.parts || [block.text || ''])}</p>
            <ExplainButton onClick={() => explainHandler(getTextFromParts(block.parts) || block.text!)} />
        </div>
      );
    case ContentType.LIST:
    case ContentType.ORDERED_LIST:
        const ListTag = block.type === ContentType.ORDERED_LIST ? 'ol' : 'ul';
        const listStyle = block.type === ContentType.ORDERED_LIST 
            ? 'list-decimal marker:text-sky-600'
            : 'list-disc marker:text-sky-500';

        return (
        <ListTag key={index} className={`space-y-3 mb-4 list-outside pl-5 ${listStyle}`}>
          {block.items?.map((item, i) => {
            if (typeof item === 'object' && item !== null && 'type' in item && item.type === ContentType.TASK_LIST) {
                return (
                    <li key={i} className="text-slate-600 pl-2 task-list-item">
                        <input type="checkbox" className="task-list-item-checkbox" checked={item.checked} readOnly />
                        {renderContentParts([{ type: ContentType.STRIKETHROUGH, text: item.text }])}
                    </li>
                );
            }
            if (typeof item === 'string') {
                return <li key={i} className="text-slate-600 pl-2">{item}</li>;
            }
            if ('parts' in item && item.parts) {
                return (
                    <li key={i} className="text-slate-600 pl-2">
                        {renderContentParts(item.parts)}
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
                                        {renderContentParts(sub.parts)}
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                );
            }
            return null;
          })}
        </ListTag>
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
                {renderContentParts(block.parts)}
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
    case ContentType.CODE:
      return <CodeBlock key={index} language={block.language} code={block.text || ''} />;
    case ContentType.HTML_BLOCK:
      return <div key={index} className="html-content-wrapper" dangerouslySetInnerHTML={{ __html: block.html || '' }} />;
    case ContentType.BLOCKQUOTE:
        const alertStyle = block.alertType && alertStyles[block.alertType];
        if (alertStyle) {
            return (
                <div key={index} className={`border-l-4 p-4 my-6 rounded-r-md flex ${alertStyle.classes}`}>
                    {alertStyle.icon}
                    <div className="flex-1">{block.text}</div>
                </div>
            )
        }
        return (
            <blockquote key={index} className="border-l-4 border-slate-400 pl-4 my-6 text-slate-600 italic">
                {block.text}
            </blockquote>
        );
    case ContentType.HORIZONTAL_RULE:
        return <hr key={index} className="my-8 border-slate-300/80" />;
    case ContentType.DETAILS:
        return (
            <details key={index} className="my-6 bg-slate-100/80 border border-slate-200 rounded-lg p-4 open:shadow-lg transition-shadow">
                <summary className="font-semibold text-slate-800 cursor-pointer">{block.summary}</summary>
                <div className="mt-4">
                    {block.children?.map((childBlock, childIndex) => renderContentBlock(childBlock, childIndex, explainHandler))}
                </div>
            </details>
        );
    case ContentType.TABLE:
        const getAlignmentClass = (align: 'left' | 'center' | 'right' | undefined) => {
            switch(align) {
                case 'center': return 'text-center';
                case 'right': return 'text-right';
                default: return 'text-left';
            }
        }
        return (
            <div key={index} className="my-6 overflow-x-auto rounded-lg border border-slate-300 shadow-sm">
            <table className="w-full border-collapse">
                {block.headers && (
                    <thead>
                        <tr className="bg-slate-200">
                        {block.headers.map((header, hIndex) => (
                            <th key={hIndex} className={`p-3 border-b-2 border-slate-300 font-semibold text-slate-700 ${getAlignmentClass(block.align?.[hIndex])}`}>
                                {header}
                            </th>
                        ))}
                        </tr>
                    </thead>
                )}
                <tbody>
                {block.rows?.map((row, i) => (
                    <tr key={i} className="border-b border-slate-200 last:border-b-0 even:bg-slate-50">
                    {row.map((cell, j) => (
                        <td key={j} className={`p-3 text-slate-700 ${getAlignmentClass(block.align?.[j])}`}>
                            {renderContentParts(parseLineToParts(cell.text))}
                        </td>
                    ))}
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

  useEffect(() => {
    Prism.highlightAll();
  }, [topic]);

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