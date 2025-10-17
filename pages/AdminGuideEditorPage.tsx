import React, { useState, useRef, useEffect } from 'react';
import { ContentType } from '../types';
import type { Topic, ContentBlock, HighlightColor, ColoredText, ContentPart, ListItem } from '../types';

interface AdminGuideEditorPageProps {
  guide: { title: string; topics: Topic[] };
  guideId: string;
  onAddNewTopic: (guideId: string, newTopic: { id: string; title: string }) => void;
  onUpdateTopic: (guideId: string, originalTopicId: string, updatedTopic: Topic) => void;
  onDeleteTopic: (guideId: string, topicId: string) => void;
  onUpdateGuide: (guideId: string, newGuideData: { title: string; topics: Topic[] }) => void;
}

const getMarkdownFromParts = (parts: (string | ColoredText)[]): string => {
  return parts.map(p => typeof p === 'string' ? p : `{${p.text}}[${p.color}]`).join('');
};

const parseLineToParts = (line: string): (string | ColoredText)[] => {
    const parts: (string | ColoredText)[] = [];
    // Regex to find {text}[color] patterns. It will match the text inside {} and the color inside [].
    const regex = /\{([^}]+?)\}\[([a-z]+?)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
        // Add the plain text before the match
        if (match.index > lastIndex) {
            parts.push(line.substring(lastIndex, match.index));
        }
        
        const text = match[1];
        const color = match[2] as HighlightColor;

        const validColors: HighlightColor[] = ['green', 'fuchsia', 'yellow', 'red', 'purple', 'blue', 'cyan', 'indigo'];
        if (validColors.includes(color)) {
            parts.push({ text, color });
        } else {
            // If color is not valid, treat the whole match as plain text
            parts.push(match[0]);
        }
        
        lastIndex = regex.lastIndex;
    }

    // Add any remaining text after the last match
    if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
    }

    return parts;
};


const convertJsonToMarkdown = (content: ContentBlock[]): string => {
  const lines: string[] = [];

  content.forEach(block => {
    switch (block.type) {
      case ContentType.HEADING2:
        lines.push(`## ${block.text}`);
        break;
      case ContentType.HEADING3:
        lines.push(`### ${block.text}`);
        break;
      case ContentType.PARAGRAPH:
        lines.push(block.text || '');
        break;
      case ContentType.COLORED_PARAGRAPH:
        if (block.parts) {
          lines.push(getMarkdownFromParts(block.parts));
        }
        break;
      case ContentType.LIST:
      case ContentType.ORDERED_LIST:
        const listLines: string[] = [];
        block.items?.forEach((item, index) => {
          const prefix = block.type === ContentType.ORDERED_LIST ? `${index + 1}.` : '-';
          if (typeof item === 'string') {
            listLines.push(`${prefix} ${item}`);
          } else if ('parts' in item && item.parts) {
            listLines.push(`${prefix} ${getMarkdownFromParts(item.parts)}`);
          } else if ('text' in item && 'subItems' in item) { // For backwards compatibility, flatten sub-items
            listLines.push(`${prefix} **${item.text}**`);
            item.subItems.forEach(subItem => {
              if (typeof subItem === 'string') {
                listLines.push(`  - ${subItem}`);
              } else if ('parts' in subItem && subItem.parts) {
                listLines.push(`  - ${getMarkdownFromParts(subItem.parts)}`);
              }
            });
          }
        });
        if (listLines.length > 0) {
            lines.push(listLines.join('\n'));
        }
        break;
      case ContentType.HIGHLIGHT:
        lines.push(`> **${block.color?.toUpperCase()}**: ${block.text}`);
        break;
      case ContentType.IMAGE:
        lines.push(`![${block.alt || ''}](${block.src || ''})`);
        break;
      case ContentType.TABLE:
        if (block.rows && block.rows.length > 0) {
          lines.push('| Category | Description |');
          lines.push('|---|---|');
          block.rows.forEach(row => {
            const rowText = row.map(cell => cell.text).join(' | ');
            lines.push(`| ${rowText} |`);
          });
        }
        break;
      default:
        break;
    }
  });

  return lines.join('\n\n');
};

const parseMarkdownToContentBlocks = (markdown: string): ContentBlock[] => {
    const content: ContentBlock[] = [];
    if (!markdown) return content;
    
    const blocks = markdown.trim().split(/\n\s*\n/);

    for (const block of blocks) {
        const imageMatch = block.match(/^!\[(.*?)]\((.*?)\)$/);

        if (imageMatch) {
            content.push({ type: ContentType.IMAGE, alt: imageMatch[1].trim(), src: imageMatch[2].trim() });
        } else if (block.startsWith('### ')) {
            content.push({ type: ContentType.HEADING3, text: block.substring(4).trim() });
        } else if (block.startsWith('## ')) {
            content.push({ type: ContentType.HEADING2, text: block.substring(3).trim() });
        } else if (block.startsWith('> **')) {
            const match = block.match(/> \*\*(.*?)\*\*: (.*)/s);
            if (match) {
                const color = match[1].toLowerCase() as HighlightColor;
                if (['green', 'fuchsia', 'yellow', 'red', 'purple', 'blue', 'cyan', 'indigo'].includes(color)) {
                    content.push({ type: ContentType.HIGHLIGHT, color, text: match[2].trim() });
                }
            }
        } else if (block.startsWith('- ') || block.startsWith('* ') || block.match(/^\d+\.\s/)) {
            const isOrdered = block.match(/^\d+\.\s/);
            const lines = block.split('\n');
            const items = lines.map(line => {
                const cleanLine = line.replace(/^([-*]|\d+\.)\s*/, '').trim();
                if (!cleanLine) return null;

                const parts = parseLineToParts(cleanLine);
                if (parts.length === 1 && typeof parts[0] === 'string') {
                    return parts[0]; // Simple string item
                }
                return { parts }; // Item with colored parts
            }).filter(item => item !== null);

            content.push({ type: isOrdered ? ContentType.ORDERED_LIST : ContentType.LIST, items: items as ListItem[] });
        
        } else if (block.trim()) {
            const parts = parseLineToParts(block.trim());
            if (parts.length === 1 && typeof parts[0] === 'string') {
                 content.push({ type: ContentType.PARAGRAPH, text: parts[0] });
            } else {
                 content.push({ type: ContentType.COLORED_PARAGRAPH, parts });
            }
        }
    }
    return content;
};

const parseMarkdownToGuide = (markdown: string): { title: string; topics: Topic[] } => {
  let guideTitle = 'Untitled Guide';
  const topics: Topic[] = [];
  const contentParts = markdown.split(/\n---\n/);

  const firstPart = contentParts[0].trim();
  const titleMatch = firstPart.match(/^# (.*)/);
  if (titleMatch) {
    guideTitle = titleMatch[1];
    // Remove title from the first topic's content if it's there
    contentParts[0] = firstPart.substring(firstPart.indexOf('\n')).trim();
  }

  for (const topicMarkdown of contentParts) {
    const lines = topicMarkdown.trim().split('\n');
    const topicTitleMatch = lines[0] ? lines[0].match(/^## (.*)/) : null;
    if (!topicTitleMatch) continue;

    const title = topicTitleMatch[1].trim();
    const contentMarkdown = lines.slice(1).join('\n');
    
    const topic: Topic = {
      id: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      title: title,
      content: parseMarkdownToContentBlocks(contentMarkdown),
    };
    topics.push(topic);
  }

  return { title: guideTitle, topics };
};


// Preview rendering helpers (adapted from ContentDisplay)
const inlineColorMap: Record<HighlightColor, { bg: string; text: string }> = {
    green: { bg: 'bg-green-100', text: 'text-green-800' }, fuchsia: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-800' }, yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800' }, red: { bg: 'bg-red-100', text: 'text-red-800' }, purple: { bg: 'bg-purple-100', text: 'text-purple-800' }, blue: { bg: 'bg-blue-100', text: 'text-blue-800' }, cyan: { bg: 'bg-cyan-100', text: 'text-cyan-800' }, indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
};
const highlightBlockMap: Record<HighlightColor, { border: string; bg: string; text: string }> = {
    green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-800' }, fuchsia: { border: 'border-fuchsia-500', bg: 'bg-fuchsia-50', text: 'text-fuchsia-800' }, yellow: { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-800' }, red: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-800' }, purple: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-800' }, blue: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-800' }, cyan: { border: 'border-cyan-500', bg: 'bg-cyan-50', text: 'text-cyan-800' }, indigo: { border: 'border-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-800' },
};

const ColoredTextSpan: React.FC<{ part: string | ColoredText }> = ({ part }) => {
    if (typeof part === 'string') return <span>{part}</span>;
    const colorClasses = inlineColorMap[part.color];
    return <span className={`${colorClasses.bg} ${colorClasses.text} font-semibold px-1 py-0.5 rounded`}>{part.text}</span>;
};

const renderPreviewBlock = (block: ContentBlock, index: number) => {
  switch (block.type) {
    case ContentType.HEADING2: return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 pb-1 border-b border-slate-300 text-slate-800">{block.text}</h2>;
    case ContentType.HEADING3: return <h3 key={index} className="text-xl font-semibold mt-5 mb-2 text-slate-700">{block.text}</h3>;
    case ContentType.PARAGRAPH: return <p key={index} className="text-slate-600 leading-relaxed mb-4">{block.text}</p>;
    case ContentType.LIST: return (
        <ul key={index} className="space-y-2 mb-4 list-disc list-outside pl-5 marker:text-sky-500">
            {block.items?.map((item, i) => {
                if (typeof item === 'string') return <li key={i} className="text-slate-600 pl-2">{item}</li>;
                if ('parts' in item && item.parts) return <li key={i} className="text-slate-600 pl-2">{item.parts.map((p, j) => <ColoredTextSpan key={j} part={p} />)}</li>;
                return null;
            })}
        </ul>
    );
    case ContentType.ORDERED_LIST: return (
        <ol key={index} className="space-y-2 mb-4 list-decimal list-outside pl-5 marker:text-sky-600">
            {block.items?.map((item, i) => {
                if (typeof item === 'string') return <li key={i} className="text-slate-600 pl-2">{item}</li>;
                if ('parts' in item && item.parts) return <li key={i} className="text-slate-600 pl-2">{item.parts.map((p, j) => <ColoredTextSpan key={j} part={p} />)}</li>;
                return null;
            })}
        </ol>
    );
    case ContentType.HIGHLIGHT:
      const color = block.color || 'blue';
      const classes = highlightBlockMap[color];
      return <div key={index} className={`${classes.bg} border-l-4 ${classes.border} p-4 my-5 rounded-r-md`}><p className={`${classes.text} leading-6 font-medium`}>{block.text}</p></div>;
    case ContentType.COLORED_PARAGRAPH: return <p key={index} className="text-slate-600 leading-relaxed mb-4">{block.parts?.map((part, i) => <ColoredTextSpan key={i} part={part} />)}</p>;
    case ContentType.IMAGE: return (
        <div key={index} className="my-5"><img src={block.src} alt={block.alt} className="rounded-md shadow-sm max-w-full h-auto mx-auto border-2 border-slate-200" loading="lazy" />{block.alt && <p className="text-center text-xs text-slate-500 italic mt-2">{block.alt}</p>}</div>
    );
    default: return null;
  }
};

// Main Component
const AdminGuideEditorPage: React.FC<AdminGuideEditorPageProps> = ({ guide, guideId, onAddNewTopic, onUpdateTopic, onDeleteTopic, onUpdateGuide }) => {
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicId, setNewTopicId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const [editedGuideTitle, setEditedGuideTitle] = useState(guide.title);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedId, setEditedId] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy Markdown');

  useEffect(() => { setEditedGuideTitle(guide.title); }, [guide.title]);

  const handleAddTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle || !newTopicId) return alert('Topic Title and ID are required.');
    if (guide.topics.some(t => t.id === newTopicId)) return alert('This Topic ID is already in use.');
    onAddNewTopic(guideId, { id: newTopicId, title: newTopicTitle });
    setNewTopicTitle(''); setNewTopicId('');
  };

  const handleEditClick = (topic: Topic) => {
    setEditingTopicId(topic.id); setEditedTitle(topic.title); setEditedId(topic.id); setEditedContent(convertJsonToMarkdown(topic.content));
  };

  const handleCancelEdit = () => setEditingTopicId(null);

  const handleDeleteClick = (topicId: string) => {
    if (window.confirm('Are you sure? This action is permanent.')) onDeleteTopic(guideId, topicId);
  };

  const handleSaveEdit = (originalTopicId: string) => {
    if (!editedTitle || !editedId) return alert('Title and ID must not be empty.');
    if (guide.topics.some(t => t.id === editedId && t.id !== originalTopicId)) return alert('This Topic ID is already in use.');
    const updatedTopic: Topic = { id: editedId, title: editedTitle, content: parseMarkdownToContentBlocks(editedContent) };
    onUpdateTopic(guideId, originalTopicId, updatedTopic);
    setEditingTopicId(null);
  };
  
  const handleGuideTitleSave = () => {
    if (!editedGuideTitle) return alert('Guide title cannot be empty.');
    onUpdateGuide(guideId, { title: editedGuideTitle, topics: guide.topics });
    alert('Guide title updated successfully!');
  };

  const handleExportGuideAsMarkdown = () => {
    let fullMarkdown = `# ${guide.title}\n\n`;
    guide.topics.forEach((topic, index) => {
        fullMarkdown += `## ${topic.title}\n\n${convertJsonToMarkdown(topic.content)}`;
        if (index < guide.topics.length - 1) fullMarkdown += `\n\n---\n\n`;
    });
    const blob = new Blob([fullMarkdown.trim()], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${guideId}-guide.md`; a.click(); URL.revokeObjectURL(url); a.remove();
  };
  
  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !window.confirm('This will overwrite all content for the current guide. Continue?')) {
        if (event.target) event.target.value = ''; return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
          const data = parseMarkdownToGuide(content);
          if (data.topics.length > 0) {
            onUpdateGuide(guideId, data); alert('Guide imported!');
          } else throw new Error('Could not parse any topics.');
      } catch (error) {
          alert(`Error importing guide: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
    if (event.target) event.target.value = '';
  };
  
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(editedContent).then(() => {
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy Markdown'), 2000);
    });
  };

  const insertMarkdown = (prefix: string, suffix: string = '', placeholder: string = 'text') => {
    const textarea = editorRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart, end = textarea.selectionEnd, val = textarea.value;
    const selected = val.substring(start, end);
    const replacement = selected ? `${prefix}${selected}${suffix}` : `${prefix}${placeholder}${suffix}`;
    const newText = val.substring(0, start) + replacement + val.substring(end);
    setEditedContent(newText);
    textarea.focus();
    setTimeout(() => {
        if (selected) {
            textarea.selectionStart = textarea.selectionEnd = start + replacement.length;
        } else {
            textarea.selectionStart = start + prefix.length;
            textarea.selectionEnd = start + prefix.length + placeholder.length;
        }
    }, 0);
  };
  const handleImageInsert = () => {
    const url = prompt('Enter image URL:', 'https://');
    if (url) insertMarkdown('![alt text](', `)`);
    // Replace placeholder with URL
    setTimeout(() => setEditedContent(c => c.replace('text', url)), 0);
  }

  const toolbarButtons = [
    { label: 'H2', action: () => insertMarkdown('## ', '', 'Heading') },
    { label: 'H3', action: () => insertMarkdown('### ', '', 'Subheading') },
    { label: 'B', action: () => insertMarkdown('**', '**', 'bold text'), className: 'font-bold' },
    { label: 'I', action: () => insertMarkdown('{', '}[blue]', 'italic text'), className: 'italic' },
    { label: 'List', action: () => insertMarkdown('\n- ', '', 'List item') },
    { label: 'Img', action: handleImageInsert },
  ];

  return (
    <div className="h-full text-white p-4 sm:p-8 opacity-0 animate-fade-in will-change-transform-opacity overflow-y-auto">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".md,.markdown" className="hidden" />
      <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex-grow min-w-0">
          <label htmlFor="guide-title-input" className="text-sm font-medium text-slate-300">Guide Title</label>
          <div className="flex items-center gap-3 mt-1">
            <input id="guide-title-input" type="text" value={editedGuideTitle} onChange={(e) => setEditedGuideTitle(e.target.value)} className="w-full max-w-lg bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-cyan-400 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-sky-500" />
            <button onClick={handleGuideTitleSave} className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-4 rounded-md transition-colors flex-shrink-0">Save Title</button>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
            <a href={`#/guide/${guideId}`} target="_blank" rel="noopener noreferrer" className="text-sm bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center gap-2">View</a>
            <button onClick={handleImportClick} className="text-sm bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center gap-2">Import</button>
            <button onClick={handleExportGuideAsMarkdown} className="text-sm bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center gap-2">Export</button>
            <a href="#/admin/dashboard" className="text-sm text-sky-400 hover:text-sky-300 transition-colors">← Back to Dashboard</a>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 self-start">
          <h2 className="text-xl font-bold mb-4">Add New Topic</h2>
          <form onSubmit={handleAddTopicSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Topic Title</label>
              <input type="text" value={newTopicTitle} onChange={e => setNewTopicTitle(e.target.value)} placeholder="e.g., Advanced Commands" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Topic ID (unique, no spaces)</label>
              <input type="text" value={newTopicId} onChange={e => setNewTopicId(e.target.value.toLowerCase().replace(/\s/g, ''))} placeholder="e.g., advanced-commands" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" required />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90">Add Topic</button>
          </form>
        </div>
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Current Topics ({guide.topics.length})</h2>
           <ul className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {guide.topics.map(topic => (
              <li key={topic.id} className="bg-slate-700/50 p-4 rounded-lg transition-all">
                {editingTopicId === topic.id ? (
                  <div className="space-y-4 animate-fade-in">
                    <input type="text" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} placeholder="Topic Title" className="w-full bg-slate-600/50 border border-slate-500 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    <input type="text" value={editedId} onChange={e => setEditedId(e.target.value.toLowerCase().replace(/\s/g, ''))} placeholder="Topic ID" className="w-full bg-slate-600/50 border border-slate-500 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    <div>
                        <div className="flex justify-between items-center mb-1"><label className="text-sm font-medium text-slate-300">Content (Markdown)</label><button onClick={handleCopyMarkdown} className="text-xs bg-slate-600 hover:bg-slate-500 rounded px-2 py-0.5 transition-colors">{copyButtonText}</button></div>
                        <div className="bg-slate-900/70 border border-slate-500 rounded-md overflow-hidden">
                            <div className="flex items-center gap-1 p-2 bg-slate-800/50 border-b border-slate-500">{toolbarButtons.map(btn => (<button key={btn.label} type="button" onClick={btn.action} className={`w-8 h-8 rounded text-sm text-slate-300 hover:bg-slate-600 ${btn.className}`}>{btn.label}</button>))}</div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-px bg-slate-500 h-[30rem] xl:h-96">
                                <textarea ref={editorRef} value={editedContent} onChange={e => setEditedContent(e.target.value)} className="w-full h-full font-mono text-xs bg-slate-800 p-3 text-white focus:outline-none resize-none" spellCheck="false" />
                                <div className="bg-slate-100 p-4 overflow-y-auto h-full text-sm hidden xl:block">{parseMarkdownToContentBlocks(editedContent).map((block, i) => renderPreviewBlock(block, i))}</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end mt-4">
                      <button onClick={handleCancelEdit} className="text-sm bg-slate-600 hover:bg-slate-500 font-bold py-1 px-3 rounded-md">Cancel</button>
                      <button onClick={() => handleSaveEdit(topic.id)} className="text-sm bg-sky-600 hover:bg-sky-500 font-bold py-1 px-3 rounded-md">Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 min-w-0"><p className="font-medium truncate">{topic.title}</p><p className="text-xs text-slate-400 truncate">ID: {topic.id}</p></div>
                    <div className="flex gap-2 flex-shrink-0"><button onClick={() => handleEditClick(topic)} className="text-sm bg-slate-600 hover:bg-sky-600 font-bold py-1 px-3 rounded-md">Edit</button><button onClick={() => handleDeleteClick(topic.id)} className="text-sm bg-red-600/80 hover:bg-red-500 font-bold py-1 px-3 rounded-md">Delete</button></div>
                  </div>
                )}
              </li>
            ))}
             {guide.topics.length === 0 && (<p className="text-center text-slate-400 py-4">This guide has no topics yet. Add one!</p>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminGuideEditorPage;