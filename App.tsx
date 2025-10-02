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
import type { Topic, HomeCard, RawHomeCard, AdminUser } from './types';

// Data structure to hold all guides
const initialGuideData: Record<string, { title: string; topics: Topic[] }> = {
  soc: { title: 'SOC Concepts Interactive Guide', topics: socConcepts },
  powershell: { title: 'PowerShell Interactive Guide', topics: powershellGuide },
  audit: { title: 'Auditing Interactive Guide', topics: auditGuide },
};

const defaultAdminUsers: AdminUser[] = [
    { username: 'admin' },
    { username: 'dq.adm' },
];

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

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const savedUsers = localStorage.getItem('adminUsers');
      return savedUsers ? JSON.parse(savedUsers) : defaultAdminUsers;
    } catch (error) {
      console.error("Failed to parse adminUsers from localStorage", error);
      return defaultAdminUsers;
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

  const handleUpdateTopic = (guideId: string, originalTopicId: string, updatedTopic: Topic) => {
    const guideToUpdate = dynamicGuideData[guideId];
    if (guideToUpdate) {
      const updatedTopics = guideToUpdate.topics.map(topic =>
        topic.id === originalTopicId ? updatedTopic : topic
      );
      const updatedGuide = { ...guideToUpdate, topics: updatedTopics };
      const updatedGuides = { ...dynamicGuideData, [guideId]: updatedGuide };
      setDynamicGuideData(updatedGuides);
      localStorage.setItem('guideData', JSON.stringify(updatedGuides));
    }
  };

  const handleDeleteTopic = (guideId: string, topicIdToDelete: string) => {
    const guideToUpdate = dynamicGuideData[guideId];
    if (guideToUpdate) {
      const updatedTopics = guideToUpdate.topics.filter(topic => topic.id !== topicIdToDelete);
      const updatedGuide = { ...guideToUpdate, topics: updatedTopics };
      const updatedGuides = { ...dynamicGuideData, [guideId]: updatedGuide };
      setDynamicGuideData(updatedGuides);
      localStorage.setItem('guideData', JSON.stringify(updatedGuides));
    }
  };


  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all guides and users to their default state? This action is permanent.')) {
        localStorage.removeItem('homeCards');
        localStorage.removeItem('guideData');
        localStorage.removeItem('adminUsers');
        setHomeCards(defaultCardData);
        setDynamicGuideData(initialGuideData);
        setAdminUsers(defaultAdminUsers);
        window.location.hash = '#/admin/dashboard';
    }
  };

  const handleAddUser = (newUser: AdminUser) => {
    const updatedUsers = [...adminUsers, newUser];
    setAdminUsers(updatedUsers);
    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
  };

  const handleDeleteUser = (usernameToDelete: string) => {
    if (adminUsers.length <= 1) {
      alert('Cannot delete the last admin user.');
      return;
    }
    const updatedUsers = adminUsers.filter(user => user.username !== usernameToDelete);
    setAdminUsers(updatedUsers);
    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
  };
  
  const handleExportData = () => {
    const dataToExport = {
      homeCards,
      guideData: dynamicGuideData,
      adminUsers
    };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'soc-guide-data-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const renderPage = () => {
    const path = route.split('/');
    
    // Guide page route
    if (path[1] === 'guide' && path[2] && dynamicGuideData[path[2]]) {
      const guideId = path[2];
      return <GuideLayout guide={dynamicGuideData[guideId]} />;
    }
    
    // Admin routes
    if (path[1] === 'admin') {
      // The login page is accessible to everyone.
      if (path[2] === 'login') {
        return <AdminLoginPage onLogin={handleLogin} validUsers={adminUsers} />;
      }
      
      // All other admin routes are protected.
      if (!isLoggedIn) {
        // If not logged in, redirect to the login page and render nothing this cycle.
        // The hash change will trigger a re-render with the correct login page route.
        window.location.hash = '#/admin/login';
        return null; 
      }
      
      // From here on, we know the user is logged in.
      if (path[2] === 'dashboard') {
        return <AdminDashboardPage 
            currentGuides={homeCards} 
            onCreateGuide={handleCreateGuide} 
            onReset={handleReset} 
            adminUsers={adminUsers}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
            onExportData={handleExportData}
        />;
      }
      
      if (path[2] === 'edit' && path[3] && dynamicGuideData[path[3]]) {
        const guideId = path[3];
        return <AdminGuideEditorPage 
          guide={dynamicGuideData[guideId]} 
          guideId={guideId} 
          onAddNewTopic={handleAddNewTopic}
          onUpdateTopic={handleUpdateTopic}
          onDeleteTopic={handleDeleteTopic}
        />;
      }

      // If a logged-in user hits an invalid admin route (e.g., /admin/foo), redirect them to their dashboard.
      window.location.hash = '#/admin/dashboard';
      return null;
    }

    // Default to home page
    const cardsWithIcons: HomeCard[] = homeCards.map(card => ({
      ...card,
      icon: icons[card.id] || icons.soc,
    }));
    return <HomePage homeCards={cardsWithIcons} />;
  };

  return <div className="h-full bg-gradient-to-br from-fuchsia-900 via-slate-900 to-sky-900 font-sans text-slate-200">{renderPage()}</div>;
};

export default App;