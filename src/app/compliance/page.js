import LegalPageLayout from '@/components/LegalPageLayout';
import { Shield, CheckCircle, Lock, FileCheck } from 'lucide-react';

export const metadata = {
  title: 'Compliance — Grand Trust Bank',
  description: 'Regulatory compliance, licensing, and security certifications for Grand Trust Bank.',
};

function Section({ heading, children }) {
  return (
    <div>
      <h2 className="text-white font-bold text-lg mb-3">{heading}</h2>
      <div className="text-gtb-subtle text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

const badges = [
  { icon: Shield,    label: 'FDIC Insured',    sub: 'Deposits insured up to $250,000 per depositor' },
  { icon: FileCheck, label: 'FCA Regulated',   sub: 'Registration No. 987654' },
  { icon: Lock,      label: '256-bit SSL',     sub: 'TLS 1.3 encryption on all connections' },
  { icon: CheckCircle, label: 'SOC 2 Type II', sub: 'Independently audited security controls' },
];

export default function CompliancePage() {
  return (
    <LegalPageLayout title="Compliance & Regulation" lastUpdated="July 1, 2026">
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {badges.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gtb-accent/10 border border-gtb-accent/20 flex-shrink-0">
              <Icon size={16} className="text-gtb-accent" />
            </div>
            <div>
              <div className="text-white text-sm font-semibold">{label}</div>
              <div className="text-gtb-muted text-xs mt-0.5">{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <Section heading="1. Regulatory Oversight">
        <p>
          Grand Trust Bank, N.A. is a nationally chartered financial institution regulated in the United
          States and operates under license in Europe under FCA registration number 987654. We are
          subject to ongoing supervision and periodic examination by applicable banking regulators.
        </p>
      </Section>

      <Section heading="2. Deposit Insurance">
        <p>
          Deposits held with Grand Trust Bank, N.A. are insured by the Federal Deposit Insurance
          Corporation (FDIC) up to the maximum amount allowed by law, currently $250,000 per depositor,
          per ownership category.
        </p>
      </Section>

      <Section heading="3. Anti-Money Laundering (AML) & Know Your Customer (KYC)">
        <p>
          We maintain a comprehensive AML and KYC program in compliance with the Bank Secrecy Act and
          applicable international standards. This includes identity verification at account opening,
          ongoing transaction monitoring, and reporting of suspicious activity to relevant authorities
          as required by law.
        </p>
      </Section>

      <Section heading="4. Data Security Standards">
        <p>
          Our infrastructure is designed to meet PCI DSS Level 1 standards for payment security and has
          undergone SOC 2 Type II auditing of our security, availability, and confidentiality controls.
          All data in transit is encrypted using TLS 1.3.
        </p>
      </Section>

      <Section heading="5. Consumer Protection">
        <p>
          We comply with applicable consumer financial protection laws, including disclosure requirements
          for fees, interest rates, and account terms. If you believe you have been treated unfairly,
          you may file a complaint with us directly or with the relevant regulatory authority in your
          jurisdiction.
        </p>
      </Section>

      <Section heading="6. Reporting Concerns">
        <p>
          To report a compliance concern or suspected fraudulent activity, contact our compliance team
          at grandtrustsuport@outlook.com.
        </p>
      </Section>
    </LegalPageLayout>
  );
}