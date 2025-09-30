
import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import GuideLayout from './layouts/GuideLayout';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminGuideEditorPage from './pages/AdminGuideEditorPage';
import { socConcepts } from './data/socConcepts';
import { powershellGuide } from './data/powershellGuide';
import { auditGuide } from './data/auditGuide';
import { cardData as defaultCardData, icons } from './data/homeCards';
import { ContentType, type Topic, type HomeCard, type RawHomeCard } from './types';

const defaultGuides: Record<string, { title: string; topics: Topic[] }> = {
  soc: { title: "SOC Concepts Guide", topics: socConcepts },
  powershell: { title: "PowerShell Mastery", topics: powershellGuide },
  audit: { title: "Cybersecurity Auditing", topics: auditGuide },
};

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/home');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  });
  
  const [guides, setGuides] = useState<Record<string, { title: string; topics: Topic[] }>>(() => {
    const savedGuides = localStorage.getItem('guides');
    if (savedGuides) {
        try {
            const parsed = JSON.parse(savedGuides);
            if (typeof parsed === 'object' && parsed !== null) {
                return parsed;
            }
        } catch (e) {
            console.error("Failed to parse guides from localStorage, using defaults.", e);
        }
    }
    return defaultGuides;
  });

  const [rawHomeCards, setRawHomeCards] = useState<RawHomeCard[]>(() => {
    const savedCards = localStorage.getItem('rawHomeCards');
    if (savedCards) {
        try {
            const parsed = JSON.parse(savedCards);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            console.error("Failed to parse rawHomeCards from localStorage, using defaults.", e);
        }
    }
    return defaultCardData;
  });

  useEffect(() => {
    localStorage.setItem('guides', JSON.stringify(guides));
    localStorage.setItem('rawHomeCards', JSON.stringify(rawHomeCards));
  }, [guides, rawHomeCards]);

  useEffect(() => {
    sessionStorage.setItem('isLoggedIn', String(isLoggedIn));
  }, [isLoggedIn]);

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
    if (success) {
      setIsLoggedIn(true);
      window.location.hash = '#/admin/dashboard';
    }
  };

  const handleCreateGuide = (newCardData: Omit<RawHomeCard, 'status' | 'href'>) => {
    const newGuideId = newCardData.id;
    
    const newGuide: { title: string; topics: Topic[] } = {
      title: `${newCardData.title} Guide`,
      topics: [
        {
          id: 'intro',
          title: `Intro to ${newCardData.title}`,
          content: [
            { type: ContentType.HEADING2, text: `Welcome to the ${newCardData.title} Guide` },
            { type: ContentType.PARAGRAPH, text: 'This is a placeholder for your new guide. Use the editor to add topics.' }
          ]
        }
      ]
    };
    
    const newRawCard: RawHomeCard = {
      ...newCardData,
      status: 'Explore the guide',
      href: `#/guide/${newGuideId}`
    };

    setGuides(prev => ({ ...prev, [newGuideId]: newGuide }));
    setRawHomeCards(prev => [...prev, newRawCard]);
  };
  
  const handleAddNewTopic = (guideId: string, newTopic: { id: string; title: string }) => {
    setGuides(prevGuides => {
      const newGuides = { ...prevGuides };
      const guideToUpdate = newGuides[guideId];

      if (guideToUpdate) {
        const newTopicData: Topic = {
          id: newTopic.id,
          title: newTopic.title,
          content: [
            { type: ContentType.HEADING2, text: newTopic.title },
            { type: ContentType.PARAGRAPH, text: 'This is a new topic. Add your content here by editing the data files.' }
          ]
        };
        guideToUpdate.topics.push(newTopicData);
      }
      return newGuides;
    });
    alert(`Topic '${newTopic.title}' added to guide '${guideId}'!`);
  };


  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all guides to their default state? This cannot be undone.')) {
        localStorage.removeItem('guides');
        localStorage.removeItem('rawHomeCards');
        setGuides(defaultGuides);
        setRawHomeCards(defaultCardData);
        alert('Guides have been reset to default.');
    }
  };

  const homeCards: HomeCard[] = rawHomeCards.map(rawCard => ({
    ...rawCard,
    icon: icons[rawCard.id] || React.createElement('div', { className: "w-8 h-8 bg-white/20 rounded-lg" })
  }));

  if (route.startsWith('#/guide/')) {
    const guideKey = route.split('/')[2];
    const guide = guides[guideKey];
    if (guide) {
      return <GuideLayout guide={guide} />;
    } else {
      window.location.hash = '#/home';
      return null;
    }
  }
  
  if (route === '#/admin/login') {
    return <AdminLoginPage onLogin={handleLogin} />;
  }

  if (route === '#/admin/dashboard') {
    if (!isLoggedIn) {
      window.location.hash = '#/admin/login';
      return null;
    }
    return <AdminDashboardPage currentGuides={rawHomeCards} onCreateGuide={handleCreateGuide} onReset={handleReset} />;
  }

  if (route.startsWith('#/admin/edit/')) {
    if (!isLoggedIn) {
      window.location.hash = '#/admin/login';
      return null;
    }
    const guideId = route.split('/')[3];
    const guide = guides[guideId];
    if (!guide) {
      alert('Guide not found!');
      window.location.hash = '#/admin/dashboard';
      return null;
    }
    return <AdminGuideEditorPage guide={guide} guideId={guideId} onAddNewTopic={handleAddNewTopic} />;
  }

  return <HomePage homeCards={homeCards} />;
};

export default App;
