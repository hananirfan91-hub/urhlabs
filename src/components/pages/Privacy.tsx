import { Link } from 'react-router-dom';
import { ShieldCheck, Eye, Database } from 'lucide-react';

export default function Privacy() {
  return (
    <article id="privacy-page-root" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 text-text-muted leading-relaxed text-xs sm:text-sm transition-colors">
      <div className="flex gap-2 items-center mb-2">
        <ShieldCheck className="h-5 w-5 text-secondary" />
        <span className="font-display text-xs font-bold text-secondary uppercase tracking-wider">User Protection Policy</span>
      </div>
      
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-text-primary mb-2">
        Privacy Policy
      </h1>
      <h2 className="text-sm text-text-muted mb-8 leading-snug font-sans font-semibold">
        How URH LABS Protects, Encrypts, and Moderates Your Generated Speech Data
      </h2>

      <div className="flex flex-col gap-6 font-sans">
        
        <p className="text-[11px] text-text-muted italic border-l-2 border-secondary pl-3 bg-secondary/5 py-2.5 rounded-r">
          Effective Date: June 7, 2026. This policy guides our processes to collect, encrypt, partition, and purge any transactional parameters you generate while using URH LABS.
        </p>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-base font-bold text-text-primary flex items-center gap-2">
            <Eye className="h-4.5 w-4.5 text-secondary" />
            1. Types of Data We Securing
          </h3>
          <p>
            When utilizing our platform, we collect (a) your account credentials (name, email, and password hashes stored in Supabase), (b) transaction details for manual plan requests, and (c) generations metadata: text scripts, language dials chosen, vocoder identifiers, and target sound files relative path links.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-base font-bold text-text-primary flex items-center gap-2">
            <Database className="h-4.5 w-4.5 text-primary" />
            2. High-Grade Storage & Encryption Architectures
          </h3>
          <p>
            Standard sound outputs are saved to private buckets hosted on **Cloudflare R2** located across optimal edge regions. We do NOT deploy public file indexing or expose raw directory URLs. To read, download, or stream audio items, our Express middleware issues cryptographically secure, short-lived presigned hashes that expire automatically (1 hour for playout streams; 5 minutes for direct MP3 downloads).
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-base font-bold text-text-primary">3. Tracking Cookies & State Sessions</h3>
          <p>
            We set standard HttpOnly verified JWT token cookies inside browser sessions to keep you authenticated securely across navigation pages. We do not use third-party analytics pixels or sell targeting profiling logs to data buyers.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="font-display text-base font-bold text-text-primary">4. Deletion & Data Disposal Actions</h3>
          <p>
            You retain absolute ownership of any scripts and produced sound files. To wipe your transaction logs or erase your account profile permanently from our Supabase tables, toggle triggers on the Dashboard or notify our privacy administrator: <strong>hananirfan91@gmail.com</strong>.
          </p>
        </section>

        <section className="border-t border-border-custom pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4">
          <p className="text-[11px] text-text-muted">
            Got privacy concerns? Contact our designated Compliance lead: <strong>hananirfan91@gmail.com</strong>
          </p>
          <Link to="/tools" className="font-sans text-xs bg-primary hover:bg-[#574feb] text-white px-4 py-2 rounded-lg font-semibold shrink-0">
            Accept & Launch Tool
          </Link>
        </section>

      </div>
    </article>
  );
}
