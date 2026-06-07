import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, AudioLines, ShieldAlert, LayoutDashboard, LogOut } from 'lucide-react';
import { UserProfile } from '../../types';

interface HeaderProps {
  user: UserProfile | null;
  onLogout: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function Header({ user, onLogout, theme, toggleTheme }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'AI Generator', path: '/tools' },
    { name: 'Pricing Plans', path: '/pricing' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const adminEmail = 'hananirfan91@gmail.com';

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-50 w-full border-b border-border-custom bg-dark-bg/85 backdrop-blur-md transition-colors"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          id="header-logo-link"
          to="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="p-2 bg-gradient-to-tr from-primary to-secondary rounded-lg text-[#0a0a0f]">
            <AudioLines className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-tight text-text-primary">
              URH LABS
            </span>
            <span className="font-mono text-[9px] text-[#00d9a6] font-semibold tracking-wider -mt-1">
              AI TTS PORTAL
            </span>
          </div>
        </Link>

        {/* Desktop Nav Routing Links */}
        <nav id="desktop-navbar" className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isLinkActive(link.path)
                  ? 'text-[#6c63ff] bg-primary/5 font-semibold'
                  : 'text-text-muted hover:text-text-primary hover:bg-border-custom/30'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Side Tools & User Profile Trigger */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Switcher Button */}
          <button
            id="theme-switcher-btn"
            type="button"
            onClick={toggleTheme}
            className="p-2 border border-border-custom rounded-lg bg-card-bg/60 text-text-muted hover:text-text-primary hover:bg-border-custom/50 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* User auth layout state */}
          {user ? (
            <div className="flex items-center gap-2 border-l border-border-custom pl-3">
              {/* Badge according to Role */}
              {user.email === adminEmail ? (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-full transition-colors"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Admin Panel
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-full transition-colors"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
              )}

              {/* Status Plan Indicator */}
              <span className="font-mono text-[10px] text-text-muted font-normal block max-w-[120px] truncate">
                {user.name || user.email} ({user.role === 'customer' ? 'Premium' : user.role === 'admin' ? 'Owner' : 'Free'})
              </span>

              {/* Logout */}
              <button
                type="button"
                onClick={onLogout}
                className="p-2 bg-transparent text-text-muted hover:text-red-400 border-0 cursor-pointer transition-colors"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 border-l border-border-custom pl-3">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 text-sm font-semibold bg-primary hover:bg-[#574feb] text-white rounded-lg shadow-sm transition-all shadow-primary/20"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navbar Controls */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 border border-border-custom rounded-lg bg-card-bg/60 text-text-muted cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Hamburger button */}
          <button
            id="mobile-menu-trigger"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-border-custom rounded-lg bg-card-bg/60 text-text-muted hover:text-text-primary transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div id="mobile-drawer" className="md:hidden border-t border-border-custom bg-dark-bg p-4 flex flex-col gap-3">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isLinkActive(link.path)
                    ? 'text-primary bg-primary/5 font-semibold'
                    : 'text-text-muted hover:text-text-primary hover:bg-border-custom/30'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="border-t border-border-custom/50 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3 py-1 flex flex-col">
                  <span className="text-xs font-semibold text-text-primary truncate">{user.name || user.email}</span>
                  <span className="text-[10px] text-text-muted capitalize">Tier Plan: {user.role === 'customer' ? 'Premium customer' : user.role === 'admin' ? 'System Administrator' : 'Free tier'}</span>
                </div>
                {user.email === adminEmail ? (
                  <Link
                    to="/admin"
                    onClick={handleLinkClick}
                    className="flex items-center justify-center gap-2 p-2.5 text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/20 rounded-md"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={handleLinkClick}
                    className="flex items-center justify-center gap-2 p-2.5 text-sm font-semibold bg-primary/10 text-primary border border-primary/20 rounded-md"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    User Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleLinkClick();
                    onLogout();
                  }}
                  className="flex items-center justify-center gap-2 p-2.5 text-sm font-semibold text-text-muted hover:text-red-400 bg-border-custom/20 rounded-md border-0 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-1">
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="w-full text-center p-2.5 rounded-lg text-sm font-medium text-text-muted border border-border-custom hover:bg-card-bg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={handleLinkClick}
                  className="w-full text-center p-2.5 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-[#574feb] shadow-sm transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
