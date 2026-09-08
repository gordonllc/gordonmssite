import type { Metadata } from 'next';
import { ArrowRight, Check, Download, FileText, Phone } from 'lucide-react';
import { RentalRatesForm } from '../components/rental-rates-form';
import { SiteFooter, SiteHeader } from '../components/site-chrome';

export const metadata: Metadata = {
  title: 'Equipment Rentals | Gordon Machinery Solutions',
  description: 'Request short-term, long-term or rental-purchase equipment options from Gordon Machinery Solutions in the Atlanta area.',
  alternates: { canonical: '/rentals' },
  openGraph: {
    title: 'Equipment Rentals | Gordon Machinery Solutions',
    description: 'Flexible heavy equipment rentals for contractors and job sites in the Atlanta area.',
    url: '/rentals',
  },
  twitter: {
    title: 'Equipment Rentals | Gordon Machinery Solutions',
    description: 'Flexible heavy equipment rentals for contractors and job sites in the Atlanta area.',
  },
};

const rentalTypes = ['Excavators', 'Wheel loaders', 'Dozers', 'Pavers', 'Compactors', 'Scrap handlers'];

export default function RentalsPage() {
  return (
    <main id="top">
      <SiteHeader active="rentals" />

      <section className="service-hero service-hero-rentals">
        <div className="container service-hero-grid">
          <div className="service-hero-copy">
            <p className="eyebrow">Equipment Rentals</p>
            <h1>Equipment ready for the work ahead.</h1>
            <p>Gordon offers short- and long-term equipment rentals, with rental-purchase options available for qualifying machines.</p>
            <div className="service-hero-actions">
              <a className="button" href="#rates">Request Rental Rates <ArrowRight size={17} aria-hidden="true" /></a>
              <a className="service-text-link" href="/equipment?availability=Rental%20Available">View Rental Inventory</a>
            </div>
            <div className="service-hero-facts" aria-label="Rental options">
              <span>Short term</span>
              <span>Long term</span>
              <span>Rental purchase</span>
            </div>
          </div>
          <figure className="service-hero-image">
            <img
              src="https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558546181171-881IF7O9MBGS55ZESNNG/jcb3cxbackhoe.png?format=2000w"
              alt="JCB backhoe loader available through Gordon Machinery Solutions"
            />
            <figcaption><span>Atlanta, Georgia</span> Rental equipment availability changes regularly</figcaption>
          </figure>
        </div>
      </section>

      <section className="service-overview">
        <div className="container service-overview-grid">
          <div>
            <p className="eyebrow">Rental Fleet</p>
            <h2>A practical range of machines for changing job requirements.</h2>
          </div>
          <div className="service-overview-copy">
            <p>Our rental equipment includes the core machines contractors depend on across sitework, paving, material handling and heavy construction.</p>
            <div className="rental-type-grid">
              {rentalTypes.map((type) => <span key={type}><Check size={16} aria-hidden="true" /> {type}</span>)}
            </div>
            <p className="service-small-copy">Inventory and rental eligibility vary by machine. Contact the rental desk for current availability and terms.</p>
          </div>
        </div>
      </section>

      <section className="rates-section" id="rates">
        <div className="container rates-grid">
          <div className="rates-copy">
            <p className="eyebrow">Rental Rates Request</p>
            <h2>Get the current rate list.</h2>
            <p>Tell us what you&apos;re looking for and we&apos;ll send our current rental rates and help confirm availability for your dates.</p>
            <a className="rates-phone" href="tel:+17707695281"><Phone size={18} aria-hidden="true" /><span><small>Prefer to call?</small>770-769-5281</span></a>
          </div>
          <RentalRatesForm />
        </div>
      </section>

      <section className="document-section">
        <div className="container document-card">
          <span className="document-icon"><FileText size={28} aria-hidden="true" /></span>
          <div>
            <p className="eyebrow">Rental Application</p>
            <h2>Ready to apply?</h2>
            <p>Download and complete the rental application, then fax it to <strong>855-236-1926</strong>.</p>
          </div>
          <a className="button document-download" href="/downloads/gordon-machinery-rental-application.pdf" download>
            <Download size={17} aria-hidden="true" /> Download Application
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
