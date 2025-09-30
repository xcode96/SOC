
import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import GuideLayout from './layouts/GuideLayout';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
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
    try {
      return savedGuides ? JSON.parse(savedGuides) : defaultGuides;
    } catch (e) {
      console.error("Failed to parse guides from localStorage", e);
      return defaultGuides;
    }
  });

  const [rawHomeCards, setRawHomeCards] = useState<RawHomeCard[]>(() => {
    const savedCards = localStorage.getItem('rawHomeCards');
    try {
      return savedCards ? JSON.parse(savedCards) : defaultCardData;
    } catch (e) {
      console.error("Failed to parse rawHomeCards from localStorage", e);
      return defaultCardData;
    }
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
            { type: ContentType.PARAGRAPH, text: 'This is a placeholder for your new guide. You can edit the content in the source files.' }
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

  const handleReset = () => {
    localStorage.removeItem('guides');
    localStorage.removeItem('rawHomeCards');
    setGuides(defaultGuides);
    setRawHomeCards(defaultCardData);
    alert('Guides have been reset to default.');
  };

  // Dynamically construct the full HomeCard objects with icons for rendering.
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

  return <HomePage homeCards={homeCards} />;
};

export default App;