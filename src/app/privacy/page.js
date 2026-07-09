import LegalPageLayout from '@/components/LegalPageLayout';

export const metadata = {
  title: 'Privacy Policy — Grand Trust Bank',
  description: 'How Grand Trust Bank collects, uses, and protects your personal information.',
};

function Section({ heading, children }) {
  return (
    <div>
      <h2 className="text-white font-bold text-lg mb-3">{heading}</h2>
      <div className="text-gtb-subtle text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="July 1, 2026">
      <Section heading="1. Introduction">
        <p>
          Grand Trust Bank, N.A. ("GTB," "we," "us," or "our") is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information
          when you use our website, mobile application, and banking services (collectively, the "Services").
        </p>
      </Section>

      <Section heading="2. Information We Collect">
        <p>We collect information you provide directly to us, including:</p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>Identity information (full name, date of birth, government-issued ID, Social Security or National ID number)</li>
          <li>Contact information (email address, phone number, mailing address)</li>
          <li>Financial information (account balances, transaction history, income, employment details)</li>
          <li>Authentication data (passwords, security questions, one-time verification codes)</li>
          <li>Identity verification documents submitted during KYC (Know Your Customer) review</li>
        </ul>
        <p>
          We also automatically collect device information, IP addresses, browser type, and usage data
          through cookies and similar tracking technologies when you access our Services.
        </p>
      </Section>

      <Section heading="3. How We Use Your Information">
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>To open, maintain, and service your account</li>
          <li>To process transactions, transfers, and payments you authorize</li>
          <li>To verify your identity and comply with legal and regulatory obligations, including anti-money laundering (AML) and Know Your Customer (KYC) requirements</li>
          <li>To detect, investigate, and prevent fraud, unauthorized transactions, and other illegal activity</li>
          <li>To communicate with you about your account, security alerts, and service updates</li>
          <li>To improve our Services and develop new features</li>
        </ul>
      </Section>

      <Section heading="4. How We Share Your Information">
        <p>We do not sell your personal information. We may share your information with:</p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>Regulatory bodies and law enforcement, where required by law</li>
          <li>Service providers who help us operate our Services (e.g., identity verification, email delivery, cloud infrastructure), under contractual confidentiality obligations</li>
          <li>Other financial institutions when you initiate a transfer to or from an external account</li>
          <li>Successors in the event of a merger, acquisition, or sale of assets</li>
        </ul>
      </Section>

      <Section heading="5. Data Security">
        <p>
          We use industry-standard security measures, including 256-bit encryption, secure data storage,
          and access controls, to protect your information from unauthorized access, alteration, or
          disclosure. However, no method of transmission or storage is 100% secure, and we cannot
          guarantee absolute security.
        </p>
      </Section>

      <Section heading="6. Data Retention">
        <p>
          We retain your information for as long as your account is active and as necessary to comply
          with our legal and regulatory obligations, including record-keeping requirements imposed by
          banking regulators, which may extend beyond the closure of your account.
        </p>
      </Section>

      <Section heading="7. Your Rights">
        <p>
          Depending on your jurisdiction, you may have the right to access, correct, or request deletion
          of your personal information, subject to our legal obligations to retain certain records.
          To exercise these rights, contact us at the email address below.
        </p>
      </Section>

      <Section heading="8. Children's Privacy">
        <p>
          Our Services are not directed to individuals under 18. We do not knowingly collect personal
          information from minors.
        </p>
      </Section>

      <Section heading="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify you of material changes
          by posting the updated policy on this page and updating the "Last updated" date above.
        </p>
      </Section>

      <Section heading="10. Contact Us">
        <p>
          If you have questions about this Privacy Policy, contact us at grandtrustsuport@outlook.com or
          write to us at 350 Fifth Avenue, New York, NY 10118.
        </p>
      </Section>
    </LegalPageLayout>
  );
}