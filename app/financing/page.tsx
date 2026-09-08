import type { Metadata } from 'next';
import { ArrowRight, Check, Download, FileText, Mail, Phone } from 'lucide-react';
import { SiteFooter, SiteHeader } from '../components/site-chrome';

export const metadata: Metadata = {
  title: 'Equipment Financing | Gordon Machinery Solutions',
  description: 'Explore construction equipment finance options and download the Gordon Machinery Solutions equipment finance application.',
  alternates: { canonical: '/financing' },
  openGraph: {
    title: 'Equipment Financing | Gordon Machinery Solutions',
    description: 'Equipment finance options designed around the machine, the business and the timing.',
    url: '/financing',
  },
  twitter: {
    title: 'Equipment Financing | Gordon Machinery Solutions',
    description: 'Equipment finance options designed around the machine, the business and the timing.',
  },
};

const financeBenefits = [
  'Full-documentation and low-documentation options for qualified customers',
  'Financing for many types of heavy construction machinery',
  'A process designed to keep approvals and settlement moving',
];

export default function FinancingPage() {
  return (
    <main id="top">
      <SiteHeader active="financing" />

      <section className="service-hero service-hero-financing">
        <div className="container finance-hero-grid">
          <div className="service-hero-copy">
            <p className="eyebrow">Equipment Financing</p>
            <h1>Finance the machine. Keep the work moving.</h1>
            <p>We help construction businesses explore competitive equipment-finance options built around the purchase, documentation and timing.</p>
            <div className="service-hero-actions">
              <a className="button" href="#application">Download Application <ArrowRight size={17} aria-hidden="true" /></a>
              <a className="service-text-link" href="tel:+17707695281">Talk to the equipment desk</a>
            </div>
          </div>
          <div className="finance-hero-panel">
            <p className="eyebrow">What to Expect</p>
            <ul>
              {financeBenefits.map((benefit) => <li key={benefit}><Check size={18} aria-hidden="true" /><span>{benefit}</span></li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="finance-story">
        <div className="container finance-story-grid">
          <div>
            <p className="eyebrow">Built for Construction</p>
            <h2>Financing should fit the deal—not force every buyer into the same box.</h2>
          </div>
          <div>
            <p>Gordon works with customers involved in the construction industry to identify finance packages for heavy machinery. Depending on the applicant and equipment, full-doc and low-doc approval paths may be available.</p>
            <p>For many transactions, only the information relevant to the approval and settlement is required. That keeps the process focused and helps qualified customers move from application to decision without unnecessary delay.</p>
            <p className="service-small-copy">All financing is subject to lender approval, credit review and documentation requirements. Rates and terms vary by applicant and transaction.</p>
          </div>
        </div>
      </section>

      <section className="application-section" id="application">
        <div className="container application-grid">
          <div className="application-copy">
            <span className="document-icon"><FileText size={29} aria-hidden="true" /></span>
            <p className="eyebrow">Finance Application</p>
            <h2>Start with the application.</h2>
            <p>Download the fillable form, complete the required fields, and sign and date the application.</p>
            <a className="button" href="/downloads/gordon-machinery-finance-application.pdf" download>
              <Download size={17} aria-hidden="true" /> Download Finance Application
            </a>
          </div>
          <ol className="application-steps">
            <li><span>01</span><div><h3>Download</h3><p>Open the one-page fillable PDF and save a copy to your device.</p></div></li>
            <li><span>02</span><div><h3>Complete and sign</h3><p>Provide the requested company, principal, bank, trade and financing information.</p></div></li>
            <li><span>03</span><div><h3>Send securely</h3><p>Fax the completed application to <strong>855-236-1926</strong>, or call us to coordinate another secure submission method.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="finance-contact-strip">
        <div className="container finance-contact-inner">
          <div><p className="eyebrow">Questions Before You Apply?</p><h2>Talk through the equipment and timing with our team.</h2></div>
          <div className="finance-contact-actions">
            <a href="tel:+17707695281"><Phone size={17} aria-hidden="true" /> 770-769-5281</a>
            <a href="mailto:Sales@GordonMachinerySolutions.com"><Mail size={17} aria-hidden="true" /> Sales@GordonMachinerySolutions.com</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
