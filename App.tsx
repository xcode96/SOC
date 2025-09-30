
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ContentDisplay from './components/ContentDisplay';
import ScrollToTopButton from './components/ScrollToTopButton';
import { socConcepts } from './data/socConcepts';
import type { Topic } from './types';

const App: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(socConcepts[0].id);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mainContentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [selectedTopicId]);
  
  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setIsSidebarOpen(false); // Close sidebar on topic selection
  };

  const handleScroll = () => {
    if (mainContentRef.current) {
      setShowScrollButton(mainContentRef.current.scrollTop > 300);
    }
  };

  const scrollToTop = () => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const selectedTopic = socConcepts.find(t => t.id === selectedTopicId) || socConcepts[0];

  return (
    <div className="h-full opacity-0 animate-fade-in will-change-transform-opacity">
      <div className="flex h-full bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden relative">
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <Sidebar 
          topics={socConcepts}
          selectedTopicId={selectedTopicId}
          onSelectTopic={handleSelectTopic}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden bg-white/80">
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main 
            ref={mainContentRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10"
          >
            <ContentDisplay topic={selectedTopic} />
            <footer className="mt-12 pt-8 border-t border-slate-300/50 text-center text-xs text-slate-500">
              <p>&copy; {new Date().getFullYear()} Interactive Guide. All rights reserved.</p>
            </footer>
          </main>
          {showScrollButton && <ScrollToTopButton onClick={scrollToTop} />}
        </div>
      </div>
    </div>
  );
};

export default App;
