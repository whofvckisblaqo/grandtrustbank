import LegalPageLayout from '@/components/LegalPageLayout';

export const metadata = {
  title: 'Cookie Policy — Grand Trust Bank',
  description: 'How Grand Trust Bank uses cookies and similar tracking technologies.',
};

function Section({ heading, children }) {
  return (
    <div>
      <h2 className="text-white font-bold text-lg mb-3">{heading}</h2>
      <div className="text-gtb-subtle text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="July 1, 2026">
      <Section heading="1. What Are Cookies">
        <p>
          Cookies are small text files placed on your device when you visit our website. They help us
          recognize your device, remember your preferences, and understand how you use our Services.
        </p>
      </Section>

      <Section heading="2. Types of Cookies We Use">
        <div className="space-y-4">
          <div>
            <h3 className="text-white font-semibold text-sm mb-1">Essential Cookies</h3>
            <p>
              Required for core functionality such as keeping you logged in, maintaining session security,
              and enabling account access. These cannot be disabled without affecting the Services.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-1">Performance Cookies</h3>
            <p>
              Help us understand how visitors interact with our website so we can improve performance
              and usability.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-1">Functional Cookies</h3>
            <p>
              Remember your preferences, such as display settings, to provide a more personalized
              experience.
            </p>
          </div>
        </div>
      </Section>

      <Section heading="3. Third-Party Cookies">
        <p>
          Some cookies may be placed by third-party services we use, such as live chat support and
          analytics providers, to help us operate and improve our Services.
        </p>
      </Section>

      <Section heading="4. Managing Cookies">
        <p>
          Most browsers allow you to control cookies through their settings. Note that disabling essential
          cookies may prevent you from logging in or using core banking features.
        </p>
      </Section>

      <Section heading="5. Changes to This Policy">
        <p>
          We may update this Cookie Policy periodically. Changes will be posted on this page with an
          updated "Last updated" date.
        </p>
      </Section>

      <Section heading="6. Contact Us">
        <p>Questions about our use of cookies can be directed to grandtrustsuport@outlook.com.</p>
      </Section>
    </LegalPageLayout>
  );
}