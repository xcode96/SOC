

import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import GuideLayout from './layouts/GuideLayout';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminGuideEditorPage from './pages/AdminGuideEditorPage';
import { cardData as defaultCardData, icons } from './data/homeCards';
import { socConcepts } from './data/socConcepts';
import { powershellGuide } from './data/powershellGuide';
import { auditGuide } from './data/auditGuide';
// Fix: Import ContentType as a value, and other identifiers as types.
import { ContentType } from './types';
import type { Topic, HomeCard, RawHomeCard } from './types';

// Data structure to hold all guides
const initialGuideData: Record<string, { title: string; topics: Topic[] }> = {
  soc: { title: 'SOC Concepts Interactive Guide', topics: socConcepts },
  powershell: { title: 'PowerShell Interactive Guide', topics: powershellGuide },
  audit: { title: 'Auditing Interactive Guide', topics: auditGuide },
};

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [homeCards, setHomeCards] = useState<RawHomeCard[]>(() => {
    try {
      const savedCards = localStorage.getItem('homeCards');
      return savedCards ? JSON.parse(savedCards) : defaultCardData;
    } catch (error) {
      console.error("Failed to parse homeCards from localStorage", error);
      return defaultCardData;
    }
  });

  const [dynamicGuideData, setDynamicGuideData] = useState(() => {
     try {
      const savedGuides = localStorage.getItem('guideData');
      return savedGuides ? JSON.parse(savedGuides) : initialGuideData;
    } catch (error)
    {
      console.error("Failed to parse guideData from localStorage", error);
      return initialGuideData;
    }
  });

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleLogin = (success: boolean) => {
    setIsLoggedIn(success);
    if (success) {
      window.location.hash = '#/admin/dashboard';
    }
  };

  const handleCreateGuide = (newCard: Omit<RawHomeCard, 'status' | 'href'>) => {
    const newFullCard: RawHomeCard = {
      ...newCard,
      status: 'Explore the guide',
      href: `#/guide/${newCard.id}`,
    };
    const updatedCards = [...homeCards, newFullCard];
    setHomeCards(updatedCards);
    localStorage.setItem('homeCards', JSON.stringify(updatedCards));

    const newGuide = {
      title: `${newCard.title} Interactive Guide`,
      topics: [{
        id: 'toc',
        title: `Welcome to ${newCard.title}`,
        content: [
          { type: ContentType.HEADING2, text: `Welcome to the ${newCard.title} Guide`},
          { type: ContentType.PARAGRAPH, text: 'This is a new guide. Start adding topics!'}
        ]
      }]
    };
    const updatedGuides = {...dynamicGuideData, [newCard.id]: newGuide };
    setDynamicGuideData(updatedGuides);
    localStorage.setItem('guideData', JSON.stringify(updatedGuides));
  };
  
  const handleAddNewTopic = (guideId: string, newTopic: { id: string; title: string }) => {
    const guideToUpdate = dynamicGuideData[guideId];
    if (guideToUpdate) {
        const newTopicData: Topic = {
            ...newTopic,
            content: [
                 { type: ContentType.HEADING2, text: newTopic.title },
                 { type: ContentType.PARAGRAPH, text: 'Content for this topic is coming soon.'}
            ]
        };
        const updatedTopics = [...guideToUpdate.topics, newTopicData];
        const updatedGuide = { ...guideToUpdate, topics: updatedTopics };
        const updatedGuides = { ...dynamicGuideData, [guideId]: updatedGuide };
        setDynamicGuideData(updatedGuides);
        localStorage.setItem('guideData', JSON.stringify(updatedGuides));
    }
  };

  const handleReset = () => {
    localStorage.removeItem('homeCards');
    localStorage.removeItem('guideData');
    setHomeCards(defaultCardData);
    setDynamicGuideData(initialGuideData);
    window.location.hash = '#/admin/dashboard';
  };

  const renderPage = () => {
    const path = route.split('/');
    
    if (path[1] === 'guide' && path[2] && dynamicGuideData[path[2]]) {
      const guideId = path[2];
      return <GuideLayout guide={dynamicGuideData[guideId]} />;
    }
    
    if (path[1] === 'admin') {
      if (path[2] === 'login') {
        return <AdminLoginPage onLogin={handleLogin} />;
      }
      if (isLoggedIn) {
        if (path[2] === 'dashboard') {
          return <AdminDashboardPage currentGuides={homeCards} onCreateGuide={handleCreateGuide} onReset={handleReset} />;
        }
        if (path[2] === 'edit' && path[3] && dynamicGuideData[path[3]]) {
          const guideId = path[3];
          return <AdminGuideEditorPage guide={dynamicGuideData[guideId]} guideId={guideId} onAddNewTopic={handleAddNewTopic} />;
        }
      }
       // Redirect to login if not logged in and trying to access a protected admin page
      window.location.hash = '#/admin/login';
      return <AdminLoginPage onLogin={handleLogin} />;
    }

    const cardsWithIcons: HomeCard[] = homeCards.map(card => ({
      ...card,
      icon: icons[card.id] || icons.soc,
    }));
    return <HomePage homeCards={cardsWithIcons} />;
  };

  return <div className="h-full bg-gradient-to-br from-fuchsia-900 via-slate-900 to-sky-900 font-sans text-slate-200">{renderPage()}</div>;
};

export default App;