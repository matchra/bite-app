import { ArrowLeft } from "lucide-react";

interface LegalPageProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

export default function LegalPage({ title, onBack, children }: LegalPageProps) {
  return (
    <div className="px-5 pt-safe pb-28 max-w-lg mx-auto">
      <div className="flex items-center gap-3 pt-6 mb-6">
        <button onClick={onBack} className="p-2.5 rounded-xl bg-secondary text-secondary-foreground min-w-[44px] min-h-[44px] flex items-center justify-center active:bg-secondary/80">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
      </div>
      <div className="prose prose-sm text-foreground space-y-4">
        {children}
      </div>
    </div>
  );
}

export function PrivacyPolicy({ onBack }: { onBack: () => void }) {
  return (
    <LegalPage title="Privacy Policy" onBack={onBack}>
      <p className="text-sm text-muted-foreground">Last updated: March 2026</p>
      <h3 className="font-display font-semibold text-base text-foreground">Overview</h3>
      <p className="text-sm text-foreground/80">What Should I Eat? is committed to protecting your privacy. This app does not collect, store, or transmit any personal data to external servers.</p>
      <h3 className="font-display font-semibold text-base text-foreground">Data Collection</h3>
      <p className="text-sm text-foreground/80">We do not collect any personal information. All preferences and saved meals are stored locally on your device using browser storage.</p>
      <h3 className="font-display font-semibold text-base text-foreground">Third-Party Services</h3>
      <p className="text-sm text-foreground/80">This app does not use any third-party analytics, advertising, or tracking services.</p>
      <h3 className="font-display font-semibold text-base text-foreground">Data Storage</h3>
      <p className="text-sm text-foreground/80">Your saved meals and preferences are stored exclusively in your device's local storage. Clearing your browser data will remove this information.</p>
      <h3 className="font-display font-semibold text-base text-foreground">Contact</h3>
      <p className="text-sm text-foreground/80">If you have questions about this privacy policy, please contact us at support@whatshouldeat.app</p>
    </LegalPage>
  );
}

export function TermsOfService({ onBack }: { onBack: () => void }) {
  return (
    <LegalPage title="Terms of Service" onBack={onBack}>
      <p className="text-sm text-muted-foreground">Last updated: March 2026</p>
      <h3 className="font-display font-semibold text-base text-foreground">Acceptance</h3>
      <p className="text-sm text-foreground/80">By using What Should I Eat?, you agree to these terms. If you disagree, please discontinue use of the app.</p>
      <h3 className="font-display font-semibold text-base text-foreground">Service Description</h3>
      <p className="text-sm text-foreground/80">What Should I Eat? provides meal suggestions based on your preferences. Suggestions are for informational purposes only and do not constitute dietary or nutritional advice.</p>
      <h3 className="font-display font-semibold text-base text-foreground">Disclaimer</h3>
      <p className="text-sm text-foreground/80">The app is provided "as is" without warranties of any kind. We are not responsible for any dietary decisions made based on app suggestions. Please consider any food allergies or dietary restrictions.</p>
      <h3 className="font-display font-semibold text-base text-foreground">Modifications</h3>
      <p className="text-sm text-foreground/80">We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of the new terms.</p>
    </LegalPage>
  );
}

export function ContactSupport({ onBack }: { onBack: () => void }) {
  return (
    <LegalPage title="Contact & Support" onBack={onBack}>
      <h3 className="font-display font-semibold text-base text-foreground">Get in Touch</h3>
      <p className="text-sm text-foreground/80">We'd love to hear from you! Whether you have feedback, found a bug, or just want to say hi.</p>
      <div className="bg-muted rounded-2xl p-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Email</p>
          <p className="text-sm text-foreground">support@whatshouldeat.app</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">Response Time</p>
          <p className="text-sm text-foreground">We typically respond within 48 hours.</p>
        </div>
      </div>
      <h3 className="font-display font-semibold text-base text-foreground">FAQ</h3>
      <p className="text-sm text-foreground/80"><strong>Is my data safe?</strong> Yes. All data is stored locally on your device. We don't collect or transmit any information.</p>
      <p className="text-sm text-foreground/80"><strong>Do I need an account?</strong> No. The app works without any sign-up or login.</p>
      <p className="text-sm text-foreground/80"><strong>Can I request new meals?</strong> Absolutely! Send us an email with your suggestions.</p>
    </LegalPage>
  );
}
