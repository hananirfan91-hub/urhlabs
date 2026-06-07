import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, Mic, Languages, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';
import { UserProfile } from '../../types';

interface TTSFormProps {
  user: UserProfile | null;
  onGenerateSuccess: (data: { audioUrl: string; downloadUrl: string; text: string; voice_type?: 'male' | 'female' | 'zainab' | 'sarah' | 'asif' | 'john' | 'ayesha' }) => void;
}

export default function TTSForm({ user, onGenerateSuccess }: TTSFormProps) {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState<'ur' | 'en'>('ur');
  const [voice, setVoice] = useState<'male' | 'female' | 'zainab' | 'sarah' | 'asif' | 'john' | 'ayesha'>('zainab');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dailyUsageRem, setDailyUsageRem] = useState<number | null>(null);

  // Character limit calculations depends on subscription role tier
  const isPremium = user?.role === 'customer' || user?.role === 'admin';
  const MAX_CHARS = isPremium ? 5000 : 500;

  // Urdu sample and English sample strings for quick click testing
  const sampleTextUr = "یو آر ایچ لیبز ایک جدید ترین مصنوعی ذہانت کی آواز پیدا کرنے والا پلیٹ فارم ہے۔ یہاں آپ اردو اور انگریزی تحریر کو سیکنڈوں میں قدرتی اور انسانی آواز میں تبدیل کر سکتے ہیں۔";
  const sampleTextEn = "Welcome to URH LABS – the advanced AI Text to Speech Platform. You can translate and convert any written English or Urdu script into clear, native-sounding human-like vocal files within seconds.";

  useEffect(() => {
    // Reset limits and fetch standard status variables if user logged in
    if (user) {
      if (user.role === 'customer') {
        setDailyUsageRem(user.credits);
      } else if (user.role === 'user') {
        fetch('/api/logs')
          .then(res => res.json())
          .then(data => {
            if (data.logs) {
              const todayStr = new Date().toISOString().substring(0, 10);
              const todayCount = data.logs.filter((l: any) => l.created_at.startsWith(todayStr)).length;
              setDailyUsageRem(Math.max(0, 3 - todayCount));
            }
          })
          .catch(() => {});
      }
    }
  }, [user, success]);

  const useSample = (lang: 'ur' | 'en') => {
    setLanguage(lang);
    setText(lang === 'ur' ? sampleTextUr : sampleTextEn);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please input some text to convert.");
      return;
    }
    if (text.length > MAX_CHARS) {
      setError(`Paragraph exceeds the limit of ${MAX_CHARS} characters for your account tier.`);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          language,
          voice,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Speech synthesis failed. Please ensure standard connection is safe.");
      }

      setSuccess(true);
      // Remnants count adjusting
      if (result.remainingCredits !== null) {
        setDailyUsageRem(result.remainingCredits);
      } else if (dailyUsageRem !== null && !isPremium) {
        setDailyUsageRem(prev => (prev !== null ? Math.max(0, prev - 1) : 0));
      }

      onGenerateSuccess({
        audioUrl: result.audioUrl,
        downloadUrl: result.downloadUrl,
        text: text.trim(),
        voice_type: voice
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong during conversion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="tts-input-board" className="w-full bg-card-bg border border-border-custom px-5 py-6 rounded-2xl shadow-xl transition-all">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Selection bar configurations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Language Selector */}
          <div className="flex flex-col gap-2">
            <label htmlFor="language-select" className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <Languages className="h-4 w-4 text-primary" />
              1. Select Language
            </label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setLanguage('ur')}
                className={`py-2 px-3 text-sm font-medium rounded-lg border cursor-pointer transition-all ${
                  language === 'ur'
                    ? 'border-primary bg-primary/10 text-primary font-bold'
                    : 'border-border-custom bg-dark-bg text-text-muted hover:text-text-primary'
                }`}
              >
                Urdu (اُردو)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2 px-3 text-sm font-medium rounded-lg border cursor-pointer transition-all ${
                  language === 'en'
                    ? 'border-primary bg-primary/10 text-primary font-bold'
                    : 'border-border-custom bg-dark-bg text-text-muted hover:text-text-primary'
                }`}
              >
                English (US / UK)
              </button>
            </div>
          </div>

          {/* Voice Gender Selection */}
          <div className="flex flex-col gap-2">
            <label htmlFor="voice-select" className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <Mic className="h-4 w-4 text-secondary" />
              2. Choose Vocal Actor Profile
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-1">
              {/* Zainab */}
              <button
                type="button"
                onClick={() => setVoice('zainab')}
                className={`py-2 px-3 text-left rounded-xl border cursor-pointer transition-all ${
                  voice === 'zainab'
                    ? 'border-secondary bg-secondary/15 text-secondary shadow-lg shadow-secondary/5 font-bold'
                    : 'border-border-custom bg-dark-bg text-text-muted hover:text-text-primary'
                }`}
              >
                <div className="font-display font-medium text-xs">Zainab</div>
                <div className="text-[10px] opacity-85 mt-0.5 font-normal leading-none font-sans">Warm Urdu Female</div>
              </button>

              {/* Sarah */}
              <button
                type="button"
                onClick={() => setVoice('sarah')}
                className={`py-2 px-3 text-left rounded-xl border cursor-pointer transition-all ${
                  voice === 'sarah'
                    ? 'border-secondary bg-secondary/15 text-secondary shadow-lg shadow-secondary/5 font-bold'
                    : 'border-border-custom bg-dark-bg text-text-muted hover:text-text-primary'
                }`}
              >
                <div className="font-display font-medium text-xs">Sarah</div>
                <div className="text-[10px] opacity-85 mt-0.5 font-normal leading-none font-sans">Bright English Female</div>
              </button>

              {/* Ayesha */}
              <button
                type="button"
                onClick={() => setVoice('ayesha')}
                className={`py-2 px-3 text-left rounded-xl border cursor-pointer transition-all ${
                  voice === 'ayesha'
                    ? 'border-secondary bg-secondary/15 text-secondary shadow-lg shadow-secondary/5 font-bold'
                    : 'border-border-custom bg-dark-bg text-text-muted hover:text-text-primary'
                }`}
              >
                <div className="font-display font-medium text-xs">Ayesha</div>
                <div className="text-[10px] opacity-85 mt-0.5 font-normal leading-none font-sans">Silk Urdu Female</div>
              </button>

              {/* Asif */}
              <button
                type="button"
                onClick={() => setVoice('asif')}
                className={`py-2 px-3 text-left rounded-xl border cursor-pointer transition-all ${
                  voice === 'asif'
                    ? 'border-secondary bg-secondary/15 text-secondary shadow-lg shadow-secondary/5 font-bold'
                    : 'border-border-custom bg-dark-bg text-text-muted hover:text-text-primary'
                }`}
              >
                <div className="font-display font-medium text-xs">Asif</div>
                <div className="text-[10px] opacity-85 mt-0.5 font-normal leading-none font-sans">Deep Urdu Male</div>
              </button>

              {/* John */}
              <button
                type="button"
                onClick={() => setVoice('john')}
                className={`py-2 px-3 text-left rounded-xl border cursor-pointer transition-all ${
                  voice === 'john'
                    ? 'border-secondary bg-secondary/15 text-secondary shadow-lg shadow-secondary/5 font-bold'
                    : 'border-border-custom bg-dark-bg text-text-muted hover:text-text-primary'
                }`}
              >
                <div className="font-display font-medium text-xs">John</div>
                <div className="text-[10px] opacity-85 mt-0.5 font-normal leading-none font-sans">Professional Male</div>
              </button>
            </div>
          </div>

        </div>

        {/* Big Input Textarea */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider leading-none">
              3. Enter Text Script
            </span>
            <span className={`text-[11px] font-mono font-medium ${text.length > MAX_CHARS ? 'text-red-400' : 'text-text-muted'}`}>
              {text.length} / {MAX_CHARS} Chars
            </span>
          </div>

          {/* Large text container */}
          <div className="relative mt-1">
            <textarea
              id="tts-textarea"
              rows={8}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError(null);
              }}
              placeholder={
                language === 'ur'
                  ? "یہاں پر اپنا لکاوٹ پیسٹ کریں جو آپ آواز میں بدلنا چاہتے ہیں..."
                  : "Type or paste your text paragraph script here to convert to natural AI voice..."
              }
              dir={language === 'ur' ? 'rtl' : 'ltr'}
              className="w-full p-4 bg-dark-bg rounded-xl border border-border-custom text-text-primary font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none"
            />

            {/* Quick samples selection floating helpers */}
            {text.length === 0 && (
              <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => useSample('ur')}
                  className="bg-primary/10 border border-primary/20 text-xs px-2.5 py-1 text-primary hover:bg-primary/20 rounded cursor-pointer font-medium"
                >
                  Urdu Sample
                </button>
                <button
                  type="button"
                  onClick={() => useSample('en')}
                  className="bg-secondary/10 border border-secondary/20 text-xs px-2.5 py-1 text-secondary hover:bg-secondary/20 rounded cursor-pointer font-medium"
                >
                  English Sample
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Warning or Error alerting badges */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2.5 text-xs text-red-400 leading-normal">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Generate Submit control bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-1 border-t border-border-custom/50 pt-4">
          
          {/* Reminders stats / Quick Tier notification info */}
          <div className="text-[11px] text-text-muted flex items-center gap-1.5 leading-tight self-start">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            {user ? (
              <span>
                Account tier: <strong className="text-text-primary capitalize">{user.role === 'customer' ? 'Premium customer' : user.role === 'admin' ? 'System Administrator' : 'Basic free account'}</strong>. 
                {dailyUsageRem !== null && (
                  <span> Remaining credits today: <strong className="text-secondary font-mono">{dailyUsageRem}</strong>.</span>
                )}
              </span>
            ) : (
              <span>
                Visitor preview. <strong className="text-secondary">Limited to 500 chars</strong>. Register a free account to log history!
              </span>
            )}
          </div>

          <button
            id="tts-submit-btn"
            type="submit"
            disabled={loading || !text.trim()}
            className={`w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary to-primary-hover hover:opacity-95 text-white font-semibold text-sm rounded-xl border-0 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg ${
              loading || !text.trim() ? 'opacity-50 cursor-not-allowed filter grayscale' : 'shadow-primary/20'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Synthesizing Audio...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-secondary fill-secondary animate-pulse" />
                Generate AI Speech
                <ArrowRight className="h-4 w-4 ml-0.5" />
              </>
            )}
          </button>

        </div>

      </form>
    </div>
  );
}
