import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import GuideLayout from './layouts/GuideLayout';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminGuideEditorPage from './pages/AdminGuideEditorPage';
import { cardData as defaultCardData } from './data/homeCards';
import { socConcepts } from './data/socConcepts';
import { powershellGuide } from './data/powershellGuide';
import { auditGuide } from './data/auditGuide';
// Fix: Import ContentType as a value, and other identifiers as types.
import { ContentType } from './types';
import type { Topic, RawHomeCard, AdminUser } from './types';

// Data structure to hold all guides
const initialGuideData: Record<string, { title: string; topics: Topic[] }> = {
  soc: { title: 'SOC Concepts Interactive Guide', topics: socConcepts },
  powershell: { title: 'PowerShell Interactive Guide', topics: powershellGuide },
  audit: { title: 'Auditing Interactive Guide', topics: auditGuide },
};

const defaultAdminUsers: AdminUser[] = [
    { username: 'admin', password: 'password' },
    { username: 'dq.adm', password: 'password' },
];

const hardcodedDefaultData = {
  homeCards: defaultCardData,
  guideData: initialGuideData,
  adminUsers: defaultAdminUsers,
};

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash || '#/home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [defaultData, setDefaultData] = useState<typeof hardcodedDefaultData | null>(null);
  
  const [homeCards, setHomeCards] = useState<RawHomeCard[]>([]);
  const [dynamicGuideData, setDynamicGuideData] = useState<Record<string, { title: string; topics: Topic[] }>>({});
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    const loadDefaultData = async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error('data.json not found, using hardcoded fallback.');
        }
        const externalData = await response.json();
        // Basic validation
        if (externalData.homeCards && externalData.guideData && externalData.adminUsers) {
          setDefaultData(externalData);
        } else {
          console.error('Invalid data.json structure, using hardcoded fallback.');
          setDefaultData(hardcodedDefaultData);
        }
      } catch (error) {
        console.log((error as Error).message);
        setDefaultData(hardcodedDefaultData);
      }
    };
    loadDefaultData();
  }, []);

  useEffect(() => {
    if (defaultData) {
      try {
        const savedCards = localStorage.getItem('homeCards');
        setHomeCards(savedCards ? JSON.parse(savedCards) : defaultData.homeCards);

        const savedGuides = localStorage.getItem('guideData');
        setDynamicGuideData(savedGuides ? JSON.parse(savedGuides) : defaultData.guideData);

        const savedUsers = localStorage.getItem('adminUsers');
        setAdminUsers(savedUsers ? JSON.parse(savedUsers) : defaultData.adminUsers);
      } catch (error) {
        console.error("Failed to parse from localStorage, using defaults", error);
        setHomeCards(defaultData.homeCards);
        setDynamicGuideData(defaultData.guideData);
        setAdminUsers(defaultData.adminUsers);
      }
      setIsInitializing(false);
    }
  }, [defaultData]);


  useEffect(() => {
    // Only run login check once data has been initialized.
    if (isInitializing || !adminUsers.length) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    // If a code is present, attempt to log in.
    if (code) {
      const userExists = adminUsers.some(user => user.username.toLowerCase() === code.trim().toLowerCase());
      if (userExists) {
        setIsLoggedIn(true);
        // Redirect to admin dashboard
        window.location.hash = '#/admin/dashboard';
        // Clean the URL by removing the query parameter
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
      }
    }
  }, [adminUsers, isInitializing]);

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

  const handleCreateComingSoonCard = (newCard: Omit<RawHomeCard, 'status' | 'href'>) => {
    const newFullCard: RawHomeCard = {
      ...newCard,
      status: 'Coming Soon',
      href: '#', // Inactive link
    };
    const updatedCards = [...homeCards, newFullCard];
    setHomeCards(updatedCards);
    localStorage.setItem('homeCards', JSON.stringify(updatedCards));
    // No guide data is created for "Coming Soon" cards
  };
  
  const handleUpdateCard = (updatedCard: RawHomeCard) => {
    let guideDataToUpdate = { ...dynamicGuideData };
    const originalCard = homeCards.find(c => c.id === updatedCard.id);

    // If a "Coming Soon" card is being promoted to an active guide
    if (originalCard && originalCard.status === 'Coming Soon' && updatedCard.status !== 'Coming Soon') {
      // and if the guide data doesn't exist yet
      if (!guideDataToUpdate[updatedCard.id]) {
        // Create the basic guide structure
        guideDataToUpdate[updatedCard.id] = {
          title: `${updatedCard.title} Interactive Guide`,
          topics: [{
            id: 'toc',
            title: `Welcome to ${updatedCard.title}`,
            content: [
              { type: ContentType.HEADING2, text: `Welcome to the ${updatedCard.title} Guide`},
              { type: ContentType.PARAGRAPH, text: 'This is a new guide. Start adding topics!'}
            ]
          }]
        };
        // Update guide data state and localStorage
        setDynamicGuideData(guideDataToUpdate);
        localStorage.setItem('guideData', JSON.stringify(guideDataToUpdate));
      }
      // Make sure the link is active
      updatedCard.href = `#/guide/${updatedCard.id}`;
    } else if (updatedCard.status === 'Coming Soon') {
        // If it's being set (or re-set) to Coming Soon, deactivate the link
        updatedCard.href = '#';
    }

    const updatedCards = homeCards.map(card => card.id === updatedCard.id ? updatedCard : card);
    setHomeCards(updatedCards);
    localStorage.setItem('homeCards', JSON.stringify(updatedCards));
  };
  
  const handleDeleteCard = (cardIdToDelete: string) => {
    // Remove the card
    const updatedCards = homeCards.filter(card => card.id !== cardIdToDelete);
    setHomeCards(updatedCards);
    localStorage.setItem('homeCards', JSON.stringify(updatedCards));

    // Remove the associated guide data if it exists
    if (dynamicGuideData[cardIdToDelete]) {
      const { [cardIdToDelete]: _, ...remainingGuides } = dynamicGuideData;
      setDynamicGuideData(remainingGuides);
      localStorage.setItem('guideData', JSON.stringify(remainingGuides));
    }
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
  
  const handleUpdateGuide = (guideId: string, newGuideData: { title: string; topics: Topic[] }) => {
    // Update the guide data itself
    const updatedGuides = { ...dynamicGuideData, [guideId]: newGuideData };
    setDynamicGuideData(updatedGuides);
    localStorage.setItem('guideData', JSON.stringify(updatedGuides));

    // Update the corresponding home card's title.
    const newCardTitle = newGuideData.title.replace(' Interactive Guide', '').replace(' Guide', '');
    const updatedCards = homeCards.map(card => 
        card.id === guideId ? { ...card, title: newCardTitle } : card
    );
    setHomeCards(updatedCards);
    localStorage.setItem('homeCards', JSON.stringify(updatedCards));
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
            onCreateComingSoonCard={handleCreateComingSoonCard}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
            adminUsers={adminUsers}
            onAddUser={handleAddUser}
            onDeleteUser={handleDeleteUser}
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
          onUpdateGuide={handleUpdateGuide}
        />;
      }

      // If a logged-in user hits an invalid admin route (e.g., /admin/foo), redirect them to their dashboard.
      window.location.hash = '#/admin/dashboard';
      return null;
    }

    // Default to home page
    return <HomePage homeCards={homeCards} />;
  };

  if (isInitializing) {
    return <div className="h-full bg-slate-900" />; // Render a blank screen during initialization
  }

  return <div className="h-full bg-gradient-to-br from-fuchsia-900 via-slate-900 to-sky-900 font-sans text-slate-200">{renderPage()}</div>;
};

export default App;