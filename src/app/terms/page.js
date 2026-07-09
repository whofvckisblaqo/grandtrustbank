import LegalPageLayout from '@/components/LegalPageLayout';

export const metadata = {
  title: 'Terms of Service — Grand Trust Bank',
  description: 'The terms and conditions governing your use of Grand Trust Bank services.',
};

function Section({ heading, children }) {
  return (
    <div>
      <h2 className="text-white font-bold text-lg mb-3">{heading}</h2>
      <div className="text-gtb-subtle text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="July 1, 2026">
      <Section heading="1. Acceptance of Terms">
        <p>
          By creating an account or using any Grand Trust Bank, N.A. ("GTB," "we," "us") service, you
          agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use our
          Services.
        </p>
      </Section>

      <Section heading="2. Eligibility">
        <p>
          You must be at least 18 years old, a legal resident of a supported jurisdiction, and able to
          form a binding contract to open an account with GTB. You must provide accurate, current, and
          complete information during registration and identity verification.
        </p>
      </Section>

      <Section heading="3. Account Registration and Security">
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>You are responsible for maintaining the confidentiality of your login credentials and one-time verification codes</li>
          <li>You must notify us immediately of any unauthorized use of your account</li>
          <li>You are responsible for all activity that occurs under your account, except as limited by applicable law</li>
        </ul>
      </Section>

      <Section heading="4. Identity Verification (KYC)">
        <p>
          As a regulated financial institution, we are required to verify your identity before providing
          full access to our Services. You agree to provide accurate identification documents and
          information as requested. We reserve the right to suspend or limit account functionality
          pending successful verification.
        </p>
      </Section>

      <Section heading="5. Account Usage">
        <p>You agree not to use your account to:</p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>Engage in fraudulent, illegal, or unauthorized transactions</li>
          <li>Launder money or finance illegal activity</li>
          <li>Violate any applicable law or regulation</li>
          <li>Circumvent our security measures or attempt unauthorized access to other accounts</li>
        </ul>
      </Section>

      <Section heading="6. Fees and Transfers">
        <p>
          Fees applicable to transfers, wires, and other services are disclosed at the time of the
          transaction. Transfers to external or third-party accounts may require administrative review
          before funds are released, as disclosed within the transfer flow. We reserve the right to
          decline, delay, or reverse any transaction that appears fraudulent or violates these Terms.
        </p>
      </Section>

      <Section heading="7. Account Suspension and Termination">
        <p>
          We may suspend or close your account at our discretion, including for suspected fraud,
          violation of these Terms, or as required by law. You may close your account at any time by
          contacting support, subject to settlement of any outstanding obligations.
        </p>
      </Section>

      <Section heading="8. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, GTB shall not be liable for indirect, incidental, or
          consequential damages arising from your use of the Services, except where such liability
          cannot be excluded under applicable law.
        </p>
      </Section>

      <Section heading="9. Changes to These Terms">
        <p>
          We may update these Terms from time to time. Continued use of the Services after changes take
          effect constitutes acceptance of the revised Terms.
        </p>
      </Section>

      <Section heading="10. Governing Law">
        <p>
          These Terms are governed by the laws of the State of New York, without regard to its conflict
          of law principles.
        </p>
      </Section>

      <Section heading="11. Contact Us">
        <p>
          Questions about these Terms can be directed to grandtrustsuport@outlook.com.
        </p>
      </Section>
    </LegalPageLayout>
  );
}