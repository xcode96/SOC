import React, { useState, useRef, useEffect } from 'react';
import { ContentType } from '../types';
import type { Topic, ContentBlock, HighlightColor } from '../types';

interface AdminGuideEditorPageProps {
  guide: { title: string; topics: Topic[] };
  guideId: string;
  onAddNewTopic: (guideId: string, newTopic: { id: string; title: string }) => void;
  onUpdateTopic: (guideId: string, originalTopicId: string, updatedTopic: Topic) => void;
  onDeleteTopic: (guideId: string, topicId: string) => void;
  onUpdateGuide: (guideId: string, newGuideData: { title: string; topics: Topic[] }) => void;
}

const ContentBlockAdder: React.FC<{ onAddBlock: (block: ContentBlock) => void }> = ({ onAddBlock }) => {
    const [type, setType] = useState<ContentType>(ContentType.PARAGRAPH);
    const [text, setText] = useState('');
    const [items, setItems] = useState('');
    const [color, setColor] = useState<HighlightColor>('blue');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let newBlock: ContentBlock | null = null;
        switch(type) {
            case ContentType.HEADING2:
            case ContentType.HEADING3:
            case ContentType.PARAGRAPH:
                if (!text) { alert('Text is required.'); return; }
                newBlock = { type, text };
                break;
            case ContentType.HIGHLIGHT:
                 if (!text) { alert('Text is required.'); return; }
                newBlock = { type, text, color };
                break;
            case ContentType.LIST:
            case ContentType.ORDERED_LIST:
                if (!items) { alert('List items are required.'); return; }
                newBlock = { type, items: items.split('\n').filter(i => i.trim() !== '') };
                break;
        }

        if (newBlock) {
            onAddBlock(newBlock);
            // Reset form
            setText('');
            setItems('');
        }
    };
    
    return (
        <div className="mt-6 pt-4 border-t border-slate-600">
            <h4 className="text-md font-bold mb-3">Add Content Block</h4>
            <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-slate-800/50 rounded-lg">
                <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Block Type</label>
                    <select value={type} onChange={e => setType(e.target.value as ContentType)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-sky-500">
                        <option value={ContentType.HEADING2}>Heading 2</option>
                        <option value={ContentType.HEADING3}>Heading 3</option>
                        <option value={ContentType.PARAGRAPH}>Paragraph</option>
                        <option value={ContentType.LIST}>Unordered List</option>
                        <option value={ContentType.ORDERED_LIST}>Ordered List</option>
                        <option value={ContentType.HIGHLIGHT}>Highlight Box</option>
                    </select>
                </div>

                { (type === ContentType.HEADING2 || type === ContentType.HEADING3 || type === ContentType.PARAGRAPH || type === ContentType.HIGHLIGHT) && (
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Text</label>
                        <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-sky-500" />
                    </div>
                )}

                { type === ContentType.HIGHLIGHT && (
                     <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Color</label>
                         <select value={color} onChange={e => setColor(e.target.value as HighlightColor)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-sky-500">
                            {['green', 'fuchsia', 'yellow', 'red', 'purple', 'blue', 'cyan', 'indigo'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                )}

                { (type === ContentType.LIST || type === ContentType.ORDERED_LIST) && (
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">List Items (one per line)</label>
                        <textarea value={items} onChange={e => setItems(e.target.value)} rows={4} className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"></textarea>
                    </div>
                )}

                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-1.5 px-4 rounded-md hover:bg-indigo-500 transition-colors text-sm">
                    Add Block
                </button>
            </form>
        </div>
    );
};


const AdminGuideEditorPage: React.FC<AdminGuideEditorPageProps> = ({ guide, guideId, onAddNewTopic, onUpdateTopic, onDeleteTopic, onUpdateGuide }) => {
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicId, setNewTopicId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for guide title editing
  const [editedGuideTitle, setEditedGuideTitle] = useState(guide.title);

  // State for inline topic editing
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedId, setEditedId] = useState('');
  const [editedContent, setEditedContent] = useState('');

  // Sync state with props if the guide changes
  useEffect(() => {
    setEditedGuideTitle(guide.title);
  }, [guide.title]);

  const handleAddTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle || !newTopicId) {
      alert('Topic Title and ID are required.');
      return;
    }
    if (guide.topics.some(t => t.id === newTopicId)) {
      alert('This Topic ID is already in use for this guide. Please choose a unique ID.');
      return;
    }

    onAddNewTopic(guideId, { id: newTopicId, title: newTopicTitle });

    // Reset form
    setNewTopicTitle('');
    setNewTopicId('');
  };

  const handleEditClick = (topic: Topic) => {
    setEditingTopicId(topic.id);
    setEditedTitle(topic.title);
    setEditedId(topic.id);
    setEditedContent(JSON.stringify(topic.content, null, 2));
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

    let parsedContent;
    try {
      parsedContent = JSON.parse(editedContent);
    } catch (error) {
      alert('Content is not valid JSON. Please correct the format.');
      return;
    }

    const updatedTopic: Topic = {
      id: editedId,
      title: editedTitle,
      content: parsedContent,
    };

    onUpdateTopic(guideId, originalTopicId, updatedTopic);
    setEditingTopicId(null);
  };

  const addContentBlockToTopic = (newBlock: ContentBlock) => {
    try {
        const currentContent = JSON.parse(editedContent) as ContentBlock[];
        const updatedContent = [...currentContent, newBlock];
        setEditedContent(JSON.stringify(updatedContent, null, 2));
    } catch {
        alert('Could not add block because current content is not valid JSON.');
    }
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
        {/* Add Topic Form */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 self-start">
          <h2 className="text-xl font-bold mb-4">Add New Topic</h2>
          <form onSubmit={handleAddTopicSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Topic Title</label>
              <input 
                type="text" 
                value={newTopicTitle} 
                onChange={e => setNewTopicTitle(e.target.value)} 
                placeholder="e.g., Advanced Commands" 
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Topic ID (unique, no spaces)</label>
              <input 
                type="text" 
                value={newTopicId} 
                onChange={e => setNewTopicId(e.target.value.toLowerCase().replace(/\s/g, ''))} 
                placeholder="e.g., advanced-commands" 
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" 
                required 
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-transform hover:scale-105">
              Add Topic
            </button>
          </form>
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
                      <label className="block text-sm font-medium text-slate-300 mb-1">Content (JSON)</label>
                      <textarea 
                        value={editedContent}
                        onChange={e => setEditedContent(e.target.value)}
                        className="w-full h-40 font-mono text-xs bg-slate-900/70 border border-slate-500 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        spellCheck="false"
                      />
                    </div>
                    
                    <ContentBlockAdder onAddBlock={addContentBlockToTopic} />

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