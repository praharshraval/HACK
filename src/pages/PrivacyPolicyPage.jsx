import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
      <div className="max-w-[720px] mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2 text-[var(--color-fg-default)]">Privacy Policy</h1>
        <p className="text-sm text-[var(--color-fg-muted)] mb-10">Last updated: April 10, 2026</p>

        <div className="space-y-8 text-[15px] text-[var(--color-fg-muted)] leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-fg-default)] mb-3">1. Information We Collect</h2>
            <p>
              When you create an account on Oasis, we collect information you provide directly, including your name, 
              email address, GitHub profile, and UPI payment identifier. We also automatically collect usage data such as 
              pages viewed, features used, and contribution activity within the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-fg-default)] mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to operate and improve Oasis, including calculating stake allocations, 
              processing royalty distributions, verifying contribution provenance via GitHub integration, and communicating 
              with you about your account and platform updates.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-fg-default)] mb-3">3. GitHub Integration</h2>
            <p>
              When you connect your GitHub account, we request access to read your public profile, email address, and 
              repository information. This data is used solely to verify contributions, calculate stake ownership, and 
              import project metadata. We do not modify your repositories or push code on your behalf without explicit 
              consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-fg-default)] mb-3">4. Financial Data</h2>
            <p>
              UPI identifiers and wallet balances are stored securely to facilitate royalty payouts. We do not store 
              bank account numbers or credit card information. All financial transactions are logged for transparency 
              and audit purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-fg-default)] mb-3">5. Data Sharing</h2>
            <p>
              We do not sell your personal information to third parties. We may share anonymized, aggregated analytics 
              data with partners. Your contribution history and stake percentages are visible to other authenticated 
              users within projects you participate in, as this transparency is core to the platform's function.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-fg-default)] mb-3">6. Data Retention & Deletion</h2>
            <p>
              You may request deletion of your account and associated data at any time by contacting us. Upon deletion, 
              we will remove your personal information within 30 days, though anonymized contribution records may be 
              retained for platform integrity.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[var(--color-fg-default)] mb-3">7. Contact</h2>
            <p>
              For questions about this privacy policy, please reach out to us at{' '}
              <a href="mailto:privacy@oasis.io" className="text-[var(--color-accent-fg)] hover:underline">privacy@oasis.io</a>
              {' '}or visit our <Link to="/contact" className="text-[var(--color-accent-fg)] hover:underline">Contact page</Link>.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-[var(--color-surface-700)] text-[12px] text-[var(--color-fg-muted)] flex items-center justify-between max-w-[720px] w-full mx-auto">
        <div>© 2026 Oasis, Inc.</div>
        <div className="flex gap-6">
          <Link to="/contact" className="hover:text-[var(--color-accent-fg)] transition-colors">Contact Us</Link>
        </div>
      </footer>
    </main>
  );
}
