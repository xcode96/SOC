import React from 'react';
import type { Topic } from '../types';

interface SidebarProps {
  topics: Topic[];
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ topics, selectedTopicId, onSelectTopic, isOpen, onClose }) => {
  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white/60 backdrop-blur-xl border-r border-white/30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex-shrink-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
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
        <nav>
          <ul className="space-y-1">
            {topics.map(topic => (
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
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;