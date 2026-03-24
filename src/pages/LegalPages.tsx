import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import appIcon from "@/assets/app-icon-base.png";

interface StandaloneLegalProps {
  title: string;
  children: React.ReactNode;
}

function StandaloneLegal({ title, children }: StandaloneLegalProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-foreground min-h-[100dvh]">
      <div className="px-5 pt-safe pb-16 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 pt-6 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl bg-secondary text-secondary-foreground min-w-[44px] min-h-[44px] flex items-center justify-center active:bg-secondary/80"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
        </div>
        <div className="prose prose-sm text-foreground space-y-4">
          {children}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={appIcon} alt="Bite" width={24} height={24} className="rounded-lg" />
              <span className="font-display font-bold text-sm text-foreground">Bite</span>
            </div>
            <div className="flex gap-5 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return (
    <StandaloneLegal title="Privacy Policy">
      <p className="text-sm text-muted-foreground">Last updated: March 2026</p>

      <h3 className="font-display font-semibold text-base text-foreground">Overview</h3>
      <p className="text-sm text-foreground/80">
        Bite ("we", "our", "the app") is committed to protecting your privacy. This policy explains how we handle data when you use our app and website at usebiteapp.com.
      </p>

      <h3 className="font-display font-semibold text-base text-foreground">Data Collection</h3>
      <p className="text-sm text-foreground/80">
        We do not collect any personal information. All your preferences, saved meals, and history are stored locally on your device using browser storage. We do not have access to this data.
      </p>

      <h3 className="font-display font-semibold text-base text-foreground">Analytics</h3>
      <p className="text-sm text-foreground/80">
        We may use lightweight, privacy-respecting analytics to understand how the app is used (e.g., which features are popular). This data is anonymous and cannot be used to identify you personally.
      </p>

      <h3 className="font-display font-semibold text-base text-foreground">Affiliate Links & Monetization</h3>
      <p className="text-sm text-foreground/80">
        Bite may display links to third-party services such as food delivery platforms (e.g., Uber Eats, DoorDash) and grocery providers (e.g., Instacart). These links may be affiliate links, meaning we may earn a small commission if you make a purchase through them. This does not affect the price you pay. We only recommend services relevant to your meal suggestions.
      </p>

      <h3 className="font-display font-semibold text-base text-foreground">Sponsored Content</h3>
      <p className="text-sm text-foreground/80">
        The app may display clearly labeled sponsored content or native advertisements. These are always marked as "Sponsored" and are designed to match the app experience without being intrusive.
      </p>

      <h3 className="font-display font-semibold text-base text-foreground">Third-Party Services</h3>
      <p className="text-sm text-foreground/80">
        When you click affiliate or delivery links, you will be directed to third-party websites. These sites have their own privacy policies, which we encourage you to review.
      </p>

      <h3 className="font-display font-semibold text-base text-foreground">Data Storage</h3>
      <p className="text-sm text-foreground/80">
        Your saved meals and preferences are stored exclusively in your device's local storage. Clearing your browser data will remove this information. No data is stored on our servers.
      </p>

      <h3 className="font-display font-semibold text-base text-foreground">Children's Privacy</h3>
      <p className="text-sm text-foreground/80">
        Bite is not directed at children under 13. We do not knowingly collect information from children.
      </p>

      <h3 className="font-display font-semibold text-base text-foreground">Contact</h3>
      <p className="text-sm text-foreground/80">
        If you have questions about this privacy policy, please contact us at <a href="mailto:matchragroup@gmail.com" className="text-primary underline">matchragroup@gmail.com</a>.
      </p>
    </StandaloneLegal>
  );
}

export function TermsPage() {
  return (
    <StandaloneLegal title="Terms of Service">
      <p className="text-sm text-muted-foreground">Last updated: March 2026</p>

      <h3 className="font-display font-semibold text-base text-foreground">Acceptance of Terms</h3>
      <p className="text-sm text-foreground/80">
        By using Bite (the "App"), accessible at usebiteapp.com and through native applications, you agree to these Terms of Service. If you disagree, please discontinue use of the app.
      </p>

      <h3 className="font-display font-semibold text-base text-foreground">Service Description</h3>
      <p className="text-sm text-foreground/80">
        Bite provides meal suggestions based on your mood, time, and budget preferences. The app is designed to help you make quick food decisions.
      </p>

      <h3 className="font-display font-semibold text-base text-foreground">Informational Purpose Only</h3>
      <p className="text-sm text-foreground/80">
        All meal suggestions are for informational and entertainment purposes only. They do not constitute dietary, nutritional, or medical advice. Always consider your own dietary needs, allergies, and health conditions when making food choices.
      </p>

      <h3 className="font-display font-semibold text-base text-foreground">Third-Party Links</h3>
      <p className="text-sm text-foreground/80">
        The app may contain links to third-party services including food delivery platforms and grocery providers. We are not responsible for the content, policies, or practices of these third-party services. Use of affiliate links may result in compensation to Bite.
      </p>

      <h3 className="font-display font-semibold text-base text-foreground">Disclaimer of Warranties</h3>
      <p className="text-sm text-foreground/80">
        The app is provided "as is" without warranties of any kind, express or implied. We do not guarantee the accuracy, completeness, or usefulness of any meal suggestion. We are not responsible for any dietary decisions made based on app suggestions.
      </p>

      <h3 className="font-display font-semibold text-base text-foreground">Limitation of Liability</h3>
      <p className="text-sm text-foreground/80">
        To the fullest extent permitted by law, Bite shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the app.
      </p>

      <h3 className="font-display font-semibold text-base text-foreground">Modifications</h3>
      <p className="text-sm text-foreground/80">
        We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance of the new terms. We will update the "Last updated" date when changes are made.
      </p>

      <h3 className="font-display font-semibold text-base text-foreground">Contact</h3>
      <p className="text-sm text-foreground/80">
        Questions about these terms? Contact us at <a href="mailto:matchragroup@gmail.com" className="text-primary underline">matchragroup@gmail.com</a>.
      </p>
    </StandaloneLegal>
  );
}

export function ContactPage() {
  return (
    <StandaloneLegal title="Contact & Support">
      <h3 className="font-display font-semibold text-base text-foreground">Get in Touch</h3>
      <p className="text-sm text-foreground/80">
        We'd love to hear from you! Whether you have feedback, found a bug, or just want to say hi.
      </p>

      <div className="bg-muted rounded-2xl p-5 space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</p>
          <a href="mailto:matchragroup@gmail.com" className="text-sm text-primary font-medium">matchragroup@gmail.com</a>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Website</p>
          <a href="https://usebiteapp.com" className="text-sm text-primary font-medium">usebiteapp.com</a>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Response Time</p>
          <p className="text-sm text-foreground">We typically respond within 48 hours.</p>
        </div>
      </div>

      <h3 className="font-display font-semibold text-base text-foreground">FAQ</h3>
      <p className="text-sm text-foreground/80">
        <strong>Is my data safe?</strong> Yes. All data is stored locally on your device. We don't collect or transmit any personal information.
      </p>
      <p className="text-sm text-foreground/80">
        <strong>Do I need an account?</strong> No. Bite works without any sign-up or login.
      </p>
      <p className="text-sm text-foreground/80">
        <strong>Can I request new meals?</strong> Absolutely! Send us an email with your suggestions and we'll consider adding them.
      </p>
      <p className="text-sm text-foreground/80">
        <strong>How does Bite make money?</strong> We use non-intrusive affiliate links and sponsored content. These are clearly labeled and never interrupt your experience.
      </p>
      <p className="text-sm text-foreground/80">
        <strong>Is Bite free?</strong> Yes, Bite is completely free to use.
      </p>
    </StandaloneLegal>
  );
}
