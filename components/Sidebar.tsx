
import React, { useState } from 'react';
import type { Topic } from '../types';

interface SidebarProps {
  topics: Topic[];
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ topics, selectedTopicId, onSelectTopic, isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white/60 backdrop-blur-xl border-r border-white/30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-sm font-semibold text-cyan-600 px-3 tracking-wider uppercase">Topics</h2>
          <button 
            onClick={onClose}
            className="md:hidden text-slate-600 hover:text-red-500 transition-colors"
            aria-label="Close navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="relative mb-4 flex-shrink-0">
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md text-sm bg-black/5 text-slate-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors placeholder:text-slate-500"
            aria-label="Search topics"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <nav className="flex-grow overflow-y-auto">
          <ul className="space-y-1">
            {filteredTopics.map(topic => (
              <li key={topic.id}>
                <button
                  onClick={() => onSelectTopic(topic.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ease-in-out font-medium ${
                    selectedTopicId === topic.id
                      ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-600 text-white shadow-lg'
                      : 'text-slate-700 hover:bg-black/5 hover:text-slate-900'
                  }`}
                >
                  {topic.title}
                </button>
              </li>
            ))}
             {filteredTopics.length === 0 && (
              <li className="px-3 py-2 text-sm text-slate-500 text-center">No topics found.</li>
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;