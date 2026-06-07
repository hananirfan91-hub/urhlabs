import React, { useState } from 'react';
import { X, CheckCircle, Smartphone, CreditCard, Shield, Send } from 'lucide-react';
import { UserProfile } from '../../types';

interface SubscriptionFormProps {
  user: UserProfile | null;
  selectedPlan: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubscriptionForm({ user, selectedPlan, onClose, onSuccess }: SubscriptionFormProps) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Please fill out both Name and Email standard inputs.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          plan: selectedPlan,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit request.");
      }

      setCompleted(true);
      setTimeout(() => {
        onSuccess();
      }, 2500);

    } catch (err: any) {
      setError(err.message || "An unexpected transaction error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-bg/85 backdrop-blur-md flex items-center justify-center p-4">
      <div id="subscription-modal" className="w-full max-w-md bg-card-bg border border-border-custom rounded-2xl p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Closed triggers */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 border-0 hover:bg-border-custom/50 rounded-lg text-text-muted hover:text-text-primary transition-colors cursor-pointer bg-transparent"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {!completed ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                <CreditCard className="h-4 w-4" />
              </div>
              <span className="font-display text-[11px] font-bold text-primary uppercase tracking-wider">
                Manual Checkout Request
              </span>
            </div>

            <h3 className="font-display text-lg font-bold text-text-primary mb-1">
              Unlock {selectedPlan} Access
            </h3>
            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Since we use manual verified activations, submit your account details below. Transfer payment, add notes (e.g. Bank Ref link, Easypaisa info or WhatsApp receipt) and we will activate your plan in under 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Plan display badge */}
              <div className="p-3 bg-dark-bg rounded-lg border border-border-custom flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">Selected Plan Package</p>
                  <p className="text-sm font-bold text-secondary">{selectedPlan}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded">
                  Manual Activation
                </span>
              </div>

              {/* Full Name input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-primary">
                  1. Your Full Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Irfan Hanan"
                  className="px-3.5 py-2 text-sm bg-dark-bg border border-border-custom rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Contact Email input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-primary">
                  2. Registered Email Address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  disabled={!!user}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. hanan@yourdomain.com"
                  className="px-3.5 py-2 text-sm bg-dark-bg border border-border-custom rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                />
              </div>

              {/* Optional Phone/WhatsApp */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-primary flex items-center gap-1">
                  <Smartphone className="h-3 w-3 text-text-muted" />
                  3. Whatsapp Number (with country code)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +92 310 6359235"
                  className="px-3.5 py-2 text-sm bg-dark-bg border border-border-custom rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Payment Receipt reference description notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-primary mb-0.5">
                  4. Payment Proof / Reference Details
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Transferred 1200 PKR via Easypaisa/HBL. TranID: 981273. Screen receipt attached on WhatsApp support."
                  className="px-3.5 py-2 text-sm bg-dark-bg border border-border-custom rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary leading-normal resize-none"
                />
              </div>

              {/* Error logs */}
              {error && (
                <p className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                  {error}
                </p>
              )}

              {/* Actions submit buttons */}
              <div className="grid grid-cols-2 gap-3 mt-1 border-t border-border-custom/50 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 bg-dark-bg hover:bg-card-bg text-text-muted font-semibold text-xs border border-border-custom rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-primary hover:bg-[#574feb] text-white font-semibold text-xs border-0 rounded-xl cursor-pointer flex items-center justify-center gap-1"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3 w-3" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>

              {/* Protection badge policy */}
              <div className="flex items-center gap-1 text-[10px] text-text-muted justify-center mt-1">
                <Shield className="h-3.5 w-3.5 text-secondary" />
                <span>Encrypted secure verification. Activates within 24 hours.</span>
              </div>

            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="w-16 h-16 bg-secondary/10 border border-secondary/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="font-display text-lg font-bold text-text-primary mb-2">
              Request Received Successfully!
            </h3>
            <p className="text-sm text-text-muted leading-relaxed max-w-sm px-2">
              Your activation request for <strong className="text-secondary">{selectedPlan}</strong> has been secured. Our team will manually audit payment and activate your customer credits within 24 hours.
            </p>
            <span className="text-[11px] text-text-muted font-mono mt-4 block">
              Returning back shortly...
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
