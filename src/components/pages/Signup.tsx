import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Key, User, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import MathCaptcha from '../auth/MathCaptcha';
import { UserProfile } from '../../types';

interface SignupProps {
  onSignupSuccess: (user: UserProfile) => void;
}

export default function Signup({ onSignupSuccess }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [captchaExpected, setCaptchaExpected] = useState<number | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }
    if (!captchaValid) {
      setError("Please solve the security captcha with the correct math answer first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
          captchaAnswer,
          _captchaExpected: captchaExpected,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create user account.");
      }

      setSuccess(true);
      onSignupSuccess(result.user);

      setTimeout(() => {
        navigate('/tools');
      }, 1000);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article id="signup-container" className="mx-auto max-w-sm px-4 py-16 transition-colors">
      <div className="bg-card-bg border border-border-custom px-6 py-8 rounded-2xl shadow-xl flex flex-col gap-5">
        
        {/* Title */}
        <div className="text-center">
          <h1 className="font-display text-2xl font-extrabold text-text-primary tracking-tight flex justify-center items-center gap-1.5 leading-none">
            <UserPlus className="h-5 w-5 text-primary" />
            Sign Up
          </h1>
          <h2 className="text-xs text-text-muted mt-2 font-display">
            Create an account to track speech logs histories and daily limit resets.
          </h2>
        </div>

        {/* Action Form */}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          
          {/* Full Name */}
          <div className="flex flex-col gap-1 text-xs font-semibold text-text-primary">
            <label className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-text-muted" />
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Irfan Hanan"
              className="px-3 py-2 bg-dark-bg border border-border-custom rounded-lg mt-1 font-sans focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
            />
          </div>

          {/* Email */}
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
              placeholder="yourname@gmail.com"
              className="px-3 py-2 bg-dark-bg border border-border-custom rounded-lg mt-1 font-sans focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 text-xs font-semibold text-text-primary">
            <label className="flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-text-muted" />
              Password (min 8 chars)
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

          {/* Confirm Password */}
          <div className="flex flex-col gap-1 text-xs font-semibold text-text-primary">
            <label className="flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-text-muted" />
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="px-3 py-2 bg-dark-bg border border-border-custom rounded-lg mt-1 font-sans focus:outline-none focus:ring-1 focus:ring-primary text-sm font-medium"
            />
          </div>

          {/* Captcha */}
          <MathCaptcha 
            id="signup-captcha" 
            onVerify={(isValid, expected, actualValue) => {
              setCaptchaValid(isValid);
              setCaptchaExpected(expected);
              setCaptchaAnswer(actualValue);
            }} 
          />

          {/* Errors display */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-[11px] text-red-100 font-medium leading-normal">
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="p-3 bg-secondary/15 border border-secondary/20 rounded-lg flex items-center gap-2 text-xs text-secondary">
              <CheckCircle2 className="h-4 w-4" />
              <span>Register completed! Deploying free account workspace indicators...</span>
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
                <UserPlus className="h-3 w-3" />
                Create Account Securely
              </>
            )}
          </button>

          {/* Route link templates */}
          <div className="text-center font-display text-[11px] text-text-muted mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Sign In Instead
            </Link>
          </div>

        </form>
      </div>
    </article>
  );
}
