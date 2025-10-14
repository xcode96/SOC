import React, { useState, useRef, useEffect } from 'react';
import { ContentType } from '../types';
import type { Topic, ContentBlock, ListItem } from '../types';
import AddArticleModal from '../components/AddArticleModal';

interface AdminGuideEditorPageProps {
  guide: { title: string; topics: Topic[] };
  guideId: string;
  onAddNewTopic: (guideId: string, newTopic: Topic) => void;
  onUpdateTopic: (guideId: string, originalTopicId: string, updatedTopic: Topic) => void;
  onDeleteTopic: (guideId: string, topicId: string) => void;
  onUpdateGuide: (guideId: string, newGuideData: { title: string; topics: Topic[] }) => void;
}

// --- START: Markdown Conversion Utilities ---

/**
 * Converts an array of ContentBlock objects into a Markdown string.
 * Simple blocks are converted to Markdown syntax, while complex ones are embedded as JSON code blocks.
 */
const contentBlocksToMarkdown = (content: ContentBlock[]): string => {
  if (!content) return '';
  return content.map(block => {
    switch (block.type) {
      case ContentType.HEADING2:
        return `## ${block.text || ''}`;
      case ContentType.HEADING3:
        return `### ${block.text || ''}`;
      case ContentType.PARAGRAPH:
        return block.text || '';
      case ContentType.LIST:
        return (block.items?.map(item => `* ${typeof item === 'string' ? item : JSON.stringify(item)}`).join('\n')) || '';
      case ContentType.ORDERED_LIST:
        return (block.items?.map((item, index) => `${index + 1}. ${typeof item === 'string' ? item : JSON.stringify(item)}`).join('\n')) || '';
      // For complex types, embed them as JSON code blocks to preserve them
      case ContentType.HIGHLIGHT:
      case ContentType.COLORED_PARAGRAPH:
      case ContentType.TABLE:
      default:
        return '```json\n' + JSON.stringify(block, null, 2) + '\n```';
    }
  }).join('\n\n');
};

/**
 * Converts a Markdown string into an array of ContentBlock objects.
 * Parses standard Markdown and special JSON code blocks.
 */
const markdownToContentBlocks = (markdown: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  const lines = markdown.split('\n');
  let i = 0;

  while (i < lines.length) {
    let line = lines[i];

    // Skip empty lines between blocks
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
        // Fallback: treat invalid JSON block as plain text
        // Fix: Corrected typo from PARAGraph to PARAGRAPH.
        blocks.push({ type: ContentType.PARAGRAPH, text: '```json\n' + jsonString + '```' });
      }
    } else {
      // Default to paragraph
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

// --- END: Markdown Conversion Utilities ---


const AdminGuideEditorPage: React.FC<AdminGuideEditorPageProps> = ({ guide, guideId, onAddNewTopic, onUpdateTopic, onDeleteTopic, onUpdateGuide }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for guide title editing
  const [editedGuideTitle, setEditedGuideTitle] = useState(guide.title);
  const [isAddArticleModalOpen, setIsAddArticleModalOpen] = useState(false);

  // State for inline topic editing
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedId, setEditedId] = useState('');
  const [editedContentMarkdown, setEditedContentMarkdown] = useState('');

  // Sync state with props if the guide changes
  useEffect(() => {
    setEditedGuideTitle(guide.title);
  }, [guide.title]);
  
  const handleSaveNewArticle = (title: string, markdownContent: string) => {
    const newId = title.trim().toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!title || !newId) {
      alert('Title is required and must result in a valid ID.');
      return;
    }

    if (guide.topics.some(t => t.id === newId)) {
      alert(`A topic with the generated ID "${newId}" already exists. Please choose a different title.`);
      return;
    }

    const newTopic: Topic = {
      id: newId,
      title: title.trim(),
      content: markdownToContentBlocks(markdownContent)
    };

    onAddNewTopic(guideId, newTopic);
    setIsAddArticleModalOpen(false); // Close modal on success
  };

  const handleEditClick = (topic: Topic) => {
    setEditingTopicId(topic.id);
    setEditedTitle(topic.title);
    setEditedId(topic.id);
    setEditedContentMarkdown(contentBlocksToMarkdown(topic.content));
  };

  const handleCancelEdit = () => {
    setEditingTopicId(null);
  };

  const handleDeleteClick = (topicId: string) => {
    if (window.confirm('Are you sure you want to delete this topic? This action is permanent.')) {
      onDeleteTopic(guideId, topicId);
    }
  };

  const handleSaveEdit = (originalTopicId: string) => {
    if (!editedTitle || !editedId) {
      alert('Title and ID must not be empty.');
      return;
    }

    if (guide.topics.some(t => t.id === editedId && t.id !== originalTopicId)) {
      alert('This Topic ID is already in use. Please choose a unique ID.');
      return;
    }

    const parsedContent = markdownToContentBlocks(editedContentMarkdown);

    const updatedTopic: Topic = {
      id: editedId,
      title: editedTitle,
      content: parsedContent,
    };

    onUpdateTopic(guideId, originalTopicId, updatedTopic);
    setEditingTopicId(null);
  };
  
  const handleGuideTitleSave = () => {
    if (!editedGuideTitle) {
        alert('Guide title cannot be empty.');
        return;
    }
    onUpdateGuide(guideId, { title: editedGuideTitle, topics: guide.topics });
    alert('Guide title updated successfully!');
  };


  const handleExportGuide = () => {
    const dataToExport = {
        title: guide.title,
        topics: guide.topics,
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guide-${guideId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!window.confirm('Are you sure you want to import this file? This will overwrite all content for the current guide.')) {
      if (event.target) {
        event.target.value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        try {
          const data = JSON.parse(content);
          // Basic validation
          if (data && typeof data.title === 'string' && Array.isArray(data.topics)) {
            onUpdateGuide(guideId, data);
            alert('Guide imported successfully!');
          } else {
            throw new Error('Invalid guide data structure in JSON file.');
          }
        } catch (error) {
          console.error("Failed to import guide:", error);
          alert(`Error importing guide: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else {
        alert('Failed to read file content.');
      }
    };
    reader.onerror = () => {
      alert('Error reading the file.');
    };
    reader.readAsText(file);

    // Reset the file input value
    if (event.target) {
      event.target.value = '';
    }
  };


  return (
    <div className="h-full text-white p-4 sm:p-8 opacity-0 animate-fade-in will-change-transform-opacity overflow-y-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
       <AddArticleModal 
        isOpen={isAddArticleModalOpen}
        onClose={() => setIsAddArticleModalOpen(false)}
        onSave={handleSaveNewArticle}
      />
      <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex-grow min-w-0">
          <label htmlFor="guide-title-input" className="text-sm font-medium text-slate-300">Guide Title</label>
          <div className="flex items-center gap-3 mt-1">
            <input 
              id="guide-title-input"
              type="text" 
              value={editedGuideTitle} 
              onChange={(e) => setEditedGuideTitle(e.target.value)}
              className="w-full max-w-lg bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-cyan-400 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button 
              onClick={handleGuideTitleSave}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-4 rounded-md transition-colors flex-shrink-0"
              aria-label="Save guide title"
            >
              Save Title
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
            <a href={`#/guide/${guideId}`} target="_blank" rel="noopener noreferrer" className="text-sm bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View
            </a>
             <button onClick={handleImportClick} className="text-sm bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import
            </button>
            <button onClick={handleExportGuide} className="text-sm bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
            </button>
            <a href="#/admin/dashboard" className="text-sm text-sky-400 hover:text-sky-300 transition-colors">← Back to Dashboard</a>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Topic Area */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 self-start">
          <h2 className="text-xl font-bold mb-2">Add New Topic</h2>
          <p className="text-slate-400 text-sm mb-4">Add a new article to this guide, complete with its initial content written in Markdown.</p>
          <button 
            onClick={() => setIsAddArticleModalOpen(true)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-2.5 px-4 rounded-lg hover:opacity-90 transition-transform hover:scale-105 flex items-center justify-center gap-2"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
             </svg>
            Add New Article
          </button>
        </div>

        {/* Current Topics List */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Current Topics ({guide.topics.length})</h2>
           <ul className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
            {guide.topics.map(topic => (
              <li key={topic.id} className="bg-slate-700/50 p-4 rounded-lg transition-all">
                {editingTopicId === topic.id ? (
                  // EDITING VIEW
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Topic Title</label>
                      <input type="text" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} className="w-full bg-slate-600/50 border border-slate-500 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Topic ID</label>
                      <input type="text" value={editedId} onChange={e => setEditedId(e.target.value.toLowerCase().replace(/\s/g, ''))} className="w-full bg-slate-600/50 border border-slate-500 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Content (Markdown)</label>
                      <textarea 
                        value={editedContentMarkdown}
                        onChange={e => setEditedContentMarkdown(e.target.value)}
                        className="w-full h-64 font-mono text-sm bg-slate-900/70 border border-slate-500 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        spellCheck="false"
                        placeholder="Use Markdown to write content. e.g., ## Heading, * for lists..."
                      />
                       <p className="text-xs text-slate-400 mt-1">Complex blocks like highlights will appear as editable JSON blocks here.</p>
                    </div>

                    <div className="flex gap-2 justify-end mt-4">
                      <button onClick={handleCancelEdit} className="text-sm bg-slate-600 hover:bg-slate-500 text-white font-bold py-1 px-3 rounded-md transition-colors">Cancel</button>
                      <button onClick={() => handleSaveEdit(topic.id)} className="text-sm bg-sky-600 hover:bg-sky-500 text-white font-bold py-1 px-3 rounded-md transition-colors">Save Changes</button>
                    </div>
                  </div>
                ) : (
                  // DISPLAY VIEW
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" title={topic.title}>{topic.title}</p>
                      <p className="text-xs text-slate-400 truncate" title={`ID: ${topic.id}`}>ID: {topic.id}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => handleEditClick(topic)} className="text-sm bg-slate-600 hover:bg-sky-600 text-white font-bold py-1 px-3 rounded-md transition-colors">Edit</button>
                      <button onClick={() => handleDeleteClick(topic.id)} className="text-sm bg-red-600/80 hover:bg-red-500 text-white font-bold py-1 px-3 rounded-md transition-colors">Delete</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
             {guide.topics.length === 0 && (
              <p className="text-center text-slate-400 py-4">This guide has no topics yet. Add one!</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminGuideEditorPage;
