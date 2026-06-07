import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout Controls
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Public Page views
import Home from './components/pages/Home';
import Tools from './components/pages/Tools';
import Pricing from './components/pages/Pricing';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Terms from './components/pages/Terms';
import Privacy from './components/pages/Privacy';

// Auth views
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';

// Protected views
import Dashboard from './components/pages/Dashboard';
import Admin from './components/pages/Admin';

import { UserProfile } from './types';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Synchronize HTML tag configuration on theme change
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Audit active user session on boot
    fetch('/api/auth/me')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        }
      })
      .catch((err) => {
        console.warn("Session check offline fallback:", err);
      })
      .finally(() => {
        setAuthChecking(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (err) {
      console.error("Logout issue:", err);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#07070d] text-text-primary flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="font-mono text-xs text-text-muted mt-2 tracking-widest animate-pulse">
            BOOTING URH SPEECH ENGINE...
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div id="saas-app" className="min-h-screen bg-dark-bg text-text-primary flex flex-col justify-between font-sans selection:bg-primary/30 selection:text-white">
        
        {/* Unified standard Top nav header */}
        <Header user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />

        {/* Master central viewport router */}
        <main id="app-viewport" className="flex-grow w-full relative">
          <Routes>
            
            {/* Public screens */}
            <Route path="/" element={<Home user={user} />} />
            <Route path="/tools" element={<Tools user={user} />} />
            <Route path="/pricing" element={<Pricing user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Auth controllers */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={(u) => setUser(u)} />} 
            />
            <Route 
              path="/signup" 
              element={user ? <Navigate to="/tools" replace /> : <Signup onSignupSuccess={(u) => setUser(u)} />} 
            />

            {/* Protected dashboard and admin */}
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" replace />} 
            />
            
            <Route 
              path="/admin" 
              element={
                user && (user.role === 'admin' || user.email === 'hananirfan91@gmail.com') 
                  ? <Admin user={user} /> 
                  : <Navigate to="/login" replace />
              } 
            />

            {/* Fallback switchbacks redirecting back */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>

        {/* Unified structural base Footer copyright maps */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}
