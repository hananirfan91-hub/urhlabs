import { useState, useEffect } from 'react';
import { Sparkles, Info, Languages, Shield, HelpCircle, FileText, CheckCircle2, Volume2, Play } from 'lucide-react';
import { UserProfile } from '../../types';
import TTSForm from '../tts/TTSForm';
import AudioPlayer from '../tts/AudioPlayer';

interface ToolsProps {
  user: UserProfile | null;
}

export default function Tools({ user }: ToolsProps) {
  const [audioResult, setAudioResult] = useState<{ audioUrl: string; downloadUrl: string; text: string } | null>(null);
  const [presets, setPresets] = useState<any[]>([]);
  const [loadingPresets, setLoadingPresets] = useState(false);

  useEffect(() => {
    setLoadingPresets(true);
    fetch('/api/presets')
      .then(res => res.json())
      .then(data => {
        setPresets(data.presets || []);
      })
      .catch(err => console.error("Failed to load global vocal presets:", err))
      .finally(() => setLoadingPresets(false));
  }, []);

  const usageGuidelines = [
    {
      title: "Paragraph Spacing & Pauses",
      tip: "To introduce natural voice pauses, use standard punctuation indicators. Urdu periods (۔) or commas (،) as well as English periods (.) create a realistic breath delay in our vocalizers."
    },
    {
      title: "Pronunciation Adjustments",
      tip: "If a localized English term or a complex Urdu compound word sounds off, spell it out phonetically. For example, writing 'W-H-O' instead of 'WHO' or spelling the Urdu word in separate short syllables."
    },
    {
      title: "Varying Speeds and Pitch",
      tip: "We output files at 1.0x standard human reading speed. Use the custom player speed parameters (0.75x for studying, 1.1x for fast-paced TikTok or YouTube narration reels) to alter speed."
    },
    {
      title: "Direct Unicode Copying",
      tip: "You can copy-paste standard Nastaliq Urdu layout scripts directly from WhatsApp, MS Word, InPage, Urdu news sites, or PDF articles without needing to convert script formats."
    }
  ];

  return (
    <article id="tools-page-root" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 transition-colors">
      
      {/* Title & SEO Headlines */}
      <section className="text-center mb-10 flex flex-col items-center">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
          AI Voice Generator – Text to Speech Online Free
        </h1>
        <h2 className="text-sm sm:text-base text-text-muted mt-3 max-w-xl font-sans font-medium">
          Generate Natural Urdu and English Voice from Text. Perfect for faceless narrators, students study logs, and automated business phone prompts.
        </h2>
      </section>

      {/* Main TTS interface workspace */}
      <section id="tts-workspace-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Generative Inputs Section (Takes 2 Columns on Desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-card-bg/45 p-4 border border-border-custom shadow-inner rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg shrink-0">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              <strong>Bilingual Neural Synthesis:</strong> Our vocoders preserve native Pakistani speech patterns for Urdu (`ur`) and crisp neutral accent dialects for English (`en`). Play around with the generated tracks below.
            </p>
          </div>

          <TTSForm 
            user={user} 
            onGenerateSuccess={(data) => {
              setAudioResult(data);
              // Auto scroll down to player on small screens
              setTimeout(() => {
                const playerEl = document.getElementById('audio-out-section');
                if (playerEl) playerEl.scrollIntoView({ behavior: 'smooth' });
              }, 150);
            }} 
          />

          {audioResult && (
            <div id="audio-out-section" className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider block">
                  Active Generation Stream Playout
                </span>
                <span className="text-[10px] text-text-muted font-mono bg-border-custom/40 px-2 py-0.5 rounded border border-border-custom/50">
                  expiring securely in 1 hour
                </span>
              </div>
              <AudioPlayer 
                audioUrl={audioResult.audioUrl} 
                downloadUrl={audioResult.downloadUrl} 
                textScopeForVideo={audioResult.text} 
              />
            </div>
          )}
        </div>

        {/* Right Side: Sidebar support guides (Takes 1 Column) */}
        <div className="flex flex-col gap-6">
          
          {/* Box 1: Support Guidelines */}
          <div className="bg-card-bg border border-border-custom p-5 rounded-2xl flex flex-col gap-4">
            <h3 className="font-display text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border-custom pb-3">
              <Info className="h-4 w-4 text-primary" />
              TTS Pronunciation Tips
            </h3>
            
            <div className="flex flex-col gap-4">
              {usageGuidelines.map((ug, i) => (
                <div key={i} className="flex flex-col gap-1.5 text-xs">
                  <h4 className="font-semibold text-text-primary flex items-center gap-1.5 leading-none">
                    <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0" />
                    {ug.title}
                  </h4>
                  <p className="text-text-muted leading-relaxed">
                    {ug.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Box 2: Secure Storage policy indicators */}
          <div className="bg-card-bg border border-border-custom p-5 rounded-2xl flex flex-col gap-3 text-xs">
            <h3 className="font-display text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border-custom pb-3">
              <Shield className="h-4 w-4 text-secondary" />
              R2 Storage & Privacy Policy
            </h3>
            <p className="text-text-muted leading-relaxed">
              We value files security. All produced audio is stored inside private, encrypted buckets powered by <strong>Cloudflare R2</strong>.
            </p>
            <ul className="flex flex-col gap-1.5 text-[11px] text-text-muted p-0 m-0 list-none mt-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span>We do NOT expose raw URLs.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span>Playback Links expire in 1 hour.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span>Downloads Links expire in 5 minutes.</span>
              </li>
            </ul>
          </div>

          {/* Box 3: Technical Specs */}
          <div className="bg-card-bg border border-border-custom p-5 rounded-2xl flex flex-col gap-3 text-[11px] font-mono text-text-muted">
            <h3 className="font-display text-xs font-bold text-text-primary uppercase tracking-wider pb-1 border-b border-border-custom/50">
              Platform Engineering Specifications
            </h3>
            <div className="flex justify-between items-center py-1 border-b border-border-custom/20">
              <span>Primary Audio Format:</span>
              <span className="text-text-primary font-semibold">MPEG MP3</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border-custom/20">
              <span>Alternative Video Format:</span>
              <span className="text-text-primary font-semibold">MPEG-4 MP4</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border-custom/20">
              <span>Audio Sample Rate:</span>
              <span className="text-text-primary font-semibold">44.1 kHz (Studio)</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span>Host Edge Cache Nodes:</span>
              <span className="text-secondary font-semibold">Verified Active</span>
            </div>
          </div>

        </div>

      </section>

      {presets && presets.length > 0 && (
        <section id="vocal-showroom-section" className="mt-16 pt-12 border-t border-border-custom">
          <div className="flex flex-col gap-2 items-center text-center mb-8">
            <span className="text-[10px] bg-secondary/10 border border-secondary/20 text-secondary px-2.5 py-1 rounded-full uppercase font-mono font-bold tracking-wider">
              Vocal Showroom Auditioning
            </span>
            <h3 className="font-display text-2xl font-extrabold text-text-primary">
              Explore Our Natural Voice Demonstrations
            </h3>
            <p className="text-xs text-text-muted max-w-lg leading-relaxed">
              Listen to predefined speech syntheses crafted by our administrators to audit language scripts, voice tones, and emotional cadences natively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presets.map((preset) => (
              <div 
                key={preset.id} 
                className="p-5 bg-card-bg/40 border border-border-custom hover:border-primary/25 rounded-2xl flex flex-col justify-between gap-4 transition-all duration-150 hover:-translate-y-0.5"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="font-display text-xs font-bold text-text-primary leading-tight truncate">{preset.title}</span>
                    <div className="flex gap-1">
                      <span className="text-[8px] font-mono font-bold bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded uppercase">
                        {preset.language}
                      </span>
                      <span className="text-[8px] font-mono font-bold bg-secondary/15 border border-secondary/25 text-secondary px-1.5 py-0.5 rounded uppercase">
                        {preset.voice_type === 'female' ? 'Female ♀' : 'Male ♂'}
                      </span>
                    </div>
                  </div>
                  <blockquote className="text-xs text-text-muted italic leading-relaxed border-l-2 border-border-custom pl-3 mt-1 py-0.5">
                    "{preset.text_transcript}"
                  </blockquote>
                </div>

                <div className="flex items-center gap-2 border-t border-border-custom/30 pt-4 mt-1">
                  <button
                    onClick={() => {
                      setAudioResult({
                        audioUrl: preset.audio_url,
                        downloadUrl: preset.audio_url,
                        text: preset.text_transcript
                      });
                      setTimeout(() => {
                        const playerEl = document.getElementById('audio-out-section');
                        if (playerEl) playerEl.scrollIntoView({ behavior: 'smooth' });
                      }, 150);
                    }}
                    className="flex-grow py-2 bg-dark-bg hover:bg-card-bg text-text-primary border border-border-custom hover:border-text-muted rounded-xl text-[10px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="h-3 w-3 fill-text-primary shrink-0" />
                    Load to Interactive Player
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </article>
  );
}
