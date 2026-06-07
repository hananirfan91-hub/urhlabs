import { useState } from 'react';
import { Check, HelpCircle, ChevronDown, Mail, CreditCard, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../../types';
import SubscriptionForm from '../pricing/SubscriptionForm';

interface PricingProps {
  user: UserProfile | null;
}

export default function Pricing({ user }: PricingProps) {
  const [activeFormPlan, setActiveFormPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const plans = [
    {
      name: "Basic Plan",
      price: "PKR 500",
      period: "month",
      desc: "Standard voice generation pack perfect for basic assignments, school models and simple audio logs.",
      credits: "30 voice generations per month",
      duration: "Max audio duration: 1.5 mins",
      details: [
        "Urdu + English voices (Male/Female)",
        "Standard voice quality depth",
        "MP3 audio file downloads",
        "1 GB private cloud bucket storage limit",
        "Audio audit history on Dashboard",
        "No audio watermark",
        "Standard email support queue"
      ],
      cta: "Subscribe Basic",
      popular: false
    },
    {
      name: "Advanced Plan",
      price: "PKR 1,200",
      period: "month",
      desc: "Best valued bundle tailored for independent creators, bloggers, and study group organizers.",
      credits: "250 voice generations per month",
      duration: "Max audio duration: 3 mins",
      details: [
        "Urdu + English voices (Male/Female)",
        "HD Studio voice quality depth",
        "Fast synthesis server processing",
        "MP3 + MP4 waveform video downloads",
        "1 GB private cloud bucket storage limit",
        "Audio audit history on Dashboard",
        "No audio watermark",
        "Priority support line"
      ],
      cta: "Get Advanced Plan",
      popular: true
    },
    {
      name: "Pro Plan",
      price: "PKR 2,500",
      period: "month",
      desc: "Complete studio-level vocoder features built for high-performance faceless narrators and companies.",
      credits: "500 voice generations per month",
      duration: "Max audio duration: 5 mins",
      details: [
        "Premium voices (All Languages)",
        "Studio Vocal HQ processing depth",
        "Dedicated VIP processing queue",
        "MP3 + MP4 waveform video downloads",
        "1 GB private cloud bucket storage limit",
        "Audio audit history on Dashboard",
        "Beta API keys sandbox access",
        "No audio watermark",
        "Dedicated account manager support"
      ],
      cta: "Unlock Pro Account",
      popular: false
    }
  ];

  const comparatives = [
    { feature: "Daily Free Usage", free: "3 runs (max 500 chars)", basic: "No daily cap", advanced: "No daily cap", pro: "No daily cap" },
    { feature: "Monthly Credits Assigned", free: "Capped daily", basic: "30 credits", advanced: "250 credits", pro: "500 credits" },
    { feature: "Max characters limit", free: "500 characters", basic: "2500 characters", advanced: "5000 characters", pro: "5000 characters" },
    { feature: "Urdu Nastaliq Text Support", free: "Yes", basic: "Yes", advanced: "Yes", pro: "Yes" },
    { feature: "Waveform Videography renders", free: "No", basic: "No", advanced: "Yes", pro: "Yes" },
    { feature: "Vocal processing depth", free: "Standard synthesis", basic: "Standard", advanced: "Higher Quality", pro: "Studio VIP Quality" },
    { feature: "Developer API access", free: "No", basic: "No", advanced: "No", pro: "Yes (Future access)" },
    { feature: "Audio Watermarks", free: "None", basic: "None", advanced: "None", pro: "None" }
  ];

  const billingFaqs = [
    {
      q: "How do I pay for my subscription since there is no Stripe?",
      a: "We currently employ manual payment audits for maximum safety. Click 'Subscribe' on any plan cards, fill in the metadata form and transfer your subscription cash via Bank wire, Easypaisa, or JazzCash to the coordinates listed in the checkout trigger. Our admins read coordinates of proof and upgrade your account structure."
    },
    {
      q: "When do my monthly credits reset?",
      a: "Your account credits are assigned immediately on plan approval. They are set to renew on your billing anniversary date every subsequent month (tracked securely in our database limits settings)."
    },
    {
      q: "What happens if I use all my monthly speech credits early?",
      a: "No problem. You can prompt a credit top-up subscription request earlier by submitting another manual proof form, or reach out directly to support (hananirfan91@gmail.com) and our admins can adjust credits instantly."
    },
    {
      q: "Is there an auto-renewal charge?",
      a: "No. Since checkout is completely manual, you will never be auto-billed or surprised by recurring card statements. You only submit payments when you intend to secure active credits."
    }
  ];

  return (
    <article id="pricing-page-root" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 transition-colors">
      
      {/* Title headlines */}
      <section className="text-center mb-12 flex flex-col items-center">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
          Simple Pricing for Every Creator
        </h1>
        <h2 className="text-sm sm:text-base text-text-muted mt-3 max-w-xl font-sans font-medium">
          Choose Your URH LABS Plan. Premium, long-duration natural AI voice conversions backed by manual payment audits. No lock-ins.
        </h2>
      </section>



      {/* Pricing Cards bento-grid */}
      <section id="pricing-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 items-stretch">
        {plans.map((p, i) => (
          <div
            key={i}
            className={`p-6 bg-card-bg rounded-2xl border flex flex-col justify-between relative shadow-lg ${
              p.popular 
                ? 'border-primary ring-1 ring-primary/30 shadow-primary/5 -translate-y-1' 
                : 'border-border-custom hover:border-text-muted/40'
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-6 px-2.5 py-0.5 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                RECOMMENDED BEST VALUE
              </span>
            )}
            
            {/* Upper part */}
            <div>
              <p className="font-display text-base font-bold text-text-primary mb-1">{p.name}</p>
              <p className="text-[11px] text-text-muted leading-relaxed min-h-[44px] mb-4">{p.desc}</p>
              
              <div className="flex items-baseline gap-1 border-b border-border-custom/50 pb-5 mb-5">
                <span className="font-display text-3xl font-extrabold text-[#00d9a6]">{p.price}</span>
                <span className="text-xs text-text-muted">/ {p.period}</span>
              </div>

              {/* Major limits bullets highlights */}
              <div className="flex flex-col gap-2.5 mb-6 text-xs text-text-primary font-medium">
                <div className="flex items-center gap-2 text-secondary">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{p.credits}</span>
                </div>
                <div className="flex items-center gap-2 text-[#6c63ff]">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{p.duration}</span>
                </div>
              </div>

              {/* Detailed list bullet */}
              <ul className="flex flex-col gap-3 p-0 m-0 list-none text-xs text-text-muted border-t border-border-custom/30 pt-5">
                {p.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-text-muted shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom button trigger */}
            <button
              type="button"
              onClick={() => setActiveFormPlan(p.name)}
              className={`w-full py-3 font-semibold text-xs border border-transparent rounded-xl cursor-pointer transition-all mt-8 text-center flex items-center justify-center ${
                p.popular
                  ? 'bg-primary hover:bg-[#574feb] text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5'
                  : 'bg-dark-bg hover:bg-border-custom/30 text-text-primary border-border-custom hover:border-text-muted font-bold'
              }`}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </section>

      {/* Pricing Comparisons table blocks */}
      <section id="comparisons-table" className="mb-24 overflow-x-auto border border-border-custom bg-card-bg/20 rounded-2xl p-4 sm:p-6 shadow-md">
        <h3 className="font-display text-lg font-bold text-text-primary tracking-tight mb-5 text-center sm:text-left">
          Plan Features Comparisons
        </h3>
        
        <table className="w-full text-xs text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-border-custom/80 text-text-muted font-mono tracking-wider uppercase">
              <th className="py-3 px-2">Core Features</th>
              <th className="py-3 px-2">Free Sandbox</th>
              <th className="py-3 px-2">Basic Tier</th>
              <th className="py-3 px-2 text-[#00d9a6]">Advanced Tier</th>
              <th className="py-3 px-2">Pro Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-custom/30 text-text-muted">
            {comparatives.map((c, idx) => (
              <tr key={idx} className="hover:bg-card-bg/30 transition-colors">
                <td className="py-3 px-2 font-semibold text-text-primary">{c.feature}</td>
                <td className="py-3 px-2">{c.free}</td>
                <td className="py-3 px-2">{c.basic}</td>
                <td className="py-3 px-2 text-[#00d9a6] font-medium">{c.advanced}</td>
                <td className="py-3 px-2">{c.pro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Collapsible FAQ accordions */}
      <section id="billing-faq" className="max-w-4xl mx-auto py-8">
        <p className="text-xs font-bold text-secondary uppercase tracking-widest font-display mb-1 text-center font-bold">
          Billing Coordinator Support
        </p>
        <h3 className="font-display text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight mb-8 text-center">
          Payment & Billing Questions
        </h3>

        <div className="flex flex-col gap-3 text-left">
          {billingFaqs.map((faq, i) => (
            <div
              key={i}
              className="bg-card-bg border border-border-custom rounded-xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFaq(i)}
                className="w-full flex items-center justify-between p-4 bg-transparent border-0 text-text-primary hover:text-primary transition-colors cursor-pointer text-left focus:outline-none"
              >
                <span className="font-display text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-text-muted shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className={`h-4.5 w-4.5 text-text-muted transition-transform duration-200 shrink-0 ${openFaq === i ? 'rotate-180 text-primary' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-10 pb-4 text-xs text-text-muted leading-relaxed border-t border-border-custom/30 pt-3 bg-dark-bg/20 animate-in slide-in-from-top-1 duration-150">
                  {faq.a}
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-text-muted bg-dark-bg/40 border border-border-custom/50 p-2 rounded">
                    <ShieldAlert className="h-3.5 w-3.5 text-secondary shrink-0" />
                    <span>Need immediate live help? Email us or message on WhatsApp: <strong>hananirfan91@gmail.com</strong></span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PRICING PAGE SEO SECTIONS */}
      <section id="pricing-seo-descriptions" className="mx-auto max-w-7xl mt-16 pt-12 border-t border-border-custom/30 text-left">
        <h3 className="font-display text-lg font-bold text-text-primary mb-6 text-center">
          Comprehensive Audio Billing & Storage Infrastructure Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Box 1 */}
          <div className="p-6 bg-card-bg/40 border border-border-custom rounded-2xl flex flex-col gap-2">
            <h4 className="font-display text-xs font-semibold text-text-primary uppercase tracking-wider text-secondary">
              1. Flexible Credits Assignment & Character Scopes
            </h4>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Our plan tires are built to suit every budget scale. From our Basic bundle providing 30 credits (each credit covers a full distinct synthesis track up to 2500 characters) to Pro levels giving 500 complete high-character generations, you only buy what your workflow needs. No recursive automated cards fees.
            </p>
          </div>

          {/* Box 2 */}
          <div className="p-6 bg-card-bg/40 border border-border-custom rounded-2xl flex flex-col gap-2">
            <h4 className="font-display text-xs font-semibold text-text-primary uppercase tracking-wider text-primary">
              2. Secure Manual Payments Verification Loop
            </h4>
            <p className="text-[11px] text-text-muted leading-relaxed">
              We leverage direct manual payments verification to protect our networks from fraudulent card chargebacks. Simply select a pack, fill standard contact details, and transfer payment via Bank, Easypaisa, or JazzCash. Our operators verify details in under 24 hours to secure manual account upgrades instantly.
            </p>
          </div>

          {/* Box 3 */}
          <div className="p-6 bg-card-bg/40 border border-border-custom rounded-2xl flex flex-col gap-2">
            <h4 className="font-display text-xs font-semibold text-text-primary uppercase tracking-wider text-secondary">
              3. Cloud Storage Capacity & Bucket Archiving Limits
            </h4>
            <p className="text-[11px] text-text-muted leading-relaxed">
              All selected packages are linked to a strict 1 GB premium private storage bucket configuration. This provides plenty of space to maintain high-quality MP3 tracks and heavy MP4 waveform video visualizers. We encrypt and retain your audio logs safely without leaking credentials publicly.
            </p>
          </div>

        </div>
      </section>

      {/* Checkout Form Modal popup */}
      {activeFormPlan && (
        <SubscriptionForm
          user={user}
          selectedPlan={activeFormPlan}
          onClose={() => setActiveFormPlan(null)}
          onSuccess={() => {
            setActiveFormPlan(null);
          }}
        />
      )}

    </article>
  );
}
