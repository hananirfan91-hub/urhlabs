import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, Globe } from 'lucide-react';

export default function Terms() {
  return (
    <article id="terms-page-root" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-text-muted leading-relaxed text-xs sm:text-sm transition-colors">
      <div className="flex gap-2 items-center mb-2">
        <FileText className="h-5 w-5 text-primary" />
        <span className="font-display text-xs font-bold text-primary uppercase tracking-wider">Legal Framework</span>
      </div>
      
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-text-primary mb-2">
        Terms & Conditions
      </h1>
      <h2 className="text-sm text-text-muted mb-8 leading-snug font-sans font-semibold">
        Please Read Carefully Before Using URH LABS Platform Speech Engines
      </h2>

      <div className="flex flex-col gap-6 font-sans">
        
        <p className="text-[11px] text-text-muted italic border-l-2 border-primary pl-3 bg-primary/5 py-2.5 rounded-r">
          Last Updated: June 7, 2026. Welcome to URH LABS (https://urhlabs.vercel.app). By creating transactional profiles or accessing our deep learning speech converters, you agree to these legal frameworks.
        </p>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-base font-bold text-text-primary">1. Acceptable Use of AI Speech Outputs</h3>
          <p>
            You are granted 100% royalty-free commercialization rights to any MP3 audio or MP4 wave files synthesized via our cloud-hosted Google and R2 vocoders. You are solely responsible for ensuring that the synthesized voiceovers (transcripts inputs) do not violate copyright, incite violence, spread malicious fake narratives, or run unsolicited automated profiling of individuals.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-base font-bold text-text-primary">2. User Account Guardrails & Spam Rules</h3>
          <p>
            To keep URH LABS accessible and free out-of-the-box for everyone, you are strictly prohibited from writing programmatic scrapers, executing bypass operations on our custom **React Math Captcha protection safeguards**, or spamming backend API pipelines with parallel batch queries. Accounts violating these rules are subject to immediate suspension by admins.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-base font-bold text-text-primary">3. Manual Billing Agreement</h3>
          <p>
            Because we use manual payment verification instead of standard automated Stripe credit card handlers, plan upgrades (Credits assigned) are processed on a human-audit basis. We make best efforts to activate approved plans in under 24 hours. ALL SALES ARE FINAL. Refund requests are audited on WhatsApp (+92 310 6359235) or via support tickets.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-base font-bold text-text-primary">4. Cloud Storage & Content Retentions</h3>
          <p>
            We back up your generated voice clips private and encrypted using **secure private cloud storage** buckets. Free tier outputs may undergo garbage collection deletions after 30 days of inactivity to save storage space. Active Premium customer accounts are guaranteed secure retention logs for 90 days.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-base font-bold text-text-primary">5. Limit of Liability Disclaimers</h3>
          <p>
            URH LABS is delivered 'as-is' without guarantees of uninterrupted up-times. Our neural vocalizations are simulated outputs. We assume zero accountability for outcomes resulting from software downtimes, file loss, or business disruptions.
          </p>
        </section>

        {/* TERMS PAGE SEO RICH SECTIONS */}
        <section id="terms-seo-blocks" className="mx-auto max-w-7xl mt-12 pt-12 border-t border-border-custom/30 text-left">
          <h4 className="font-display text-sm font-bold text-text-primary mb-4 text-center">
            Supplemental Platform Rules, Audio Licenses, & Bot Defenses
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1 */}
            <div className="p-4 bg-card-bg/40 border border-border-custom rounded-xl flex flex-col gap-1.5">
              <span className="font-display text-[10px] font-semibold text-primary uppercase">I. Strict Abuse & Scraper Safeguards</span>
              <p className="text-[10px] text-text-muted leading-relaxed">
                To guarantee equal bandwidth and free access for study groups, we monitor pipeline loads. You are forbidden from deploying automated curl bots, writing python scrapers to extract voice packets, or using browser macros to bypass our single math captcha defense gates.
              </p>
            </div>

            {/* Box 2 */}
            <div className="p-4 bg-card-bg/40 border border-border-custom rounded-xl flex flex-col gap-1.5">
              <span className="font-display text-[10px] font-semibold text-secondary uppercase">II. Full Intellectual Properties Clearances</span>
              <p className="text-[10px] text-text-muted leading-relaxed">
                URH LABS issues complete commercial clearance licenses for all vocal assets synthesized on Premium plans. You hold complete ownership to compile files into digital presentations, monetize YouTube channels, run advertisement campaigns, and upload custom audio content without watermarks.
              </p>
            </div>

            {/* Box 3 */}
            <div className="p-4 bg-card-bg/40 border border-border-custom rounded-xl flex flex-col gap-1.5">
              <span className="font-display text-[10px] font-semibold text-primary uppercase">III. Storage Boundaries and Archival Policies</span>
              <p className="text-[10px] text-text-muted leading-relaxed">
                All cloud generations are bounded at a maximum of 1 GB private bucket volume per account. Standard inactive sandbox directories undergo scheduled cleaning after 30 days to protect systems, while active pro accounts maintain direct streaming history logs for 90 days.
              </p>
            </div>

          </div>
        </section>

        <section className="border-t border-border-custompt-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4">
          <p className="text-[11px] text-text-muted">
            Have concerns regarding terms? Read our <Link to="/privacy" className="text-primary underline font-medium">Privacy Policy</Link> or contact admins: <strong>hananirfan91@gmail.com</strong>
          </p>
          <Link to="/tools" className="font-sans text-xs bg-primary hover:bg-[#574feb] text-white px-4 py-2 rounded-lg font-semibold shrink-0">
            Accept & Launch Tool
          </Link>
        </section>

      </div>
    </article>
  );
}
