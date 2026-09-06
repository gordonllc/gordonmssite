import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CircleDollarSign,
  Gauge,
  MapPin,
  Phone,
} from 'lucide-react';
import { SiteFooter, SiteHeader } from '../../components/site-chrome';
import { getEquipmentRecord, listEquipment } from '../../../db/equipment';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getEquipmentRecord(slug);
  if (!item) return { title: 'Equipment Not Found | Gordon Machinery Solutions' };

  const description = `${item.title} listed at ${item.priceLabel}${item.hours ? ` with ${item.hours.toLocaleString()} hours` : ''}. View details and contact Gordon Machinery Solutions.`;
  return {
    title: `${item.title} | Gordon Machinery Solutions`,
    description,
    alternates: { canonical: `/equipment/${item.slug}` },
    openGraph: {
      type: 'website',
      url: `/equipment/${item.slug}`,
      title: `${item.title} | Gordon Machinery Solutions`,
      description,
      images: [{ url: item.image, alt: item.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${item.title} | Gordon Machinery Solutions`,
      description,
      images: [item.image],
    },
  };
}

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getEquipmentRecord(slug);
  if (!item) notFound();

  const related = (await listEquipment())
    .filter((candidate) => candidate.slug !== item.slug)
    .sort((a, b) => Number(b.category === item.category) - Number(a.category === item.category))
    .slice(0, 3);

  return (
    <main id="top">
      <SiteHeader active="inventory" />

      <section className="detail-breadcrumb-bar">
        <div className="container detail-breadcrumbs">
          <a href="/">Home</a><span>/</span><a href="/equipment">Equipment</a><span>/</span><strong>{item.title}</strong>
        </div>
      </section>

      <section className="equipment-detail">
        <div className="container">
          <a className="back-link" href="/equipment"><ArrowLeft size={16} aria-hidden="true" /> Back to Equipment</a>
          <div className="detail-grid">
            <div className="detail-gallery">
              <figure className="detail-main-image">
                <img src={item.image} alt={item.alt} fetchPriority="high" />
              </figure>
              {item.alternateImage && (
                <figure className="detail-secondary-image">
                  <img src={item.alternateImage} alt={`Additional view of ${item.title}`} loading="lazy" />
                </figure>
              )}
            </div>

            <aside className="detail-summary">
              <div className="detail-badges">
                <span className={`status-badge static status-${item.status.toLowerCase()}`}><BadgeCheck size={14} aria-hidden="true" /> {item.status}</span>
                {item.availability === 'Rental Available' && <span className="rental-badge static">Rental Available</span>}
              </div>
              <span className="category-label">{item.category}</span>
              <h1>{item.title}</h1>
              <span className="price-kicker">Listed price</span>
              <strong className="detail-price">{item.priceLabel}</strong>
              <p className="detail-intro">{item.description}</p>

              <div className="detail-quick-specs">
                <div><CalendarDays size={18} aria-hidden="true" /><span>Year<strong>{item.year}</strong></span></div>
                <div><Gauge size={18} aria-hidden="true" /><span>Hours<strong>{item.hours ? item.hours.toLocaleString() : 'On request'}</strong></span></div>
                <div><BadgeCheck size={18} aria-hidden="true" /><span>Seller<strong>Gordon Machinery</strong></span></div>
                <div><MapPin size={18} aria-hidden="true" /><span>Location<strong>Smyrna, Georgia</strong></span></div>
              </div>

              <div className="detail-actions">
                <a className="button" href={`/?equipment=${encodeURIComponent(item.slug)}&machine=${encodeURIComponent(item.title)}#contact`}>{item.status === 'Sold' || item.status === 'Rented' ? 'Ask About Similar Equipment' : 'Request Information'} <ArrowRight size={17} aria-hidden="true" /></a>
                <a className="button button-outline" href="tel:+17707695281"><Phone size={17} aria-hidden="true" /> Call 770-769-5281</a>
              </div>
              <p className="detail-note">Availability, hours and pricing may change. Contact Gordon to confirm current details.</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="detail-information">
        <div className="container detail-info-grid">
          <div>
            <p className="eyebrow">Machine Details</p>
            <h2>Machine Overview</h2>
            <p>{item.description}</p>
            <p>Gordon can provide additional photos, arrange an inspection and help coordinate transportation based on your location and timeline.</p>
          </div>
          <div className="detail-spec-table">
            <div><span>Manufacturer</span><strong>{item.make}</strong></div>
            <div><span>Model</span><strong>{item.model}</strong></div>
            <div><span>Year</span><strong>{item.year}</strong></div>
            <div><span>Category</span><strong>{item.category}</strong></div>
            <div><span>Meter</span><strong>{item.hours ? `${item.hours.toLocaleString()} hours` : 'Contact for hours'}</strong></div>
            <div><span>Availability</span><strong>{item.availability}</strong></div>
          </div>
        </div>
        <div className="container detail-benefits">
          <div><Check size={18} aria-hidden="true" /><span>Additional photos available</span></div>
          <div><Check size={18} aria-hidden="true" /><span>Inspection coordination</span></div>
          <div><Check size={18} aria-hidden="true" /><span>Transportation coordination</span></div>
          <div><CircleDollarSign size={18} aria-hidden="true" /><span>Ask about financing options</span></div>
        </div>
      </section>

      <section className="equipment-process">
        <div className="container">
          <div className="process-heading">
            <div><p className="eyebrow">What Happens Next</p><h2>From Inquiry to Delivery</h2></div>
            <p>From the first question through inspection and transport, our team helps coordinate the details.</p>
          </div>
          <div className="process-grid">
            <div><span>01</span><h3>Talk With Gordon</h3><p>Tell us about the machine, the job and your timeline.</p></div>
            <div><span>02</span><h3>Review the Equipment</h3><p>Request current details, additional photos or inspection support.</p></div>
            <div><span>03</span><h3>Plan the Next Step</h3><p>Coordinate the purchase or rental, financing and transportation.</p></div>
          </div>
        </div>
      </section>

      <section className="related-equipment">
        <div className="container">
          <div className="section-heading-row">
            <div><p className="eyebrow">More Inventory</p><h2>Related Equipment</h2></div>
            <a className="text-link" href="/equipment">View All Equipment <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
          <div className="related-grid">
            {related.map((candidate) => (
              <a className="related-card" href={`/equipment/${candidate.slug}`} key={candidate.slug}>
                <img src={candidate.image} alt={candidate.alt} loading="lazy" />
                <div>
                  <span className="category-label">{candidate.category}</span>
                  <h3>{candidate.title}</h3>
                  <strong>{candidate.priceLabel}</strong>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
