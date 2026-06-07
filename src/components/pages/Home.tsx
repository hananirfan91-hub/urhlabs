import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Languages, Download, Video, Zap, 
  ShieldCheck, VolumeX, MessageSquare, Play, HelpCircle, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { UserProfile } from '../../types';
import TTSForm from '../tts/TTSForm';
import AudioPlayer from '../tts/AudioPlayer';

interface HomeProps {
  user: UserProfile | null;
}

export default function Home({ user }: HomeProps) {
  const [demoAudio, setDemoAudio] = useState<{ audioUrl: string; downloadUrl: string; text: string } | null>(null);

  // FAQ Accordion State managers
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const featuresList = [
    {
      icon: <Languages className="h-5 w-5 text-primary" />,
      title: "Native Urdu Script Support",
      description: "Direct Nastaliq/Urdu input parsing. No translation or Roman phonetic converter needed. Preserves natural accents and accents flow."
    },
    {
      icon: <Sparkles className="h-5 w-5 text-secondary" />,
      title: "English Transformed Voices",
      description: "Clean US and UK English neural vocoders producing neutral accent outputs. Perfect for corporate recordings, training manuals, and global listeners."
    },
    {
      icon: <Download className="h-5 w-5 text-primary" />,
      title: "HQ MP3 Voice Downloads",
      description: "Generate clean, lightweight, highly compressed MP3 sound files at production-grade bitrates ready to be used inside your favorite editors."
    },
    {
      icon: <Video className="h-5 w-5 text-secondary" />,
      title: "HD MP4 Video Renderings",
      description: "Render and download customized video visualizers with colorful soundbars and transcriptions synced directly to the speech. Zero server lag!"
    },
    {
      icon: <Zap className="h-5 w-5 text-primary" />,
      title: "Speed & Pitch Controls",
      description: "Adjust audio speed from 0.5x to 2.0x and shift sound pitches from Deep Low Bass representations to high crisp treble pitches on the fly."
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-secondary" />,
      title: "Encrypted Private Auditing",
      description: "All speech files are private-stored with secure token protection. Expiring signed URLs guarantee no public exposure of your assets."
    }
  ];

  const faqItems = [
    {
      q: "Is URH LABS Text to Speech actually free?",
      a: "Yes! URH LABS provides a generous free-to-use tier giving everyone 3 conversions per day (each up to 500 characters) - no registration, credit card, or hidden fee is required whatsoever to run previews."
    },
    {
      q: "Can I paste Urdu Nastaliq text directly?",
      a: "Absolutely. URH LABS has native Unicode support, so you can paste standard Urdu characters directly into the editor. Our AI models read Urdu script fluently, respecting authentic Pakistani dialects."
    },
    {
      q: "Am I allowed to use generated audio for YouTube monetization?",
      a: "Yes. All audio downloaded from URH LABS is standard, royalty-free, and licensed for commercial use. It works beautifully on YouTube faceless channels, TikTok, podcasts, and digital course narratives."
    },
    {
      q: "Is there a limit to how many characters I can convert at once?",
      a: "Free account users can convert up to 500 characters per attempt. Premium Customers on Pro and Advanced subscriptions can convert up to 5000 characters per conversion."
    },
    {
      q: "How does the manual subscription request activation work?",
      a: "To eliminate payment gateways overhead, choose a plan on the Pricing page and click Subscribe. Send the payment via bank wire/Easypaisa and add your reference detail notes. An admin audits manual entries and upgrades you in under 24 hours."
    },
    {
      q: "What is the benefit of the custom MP4 video rendering?",
      a: "Our custom video rendering runs locally at 60 FPS in your browser. It builds an eye-catching wave motion videography of the vocal track, making it ready to upload directly as a Short, Reel, or video without extra editing."
    }
  ];

  const testimonials = [
    {
      quote: "Finally a tool that reads Urdu properly! Standard global platforms treat Urdu as an afterthought, but URH LABS is highly accurate for Pakistani content creators.",
      name: "Ali Raza",
      role: "YouTube Digital Creator (Lahore)",
      tier: "Pro Premium customer"
    },
    {
      quote: "The custom MP4 generator is brilliant. I can instantly convert my history essays into sound files and render visual waves to study on my phone while commuting.",
      name: "Ayesha Khan",
      role: "Digital Humanities Student (Karachi)",
      tier: "Free Tier Member"
    },
    {
      quote: "We use the URH LABS API to voice our automated phone greetings in both Urdu and English. It took us less than 10 lines of code, and voice fidelity is superb.",
      name: "Mohammad Ahmed",
      role: "CTO, Software Labs (Islamabad)",
      tier: "API Developer"
    }
  ];

  return (
    <article id="homepage-root" className="w-full relative transition-colors">
      
      {/* 1. HERO HEADER AREA SECTION */}
      <section id="hero-banner" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary font-semibold tracking-wide mb-6 animate-pulse select-none">
          <Sparkles className="h-3.5 w-3.5 fill-primary" />
          <span>New: V2.5 Neural Voices Activated</span>
        </div>

        {/* Master H1 */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary max-w-4xl leading-tight">
          URH LABS – AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Text to Speech</span> Platform
        </h1>

        {/* Master H2 */}
        <h2 className="text-base sm:text-xl text-text-muted mt-5 max-w-2xl leading-relaxed font-sans">
          Convert Any Text to Natural Voice in Seconds. Build human-like narrations in Urdu and English natively for academic, professional, and content creations.
        </h2>

        {/* Hero Actions triggers */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <Link
            to="/tools"
            className="w-full sm:w-auto px-6 py-3.5 bg-primary hover:bg-[#574feb] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 transition-all shadow-primary/25"
          >
            Launch Free Tool Now
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
          <Link
            to="/pricing"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#12121a]/80 border border-border-custom hover:border-text-muted text-text-primary hover:bg-border-custom/20 font-semibold text-sm rounded-xl transition-all"
          >
            View Pricing Plans
          </Link>
        </div>

        {/* Small SEO callout info */}
        <p className="text-[10px] text-text-muted mt-4 font-mono tracking-wide">
          ⚡ NO CREDIT CARD REQUIRED · INSTANT BROADCAST QUALITY RESULTS
        </p>

        {/* Hero Interactive visual element preview */}
        <div className="w-full max-w-4xl mt-16 bg-[#12121a] border border-border-custom p-1.5 rounded-2xl shadow-2xl relative">
          <div className="w-full h-8 border-b border-border-custom/50 bg-dark-bg/40 rounded-t-xl px-4 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
            <span className="font-mono text-[10px] text-text-muted ml-2">https://urhlabs.app/ai-voice-generator</span>
          </div>
          <div className="p-4 sm:p-6 bg-dark-bg/20 rounded-b-xl flex flex-col gap-4">
            <div className="flex items-center justify-between text-left">
              <div>
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Try Live Sandbox Demo</p>
                <p className="text-xl font-bold text-text-primary tracking-tight font-display mt-0.5">Test Speech Inputs Directly</p>
              </div>
              <span className="font-mono text-[10px] bg-secondary/5 border border-secondary/10 text-secondary px-2 py-1 rounded">
                Free Live preview
              </span>
            </div>
            
            <TTSForm user={user} onGenerateSuccess={(data) => setDemoAudio(data)} />
            
            {demoAudio && (
              <div className="mt-2 text-left">
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-2">Playout Output Stream:</span>
                <AudioPlayer audioUrl={demoAudio.audioUrl} downloadUrl={demoAudio.downloadUrl} textScopeForVideo={demoAudio.text} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. THE HOW IT WORKS WALKTHROUGH SECTION */}
      <section id="how-it-works-steps" className="w-full border-y border-border-custom bg-card-bg/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold text-primary uppercase tracking-widest font-display mb-1">
            Engine Walkthrough
          </p>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            How to Convert Your Text to Speech
          </h3>
          <p className="text-xs sm:text-sm text-text-muted mt-2 max-w-md mx-auto">
            Three simple, localized steps to take written words from documents straight to high-fidelity audio streams.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
            {/* Step 1 */}
            <div className="p-6 bg-[#12121a] border border-border-custom rounded-2xl relative flex flex-col gap-3">
              <span className="absolute top-4 right-6 font-mono text-4xl font-extrabold text-[#6c63ff]/10">01</span>
              <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-xl border border-primary/20">
                <Languages className="h-5 w-5" />
              </div>
              <h4 className="font-display text-base font-bold text-text-primary">
                1. Input Text Script
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Paste your **Urdu script in Nastaliq characters** or type clean **English sentences** into our large textarea form.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-[#12121a] border border-border-custom rounded-2xl relative flex flex-col gap-3">
              <span className="absolute top-4 right-6 font-mono text-4xl font-extrabold text-secondary/10">02</span>
              <div className="p-2.5 bg-secondary/10 text-secondary w-fit rounded-xl border border-secondary/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="font-display text-base font-bold text-text-primary">
                2. Select Voice Actors
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Choose between warm Zainab/Sarah (Female) or clear Asif/John (Male) voices, calibrating output languages.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-[#12121a] border border-border-custom rounded-2xl relative flex flex-col gap-3">
              <span className="absolute top-4 right-6 font-mono text-4xl font-extrabold text-[#6c63ff]/10">03</span>
              <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-xl border border-primary/20">
                <Download className="h-5 w-5" />
              </div>
              <h4 className="font-display text-base font-bold text-text-primary">
                3. Playout & Download
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Listen, adjust playback speed and pitches, and download clean **MP3 audio** or an **animated MP4 visualizer video** instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM CORE FEATURES BENTO GRID SECTION */}
      <section id="features-benefits" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-xs font-bold text-secondary uppercase tracking-widest font-display mb-1">
          Feature Packed System
        </p>
        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Everything You Can Do with URH Labs Text to Speech
        </h3>
        <p className="text-xs sm:text-sm text-text-muted mt-2 max-w-md mx-auto">
          Built with digital creators and South Asian students in mind. High-speed, high-fidelity vocals with no compromises.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 text-left">
          {featuresList.map((f, i) => (
            <div
              key={i}
              className="p-6 bg-card-bg border border-border-custom hover:border-primary/45 rounded-2xl transition-all shadow-md group hover:-translate-y-1"
            >
              <div className="p-2.5 bg-dark-bg w-fit rounded-xl border border-border-custom group-hover:border-primary/20 mb-4 transition-colors">
                {f.icon}
              </div>
              <h4 className="font-display text-base font-bold text-text-primary group-hover:text-primary transition-colors">
                {f.title}
              </h4>
              <p className="text-xs text-text-muted leading-relaxed mt-2">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. LOCAL TESTIMONIALS SECTION */}
      <section id="customer-testimonials" className="w-full bg-card-bg/10 border-t border-border-custom py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold text-primary uppercase tracking-widest font-display mb-1">
            Global Accolades
          </p>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Trusted by Pakistan's Leading Creators
          </h3>
          <p className="text-xs sm:text-sm text-text-muted mt-2 max-w-md mx-auto">
            See feedback from video narrators, software engineering teams, and students who rely on URH LABS daily.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 bg-card-bg border border-border-custom rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-primary mb-3 text-lg leading-none">★★★★★</div>
                  <p className="text-xs text-text-primary italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex flex-col gap-0.5 mt-5 border-t border-border-custom/50 pt-3">
                  <span className="font-display text-xs font-bold text-text-primary">{t.name}</span>
                  <span className="text-[10px] text-text-muted">{t.role}</span>
                  <span className="text-[9px] font-mono font-semibold text-secondary tracking-wide bg-secondary/5 max-w-fit px-1.5 py-0.5 rounded border border-secondary/15 mt-1.5">
                    {t.tier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COLLAPSIBLE ACCORDION FAQ SECTION */}
      <section id="faq-accordions" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-xs font-bold text-secondary uppercase tracking-widest font-display mb-1">
          Common Concerns
        </p>
        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
          Frequently Asked Questions
        </h3>
        <p className="text-xs sm:text-sm text-text-muted mt-2 max-w-md mx-auto">
          Need clarification on billing formats, terms of downloads, or Nastaliq compatibility? We are here to help.
        </p>

        <div className="flex flex-col gap-3 mt-12 text-left">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="bg-card-bg border border-border-custom rounded-xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleFaq(i)}
                className="w-full flex items-center justify-between p-4 bg-transparent border-0 text-text-primary hover:text-primary transition-colors cursor-pointer text-left focus:outline-none"
              >
                <span className="font-display text-sm font-semibold flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-text-muted shrink-0" />
                  {item.q}
                </span>
                <ChevronDown className={`h-4.5 w-4.5 text-text-muted transition-transform duration-200 shrink-0 ${openFaq === i ? 'rotate-180 text-primary' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-10 pb-4 text-xs text-text-muted leading-relaxed border-t border-border-custom/30 pt-3 bg-dark-bg/20 animate-in slide-in-from-top-1 duration-150">
                  {item.a}
                  <div className="mt-2.5 flex items-center gap-1">
                    <span className="text-[10px] text-primary">Read details inside the</span>
                    <Link to="/about" className="text-[10px] text-primary underline hover:text-[#574feb]">About platform</Link>
                    <span className="text-[10px] text-primary">documentation.</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SEO ACCELERATION ARTICLES (3 DETAILED SECTIONS) */}
      <section id="seo-rich-technical-features" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border-custom/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Section 1 */}
          <div className="p-6 bg-card-bg border border-border-custom hover:border-[#6c63ff]/30 rounded-2xl flex flex-col gap-4 transition-all">
            <div className="text-primary font-mono text-xs font-bold tracking-widest uppercase">Deep Architecture</div>
            <h4 className="font-display text-lg font-bold text-text-primary tracking-tight">
              Deep Learning Speech Synthesis for Urdu Script Parsing
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Our advanced <strong>Urdu AI Text to Speech</strong> system utilizes deep neural vocoder modeling to break down composite Arabic Unicode strings and native Nastaliq symbols. Standard speech synthesizers often fail at complex Urdu pronunciations, treating sentences with Western phonetic rules. 
            </p>
            <p className="text-xs text-text-muted leading-relaxed">
              URH LABS addresses this challenge with customized pitch arrays and native linguistic filters. Our framework maps letters to authentic spoken vocal outputs, representing the best quality <strong>Urdu text-to-speech platform</strong> in Pakistan.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-6 bg-card-bg border border-border-custom hover:border-secondary/30 rounded-2xl flex flex-col gap-4 transition-all">
            <div className="text-secondary font-mono text-xs font-bold tracking-widest uppercase">Content Creator Suite</div>
            <h4 className="font-display text-lg font-bold text-text-primary tracking-tight">
              Automated Voiceovers for Faceless Channels & Reels
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Pioneering video narration workflows across YouTube, Instagram Reels, and TikTok, URH LABS provides the perfect utility for modern content directors. Rather than investing in high-priced studio equipment or hiring vocal actors, creators can synthesize entire Urdu narration guides instantly.
            </p>
            <p className="text-xs text-text-muted leading-relaxed">
              With integrated <strong>HD MP4 waveform video generators</strong>, you can download ready-made social videos containing reactive visual seek bars and synced subtitle text scopes. Build high-retention channels powered by authentic, humanlike male and female voice files.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-6 bg-card-bg border border-border-custom hover:border-primary/30 rounded-2xl flex flex-col gap-4 transition-all">
            <div className="text-primary font-mono text-xs font-bold tracking-widest uppercase">Linguistic Optimization</div>
            <h4 className="font-display text-lg font-bold text-text-primary tracking-tight">
              Bilingual Synthesis Preserving Native Pakistani Dialects
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Our models utilize multi-speaker acoustic networks to blend localized Urdu accents naturally with clear, neutral-dialect English vocabulary on the fly. This makes it an ideal platform for administrative services, localized IVR telecommunications, local billing notices, and interactive digital courses.
            </p>
            <p className="text-xs text-text-muted leading-relaxed">
              Whether you are converting 2,000-character news reports, school lesson plans, or commercial voiceovers, the platform ensures that the output speech flows natively with accurate regional cadence, pauses, and speech dynamics.
            </p>
          </div>

        </div>
      </section>

      {/* 6. MAIN CTA BANNER ACTION SECTION */}
      <section id="cta-cta" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="p-8 sm:p-12 bg-gradient-to-tr from-[#12121a] to-[#1a1a2e] border border-border-custom rounded-3xl relative overflow-hidden flex flex-col items-center text-center shadow-xl">
          
          {/* Neon mesh overlay glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(108,99,255,0.06),transparent_60%)] pointer-events-none" />

          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-tight">
            Ready to Generate Natural AI Voiceovers?
          </h3>
          <p className="text-xs sm:text-sm text-text-muted mt-3 max-w-lg leading-relaxed font-sans">
            Start converting Urdu articles, English training transcripts and lecture guidelines into high-performance speech files today. Activate immediate accounts for free.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full justify-center">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-7 py-3 bg-primary hover:bg-[#574feb] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all"
            >
              Sign Up For Free Trial
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/tools"
              className="w-full sm:w-auto px-7 py-3 bg-dark-bg/85 hover:bg-card-bg text-text-muted hover:text-text-primary border border-border-custom hover:border-text-muted font-semibold text-xs rounded-xl transition-colors"
            >
              Launch Direct Generator
            </Link>
          </div>

          <p className="text-[10px] text-text-muted font-mono tracking-wider mt-5">
            ✓ 500 characters initial sandbox trial · 100% cloud persistent backup
          </p>
        </div>
      </section>

    </article>
  );
}
