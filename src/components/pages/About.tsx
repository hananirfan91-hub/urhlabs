import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Award, Cpu, Globe } from 'lucide-react';

export default function About() {
  const pillars = [
    {
      icon: <Cpu className="h-5 w-5 text-primary" />,
      title: "Technological Excellence",
      description: "Utilizing deep learning vocoders and transformer nodes specifically synthesized and trained on hours of authentic speech datasets."
    },
    {
      icon: <Globe className="h-5 w-5 text-secondary" />,
      title: "Bridging Linguistic Chasms",
      description: "Dedicated to building high-fidelity Urdu voice support, preserving local terminology, expressions flow, and dialect cadence."
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-primary" />,
      title: "Security & Privacy First",
      description: "All assets are secured in private buckets utilizing Premium Cloud encryption, protecting user intellectual property completely."
    }
  ];

  return (
    <article id="about-page-root" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 transition-colors">
      
      {/* Title headlines blocks */}
      <section className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
          About URH LABS – AI Speech Platform
        </h1>
        <h2 className="text-sm sm:text-base text-text-muted mt-3 max-w-xl font-sans font-medium">
          Building the Future of Urdu AI Voice Technology, making human-fidelity conversions accessible to creators, students, and devs worldwide.
        </h2>
      </section>

      {/* Main core layout blocks */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        
        {/* Left side text story detail */}
        <div className="flex flex-col gap-5 text-xs sm:text-sm text-text-muted leading-relaxed">
          <div className="flex items-center gap-2 mb-1">
            <Award className="h-5 w-5 text-primary" />
            <span className="font-display text-xs font-semibold uppercase tracking-wider text-primary">
              Our Visionary Story
            </span>
          </div>
          
          <h3 className="font-display text-xl font-bold text-text-primary tracking-tight leading-snug">
            Built to Make AI Voice Technology Free and Accessible for Everyone
          </h3>
          
          <p>
            <strong>URH LABS</strong> was founded in Lahore, 2026, on a straightforward premise: powerful AI speech synthesis should not be locked behind corporate subscription paywalls and recurring cards billing. Students, indie YouTubers, accessibility facilitators, and developers across South Asia deserve access to the same stellar vocalizers that massive global corporations enjoy.
          </p>
          <p>
            Global platforms treat languages like Urdu as minor afterthought features, yielding rigid robotic speech cadences with robotic, choppy pronunciations. 
            We designed <strong>URH LABS (Urdu Research & Hosting Labs)</strong> to break that standard. By leveraging custom-trained deep learning networks, our systems read complex right-to-left Nastaliq scripts natively, preserving authentic intonations.
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <Link 
              to="/tools" 
              className="px-4 py-2 bg-primary hover:bg-[#574feb] text-white text-xs font-semibold rounded-lg shadow shadow-primary/20 transition-all font-sans"
            >
              Test Urdu Voices
            </Link>
            <Link 
              to="/contact" 
              className="px-4 py-2 border border-border-custom hover:border-text-muted text-text-primary text-xs font-semibold rounded-lg transition-all font-sans"
            >
              Join Our Community
            </Link>
          </div>
        </div>

        {/* Right side interactive graphic elements */}
        <div className="p-6 bg-[#12121a] border border-border-custom rounded-3xl relative overflow-hidden flex flex-col gap-6 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,217,166,0.04),transparent_60%)] pointer-events-none" />
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-text-primary text-sm mb-1">Advanced Spheroidal Vocoders</h4>
              <p className="text-xs text-text-muted leading-relaxed">Continuous algorithmic model audits are executed monthly to enhance voice organic speed controls, emotional tones, and dialect correctness.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-t border-border-custom/40 pt-4">
            <div className="p-2 bg-secondary/15 text-secondary rounded-xl">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-text-primary text-sm mb-1">Natively Tuned to Pakistani Nuances</h4>
              <p className="text-xs text-text-muted leading-relaxed">Unlike translation utilities, our Urdu outputs preserve natural phonological timings suitable for corporate voicemails or YouTube narrations.</p>
            </div>
          </div>
          
          <div className="p-3 bg-dark-bg/65 rounded-xl border border-border-custom/50 flex justify-between items-center text-center mt-3">
            <div>
              <p className="text-sm font-extrabold text-secondary font-mono">1.2M+</p>
              <p className="text-[9px] text-text-muted uppercase font-semibold">Generations Logged</p>
            </div>
            <div className="w-px h-8 bg-border-custom/80" />
            <div>
              <p className="text-sm font-extrabold text-primary font-mono">42ms</p>
              <p className="text-[9px] text-text-muted uppercase font-semibold">Edge API Latency</p>
            </div>
            <div className="w-px h-8 bg-border-custom/80" />
            <div>
              <p className="text-sm font-extrabold text-[#00D9A6] font-mono">48kHz</p>
              <p className="text-[9px] text-text-muted uppercase font-semibold">Peak Playout Depth</p>
            </div>
          </div>

        </div>

      </section>

      {/* 3. CORE PILLARS BENTO SECTION */}
      <section id="core-pillars" className="border-t border-border-custom pt-16 text-center">
        <p className="text-xs font-bold text-secondary uppercase tracking-widest font-display mb-1">
          Our Shared Beliefs
        </p>
        <h3 className="font-display text-2xl font-extrabold text-text-primary tracking-tight">
          The 3 Pillars of URH LABS
        </h3>
        <p className="text-xs text-text-muted max-w-md mx-auto mt-2 leading-relaxed">
          How we organize our research labs, model trainings, storage solutions, and billing configurations daily.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="p-6 bg-card-bg border border-border-custom rounded-2xl flex flex-col gap-3 shadow-md hover:border-primary/25 transition-all">
              <div className="p-2 w-fit bg-dark-bg border border-border-custom rounded-lg text-primary">
                {pillar.icon}
              </div>
              <h4 className="font-display font-semibold text-text-primary text-sm mt-1">
                {pillar.title}
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT PAGE SEO SECTIONS */}
      <section id="about-seo-technical-benchmarks" className="mx-auto max-w-7xl mt-16 pt-12 border-t border-border-custom/30 text-left">
        <h3 className="font-display text-lg font-bold text-text-primary mb-6 text-center">
          Our Regional Speech Model Benchmark and Research Scope
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar detailed Box 1 */}
          <div className="p-6 bg-card-bg/40 border border-border-custom rounded-2xl flex flex-col gap-2">
            <h4 className="font-display text-xs font-semibold text-text-primary uppercase tracking-wider text-primary">
              Acoustic Synthesis of Urdu Unicode Scripts
            </h4>
            <p className="text-[11px] text-text-muted leading-relaxed">
              URH LABS began as an effort to fix the lack of accurate representation in global speech synthesizers. By studying acoustic mappings of Urdu language letters and pauses, our research team synthesized a highly accurate phonetic dictionary. This ensures that when complex Unicode words are parsed, local accents sound native.
            </p>
          </div>

          {/* Pillar detailed Box 2 */}
          <div className="p-6 bg-card-bg/40 border border-border-custom rounded-2xl flex flex-col gap-2">
            <h4 className="font-display text-xs font-semibold text-text-primary uppercase tracking-wider text-secondary">
              Addressing Regional Dialect Challenges Natively
            </h4>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Standard systems often layer Arabic or Indian styles onto Urdu speaker profiles, creating abnormal pronunciations. Our platform utilizes neural vocoder samples tuned specifically to Pakistani dialects. We record and classify clear native voice files to form standard, rich, and naturally humanlike synthesis tracks.
            </p>
          </div>

          {/* Pillar detailed Box 3 */}
          <div className="p-6 bg-card-bg/40 border border-border-custom rounded-2xl flex flex-col gap-2">
            <h4 className="font-display text-xs font-semibold text-text-primary uppercase tracking-wider text-primary">
              Secure Cloud Storage Architecture & Watermarking Removal
            </h4>
            <p className="text-[11px] text-text-muted leading-relaxed">
              To support professional content creators and local agencies, we remove all audio watermarks entirely. Your generated audio belongs 100% to you. We store these generated waves behind high-security edge buckets with a 1 GB retention cap, keeping your project files highly protected from open web exposure.
            </p>
          </div>

        </div>
      </section>

    </article>
  );
}
