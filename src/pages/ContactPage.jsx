import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[var(--color-surface-950)] text-[var(--color-fg-default)] font-sans transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-surface-700)] bg-[var(--color-surface-950)]">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-[var(--color-surface-800)] flex items-center justify-center border border-[var(--color-surface-700)]">
            <Zap size={16} className="text-[var(--color-fg-default)]" />
          </div>
          <span className="font-semibold text-[16px] text-[var(--color-fg-default)] tracking-tight">Oasis</span>
        </Link>
        <Link to="/" className="flex items-center gap-2 text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)] transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </header>

      {/* Content */}
      <div className="max-w-[560px] mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2 text-[var(--color-fg-default)]">Contact Us</h1>
        <p className="text-sm text-[var(--color-fg-muted)] mb-10">Have a question, concern, or feedback? Reach out and we will get back to you within 24 hours.</p>

        {submitted ? (
          <div className="bg-[var(--color-surface-900)] border border-[var(--color-surface-700)] rounded-xl p-10 text-center">
            <CheckCircle size={48} className="text-[var(--color-success-fg)] mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-[var(--color-fg-default)]">Message Sent</h2>
            <p className="text-[var(--color-fg-muted)] text-sm mb-6">
              Thank you for reaching out. Our team will review your message and respond within 24 hours.
            </p>
            <Link to="/" className="text-[var(--color-accent-fg)] text-sm font-medium hover:underline">
              Return to Home
            </Link>
          </div>
        ) : (
          <div className="bg-[var(--color-surface-900)] border border-[var(--color-surface-700)] rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[14px] font-medium mb-2 text-[var(--color-fg-default)]">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] rounded-md px-3 py-2 text-[14px] text-[var(--color-fg-default)] focus:outline-none focus:border-[var(--color-accent-fg)] focus:ring-1 focus:ring-[var(--color-accent-fg)] transition-all"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium mb-2 text-[var(--color-fg-default)]">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] rounded-md px-3 py-2 text-[14px] text-[var(--color-fg-default)] focus:outline-none focus:border-[var(--color-accent-fg)] focus:ring-1 focus:ring-[var(--color-accent-fg)] transition-all"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium mb-2 text-[var(--color-fg-default)]">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="w-full bg-[var(--color-surface-950)] border border-[var(--color-surface-700)] rounded-md px-3 py-2 text-[14px] text-[var(--color-fg-default)] focus:outline-none focus:border-[var(--color-accent-fg)] focus:ring-1 focus:ring-[var(--color-accent-fg)] transition-all resize-none"
                  placeholder="Tell us what's on your mind..."
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-700)] text-white rounded-md py-2.5 font-medium border border-[rgba(240,246,252,0.1)] transition-colors flex items-center justify-center gap-2"
              >
                <Send size={16} /> Send Message
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--color-surface-700)] text-sm text-[var(--color-fg-muted)]">
              <p className="mb-1">Or email us directly:</p>
              <a href="mailto:support@oasis.io" className="text-[var(--color-accent-fg)] font-medium hover:underline">
                support@oasis.io
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-[var(--color-surface-700)] text-[12px] text-[var(--color-fg-muted)] flex items-center justify-between max-w-[560px] w-full mx-auto">
        <div>© 2026 Oasis, Inc.</div>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-[var(--color-accent-fg)] transition-colors">Privacy Policy</Link>
        </div>
      </footer>
    </main>
  );
}
