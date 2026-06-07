import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Key, Mail, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import MathCaptcha from '../auth/MathCaptcha';
import { UserProfile } from '../../types';

interface LoginProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaExpected, setCaptchaExpected] = useState<number | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaValid) {
      setError("Please solve the security math captcha with the correct answer first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          captchaAnswer,
          _captchaExpected: captchaExpected, // pass expected to server for verification
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Authentication failed. Incorrect email or password.");
      }

      setSuccess(true);
      onLoginSuccess(result.user);

      // Flash success and route appropriately
      setTimeout(() => {
        if (result.user.role === 'admin' || result.user.email === 'hananirfan91@gmail.com') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1000);

    } catch (err: any) {
      setError(err.message || "An unexpected login error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article id="login-container" className="mx-auto max-w-sm px-4 py-20 transition-colors">
      <div className="bg-card-bg border border-border-custom px-6 py-8 rounded-2xl shadow-xl flex flex-col gap-5">
        
        {/* Title */}
        <div className="text-center">
          <h1 className="font-display text-2xl font-extrabold text-text-primary tracking-tight flex justify-center items-center gap-1.5 leading-none">
            <LogIn className="h-5 w-5 text-primary" />
            Sign In
          </h1>
          <h2 className="text-xs text-text-muted mt-2 font-display">
            Access your URH LABS workspace, credits, & speech logs.
          </h2>
        </div>

        {/* Action Form */}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          
          {/* Email input */}
          <div className="flex flex-col gap-1 text-xs font-semibold text-text-primary">
            <label className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-text-muted" />
              Registered Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@gmail.com"
              className="px-3 py-2 bg-dark-bg border border-border-custom rounded-lg mt-1 font-sans focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
            />
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1 text-xs font-semibold text-text-primary">
            <label className="flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-text-muted" />
              Secure Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="px-3 py-2 bg-dark-bg border border-border-custom rounded-lg mt-1 font-sans focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
            />
          </div>

          {/* Pure React Math CAPTCHA */}
          <MathCaptcha 
            id="login-captcha" 
            onVerify={(isValid, expected, actualValue) => {
              setCaptchaValid(isValid);
              setCaptchaExpected(expected);
              setCaptchaAnswer(actualValue);
            }} 
          />

          {/* Error notifications */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-[11px] text-red-100 font-medium leading-normal">
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          {/* Success indicators */}
          {success && (
            <div className="p-3 bg-secondary/15 border border-secondary/20 rounded-lg flex items-center gap-2 text-xs text-secondary">
              <CheckCircle2 className="h-4 w-4" />
              <span>Authentication secured. Entering workspace...</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !captchaValid}
            className={`w-full py-3 bg-primary hover:bg-[#574feb] text-white font-semibold text-xs border-0 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 mt-2 transition-all ${
              loading || !captchaValid ? 'opacity-50 cursor-not-allowed filter grayscale' : 'shadow-lg shadow-primary/20'
            }`}
          >
            {loading ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="h-3 w-3" />
                Sign In Securely
              </>
            )}
          </button>

          {/* Prompt route */}
          <div className="text-center font-display text-[11px] text-text-muted mt-2">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-semibold">
              Create Free Account
            </Link>
          </div>

        </form>
      </div>
    </article>
  );
}
