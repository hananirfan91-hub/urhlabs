import React, { useState } from 'react';
import { Mail, PhoneCall, Clock, CheckCircle, Send, MapPin, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    // Simulating message routing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    }, 1200);
  };

  return (
    <article id="contact-page-root" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 transition-colors">
      
      {/* Title headlines blocks */}
      <section className="text-center mb-16 flex flex-col items-center">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
          Contact URH LABS
        </h1>
        <h2 className="text-sm sm:text-base text-text-muted mt-3 max-w-xl font-sans font-medium">
          We'd Love to Hear From You. Submit API key inquiries, custom enterprise requests, and billing manual approvals coordinates directly to our admins.
        </h2>
      </section>

      {/* Main split layout workspace */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        
        {/* Left Side: Contact Form (Takes 3 columns) */}
        <div className="lg:col-span-3 bg-card-bg border border-border-custom rounded-2xl p-6 sm:p-8 shadow-xl">
          <h3 className="font-display text-base font-bold text-text-primary mb-1">
            Send Us a Message
          </h3>
          <p className="text-xs text-text-muted leading-relaxed mb-6">
            Input support tickets, feedback summaries, or questions below. Our support queue processes mail in under 12 hours.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Grid 2 slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 text-xs font-semibold text-text-primary">
                <label>1. Your Full Name <span className="text-primary">*</span></label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ali Ahmed"
                  className="px-3.5 py-2.5 bg-dark-bg border border-border-custom rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary font-sans font-medium text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-xs font-semibold text-text-primary">
                <label>2. Your Contact Email <span className="text-primary">*</span></label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ali@gmail.com"
                  className="px-3.5 py-2.5 bg-dark-bg border border-border-custom rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary font-sans font-medium text-sm"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5 text-xs font-semibold text-text-primary">
              <label>3. Subject Title</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Pro Account Manual Upgrade Approval"
                className="px-3.5 py-2.5 bg-dark-bg border border-border-custom rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary font-sans font-medium text-sm"
              />
            </div>

            {/* Message payload */}
            <div className="flex flex-col gap-1.5 text-xs font-semibold text-text-primary">
              <label>4. Detailed Support Description <span className="text-primary">*</span></label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your issue, question, or details here..."
                className="px-3.5 py-2.5 bg-dark-bg border border-border-custom rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary font-sans font-medium text-sm resize-none leading-relaxed"
              />
            </div>

            {/* Status alerts */}
            {success && (
              <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg flex items-start gap-2.5 text-xs text-secondary leading-normal">
                <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Thank you! Your support ticket has been submitted. Admins have been notified on <strong>hananirfan91@gmail.com</strong>.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-primary hover:bg-[#574feb] text-white font-semibold text-xs border-0 rounded-xl cursor-pointer self-start w-full sm:w-auto shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5 mt-2 transition-all"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Routing Ticket...
                </>
              ) : (
                <>
                  <Send className="h-3 w-3" />
                  Send Message
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Side: Coordinates / Contacts Cards (Takes 2 columns) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Main coords list */}
          <div className="bg-card-bg border border-border-custom p-6 rounded-2xl flex flex-col gap-5">
            <h3 className="font-display text-sm font-bold text-text-primary border-b border-border-custom pb-3">
              Direct Channels
            </h3>

            <div className="flex flex-col gap-4">
              
              {/* Box 1 */}
              <div className="flex gap-3">
                <div className="p-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl h-fit">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold font-display">Administrative Email</span>
                  <span className="text-xs text-text-primary font-medium font-mono mt-0.5">hananirfan91@gmail.com</span>
                </div>
              </div>

              {/* Box 2 */}
              <div className="flex gap-3 border-t border-border-custom/40 pt-4">
                <div className="p-2.5 bg-secondary/15 text-secondary rounded-xl h-fit border border-secondary/20">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold font-display">WhatsApp Hotline Support</span>
                  <span className="text-xs text-text-primary font-medium font-mono mt-0.5">+92 300 1234567</span>
                </div>
              </div>

              {/* Box 3 */}
              <div className="flex gap-3 border-t border-border-custom/40 pt-4">
                <div className="p-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl h-fit">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold font-display">Operational Hours</span>
                  <span className="text-xs text-text-primary font-medium mt-0.5">Monday – Friday: 9:00 AM – 6:00 PM PKT</span>
                </div>
              </div>

              {/* Box 4 */}
              <div className="flex gap-3 border-t border-border-custom/40 pt-4">
                <div className="p-2.5 bg-secondary/15 text-secondary rounded-xl h-fit border border-secondary/20">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold font-display">Headquarters Location</span>
                  <span className="text-xs text-text-primary font-medium mt-0.5">Islamabad Capital Territory, Pakistan</span>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Notice cards */}
          <div className="bg-[#12121a]/60 border border-border-custom p-5 rounded-2xl flex gap-3 text-xs leading-normal">
            <AlertCircle className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5 animate-bounce" />
            <p className="text-text-muted font-sans font-medium">
              <strong>Need a manual top-up?</strong> Make sure you include your original transaction confirmation ID and bank screenshots inside your Whatsapp messages for instant approval updates!
            </p>
          </div>

        </div>

      </section>

    </article>
  );
}
