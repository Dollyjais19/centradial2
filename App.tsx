
import React, { useState, useEffect } from 'react';
import { User, AnalysisResult, TrustedContact } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Analyzer from './components/Analyzer';
import TimerOverlay from './components/TimerOverlay';
import WhatsAppPopup from './components/WhatsAppPopup';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'analyzer' | 'dashboard'>('home');
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isWAPopupOpen, setIsWAPopupOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    const currentUsername = localStorage.getItem('centradial_current_user');
    if (currentUsername) {
      const savedUser = localStorage.getItem(`centradial_user_${currentUsername}`);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const handleLogin = (username: string) => {
    const storageKey = `centradial_user_${username}`;
    const savedData = localStorage.getItem(storageKey);
    
    let userObj: User;
    if (savedData) {
      userObj = JSON.parse(savedData);
    } else {
      userObj = {
        username,
        trustedContacts: [], 
        scores: {
          emotionalAwareness: 85,
          scamResistance: 78,
          decisionStability: 92
        }
      };
    }
    
    setUser(userObj);
    localStorage.setItem('centradial_current_user', username);
    localStorage.setItem(storageKey, JSON.stringify(userObj));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('centradial_current_user');
    setView('home');
  };

  const updateContacts = (contacts: TrustedContact[]) => {
    if (!user) return;
    const updatedUser = { ...user, trustedContacts: contacts };
    setUser(updatedUser);
    localStorage.setItem(`centradial_user_${user.username}`, JSON.stringify(updatedUser));
  };

  const triggerActionWithTimer = (action: () => void) => {
    setPendingAction(() => action);
    setIsTimerOpen(true);
  };

  const handleWhatsAppAction = () => {
    if (!user || user.trustedContacts.length === 0) {
      alert("Please add a trusted contact in your Dashboard first to use this safety feature.");
      setView('dashboard');
      return;
    }
    setIsWAPopupOpen(true);
  };

  const finalizeWhatsApp = (phone: string, message: string) => {
    setIsWAPopupOpen(false);
    if (phone) {
      window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen flex flex-col selection:bg-aura-green selection:text-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-aura-sage px-6 md:px-12 py-5 flex justify-between items-center sticky top-0 z-40 shadow-sm/50 backdrop-blur-md">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
          <div className="w-10 h-10 bg-aura-green rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
            <span className="text-white text-lg font-bold">C</span>
          </div>
          <span className="font-heading font-semibold text-aura-green text-xl tracking-tight">CentraDial</span>
        </div>
        <div className="flex gap-8 items-center">
          <button 
            onClick={() => setView('analyzer')}
            className={`text-xs font-bold uppercase tracking-widest transition-all ${view === 'analyzer' ? 'text-aura-green' : 'text-gray-400 hover:text-aura-green'}`}
          >
            Safe Scan
          </button>
          <button 
            onClick={() => setView('dashboard')}
            className={`text-xs font-bold uppercase tracking-widest transition-all ${view === 'dashboard' ? 'text-aura-green' : 'text-gray-400 hover:text-aura-green'}`}
          >
            Stability
          </button>
          <button onClick={handleLogout} className="p-2 text-gray-300 hover:text-red-400 transition-colors rounded-xl hover:bg-red-50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 bg-[#FDFBF7]">
        {view === 'home' && (
          <div className="max-w-4xl mx-auto py-24 px-6 text-center fade-in">
            <h1 className="text-5xl md:text-6xl font-heading font-semibold text-aura-green mb-8 leading-[1.15]">Your Emotional Safety <br/> is Our Priority</h1>
            <p className="text-lg md:text-xl text-gray-500 mb-14 max-w-2xl mx-auto font-light leading-relaxed">
              A gentle AI companion designed to help you recognize manipulation and scam patterns before you take impulsive actions.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <button 
                onClick={() => setView('analyzer')}
                className="bg-aura-green text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-aura-green/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Start New Scan
              </button>
              <button 
                onClick={() => setView('dashboard')}
                className="bg-white text-aura-green border border-aura-sage px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-aura-sage/10 transition-all shadow-sm"
              >
                Growth Tracker
              </button>
            </div>
          </div>
        )}

        {view === 'analyzer' && (
          <Analyzer 
            user={user} 
            onAction={triggerActionWithTimer} 
            onWhatsApp={handleWhatsAppAction}
          />
        )}

        {view === 'dashboard' && (
          <Dashboard user={user} updateContacts={updateContacts} />
        )}
      </main>

      {/* Modals */}
      {isTimerOpen && (
        <TimerOverlay 
          onComplete={() => {
            setIsTimerOpen(false);
            if (pendingAction) pendingAction();
          }}
          onCancel={() => {
            setIsTimerOpen(false);
            setPendingAction(null);
          }}
        />
      )}

      {isWAPopupOpen && (
        <WhatsAppPopup 
          user={user}
          onSelect={finalizeWhatsApp} 
          onClose={() => setIsWAPopupOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
