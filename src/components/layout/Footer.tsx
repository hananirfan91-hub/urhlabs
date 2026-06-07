import { Link } from 'react-router-dom';
import { AudioLines, Mail, PhoneCall } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="main-app-footer" className="w-full border-t border-border-custom bg-dark-bg/50 pt-16 pb-8 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12 pb-12 border-b border-border-custom/50">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-tr from-primary to-secondary rounded-lg text-[#0a0a0f]">
                <AudioLines className="h-4.5 w-4.5" />
              </div>
              <span className="font-display text-base font-bold tracking-tight text-text-primary">
                URH LABS
              </span>
            </Link>
            <p className="text-xs text-text-muted leading-relaxed">
              Powering localized neural speech technologies across South Asia. We build industry-leading AI vocal synthesis models supporting Urdu and English scripts.
            </p>
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="flex items-center gap-2 text-[11px] text-text-muted">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>hananirfan91@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-text-muted">
                <PhoneCall className="h-3.5 w-3.5 text-secondary" />
                <span>+92 300 1234567 (WhatsApp)</span>
              </div>
            </div>
          </div>

          {/* Column 2: Platform Features */}
          <div className="flex flex-col gap-3">
            <span className="font-display text-xs font-semibold tracking-wider text-text-primary uppercase leading-none">
              AI Speech Services
            </span>
            <ul className="flex flex-col gap-2 p-0 m-0 list-none text-xs text-text-muted">
              <li>
                <Link to="/tools" className="hover:text-primary transition-colors">
                  Urdu Text to Speech
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-primary transition-colors">
                  English Voice Generator
                </Link>
              </li>
              <li>
                <Link to="/tools" className="hover:text-primary transition-colors">
                  Text to MP3 Converter
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-primary transition-colors">
                  SaaS API Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company Sitemap */}
          <div className="flex flex-col gap-3">
            <span className="font-display text-xs font-semibold tracking-wider text-text-primary uppercase leading-none">
              Company Resources
            </span>
            <ul className="flex flex-col gap-2 p-0 m-0 list-none text-xs text-text-muted">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About URH LABS
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-primary transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/sitemap.xml" target="_blank" className="hover:text-primary transition-colors font-mono text-[10px]">
                  XML Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legals Document Links */}
          <div className="flex flex-col gap-3">
            <span className="font-display text-xs font-semibold tracking-wider text-text-primary uppercase leading-none">
              Legal Framework
            </span>
            <ul className="flex flex-col gap-2 p-0 m-0 list-none text-xs text-text-muted">
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <span className="text-[10px] text-secondary font-mono tracking-wide bg-secondary/5 border border-secondary/10 px-2 py-1 rounded inline-block max-w-fit mt-1">
                  100% Secure SSL MD5
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Base bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <p className="text-[11px] text-text-muted text-center sm:text-left">
            &copy; 2026 <strong>URH LABS</strong>. Built with pride using neural modeling. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-muted">Powered securely by</span>
            <span className="font-mono text-[10px] font-semibold text-text-primary">Supabase</span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-mono text-[10px] font-semibold text-text-primary">Cloudflare R2</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
