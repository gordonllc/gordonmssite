'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  Clock3,
  HardHat,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  X,
} from 'lucide-react';
import type { EquipmentItem } from './data/equipment';

const trustItems = [
  { title: 'Used Equipment', copy: 'Excavators, backhoes, grinders and more' },
  { title: 'Flexible Rentals', copy: 'Short- and long-term options' },
  { title: 'Equipment Sourcing', copy: 'Help locating the right machine' },
];

const fallbackInventory = [
  {
    category: 'BACKHOE LOADER',
    title: '2013 Deere Backhoe Loader',
    details: 'Available now',
    price: '$75,000',
    image: 'https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558558381333-FVAAMBRD0BRH0JP8HEOE/deere2.png?format=1500w',
    alt: '2013 Deere backhoe loader owned by Gordon Machinery Solutions',
    href: '/equipment/2013-deere-backhoe-loader',
  },
  {
    category: 'STUMP GRINDER',
    title: '2022 Vermeer SC70TX',
    details: '200 hours',
    price: '$72,500',
    image: 'https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1699020594540-9RPIF3KW0DD7H754MNY6/img+7.jpeg?format=1500w',
    alt: '2022 Vermeer SC70TX stump grinder owned by Gordon Machinery Solutions',
    href: '/equipment/2022-vermeer-sc70tx',
  },
  {
    category: 'COMPACT EXCAVATOR',
    title: '2010 Bobcat E80 Excavator',
    details: '3,740 hours',
    price: '$42,000',
    image: 'https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558540425329-IA0T275AK5VYOV5108NK/bobcattt.png?format=1500w',
    alt: '2010 Bobcat E80 excavator owned by Gordon Machinery Solutions',
    href: '/equipment/2010-bobcat-e80-excavator',
  },
];

const categories = [
  { label: 'Excavators', filter: 'Excavators' },
  { label: 'Backhoes', filter: 'Backhoe Loaders' },
  { label: 'Loaders', filter: '' },
  { label: 'Stump Grinders', filter: 'Stump Grinders' },
  { label: 'Forestry Equipment', filter: '' },
  { label: 'Other Equipment', filter: '' },
];

const navItems = [
  { label: 'Inventory', href: '/equipment' },
  { label: 'Rentals', href: '/#rentals' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

function Logo() {
  return (
    <span className="brand">
      <img
        src="https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558671041670-I3D14VD7JQA0ND87ZY10/imageedit_3_2022889204.png?format=original"
        alt="Gordon Machinery Solutions"
      />
    </span>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [homeInventory, setHomeInventory] = useState(fallbackInventory);
  const [inquiryState, setInquiryState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [inquiryError, setInquiryError] = useState('');
  const [acknowledgementSent, setAcknowledgementSent] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/equipment?featured=1&limit=3')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => {
        const { items } = data as { items: EquipmentItem[] };
        if (!active || !Array.isArray(items) || !items.length) return;
        setHomeInventory(items.map((item) => ({
          category: String(item.category).toUpperCase(),
          title: item.title,
          details: item.hours ? `${Number(item.hours).toLocaleString()} hours` : item.availability,
          price: item.priceLabel,
          image: item.image,
          alt: item.alt,
          href: `/equipment/${item.slug}`,
        })));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const pageParams = new URLSearchParams(window.location.search);
    setInquiryState('sending');
    setInquiryError('');
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.get('name'),
          company: values.get('company'),
          phone: values.get('phone'),
          email: values.get('email'),
          interest: values.get('interest'),
          equipmentSlug: pageParams.get('equipment'),
          equipmentTitle: pageParams.get('machine'),
          message: values.get('message'),
          website: values.get('website'),
          sourcePage: `${window.location.pathname}${window.location.search}`,
        }),
      });
      const data = await response.json() as { received?: boolean; acknowledgementSent?: boolean; error?: string };
      if (!response.ok || !data.received) throw new Error(data.error || 'We could not send your request.');
      form.reset();
      setAcknowledgementSent(Boolean(data.acknowledgementSent));
      setInquiryState('sent');
    } catch (error) {
      setInquiryState('error');
      setInquiryError(error instanceof Error ? error.message : 'We could not send your request. Please call 770-769-5281.');
    }
  }

  return (
    <main>
      <header className="site-header home-site-header">
        <div className="container header-inner">
          <a href="/" aria-label="Gordon Machinery Solutions home"><Logo /></a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a href={item.href} key={item.label}>{item.label}</a>
            ))}
          </nav>

          <div className="header-actions">
            <a className="phone-link" href="tel:+17707695281">
              <Phone size={17} strokeWidth={2} aria-hidden="true" />
              <span>770-769-5281</span>
            </a>
            <a className="button button-small" href="#contact">Request Equipment</a>
          </div>

          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={25} aria-hidden="true" /> : <Menu size={25} aria-hidden="true" />}
          </button>
        </div>

        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a href={item.href} key={item.label} onClick={() => setMenuOpen(false)}>{item.label}</a>
            ))}
            <a className="mobile-phone" href="tel:+17707695281"><Phone size={17} /> 770-769-5281</a>
          </nav>
        )}
      </header>

      <section className="hero hero-cinematic" id="top">
        <figure className="hero-cinematic-media">
          <img
            src="https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558550679017-LPQLUQSFABJQDADHGKL8/cat.jpeg?format=2500w"
            alt="CAT excavator in Gordon Machinery Solutions' Atlanta equipment yard"
            fetchPriority="high"
          />
        </figure>
        <div className="hero-cinematic-shade" aria-hidden="true" />
        <div className="container hero-cinematic-inner">
          <div className="hero-copy hero-enter-copy">
            <p className="eyebrow">Atlanta, Georgia / Sales · Rentals · Sourcing</p>
            <h1>Heavy equipment for the work ahead.</h1>
            <p className="hero-lede">
              Used construction equipment, flexible rentals and hands-on sourcing for
              contractors who need a straight answer and the right machine.
            </p>
            <div className="hero-buttons">
              <a className="button" href="/equipment">View Inventory</a>
              <a className="button button-outline" href="#contact">Contact Us</a>
            </div>
            <p className="support-line">
              <span>Current inventory</span>
              <span>Flexible terms</span>
              <span>Nationwide sourcing</span>
            </p>
          </div>
          <div className="hero-frame-meta" aria-hidden="true"><span>GMS / 2026</span><span>Scroll to explore</span></div>
        </div>
      </section>

      <section className="trust-strip capability-rail" aria-label="Gordon services at a glance">
        <div className="container trust-grid" data-reveal>
          <div className="trust-intro"><span>What we do</span><strong>Built around the job.</strong></div>
          {trustItems.map(({ title, copy }, index) => (
            <div className="trust-item" key={title}>
              <span className="trust-number">0{index + 1}</span>
              <div><strong>{title}</strong><span>{copy}</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="section inventory-section" id="inventory">
        <div className="container">
          <div className="section-heading-row" data-reveal>
            <div>
              <p className="eyebrow">Current Inventory</p>
              <h2>Featured Equipment</h2>
              <p>Browse a selection of used construction and landscaping equipment.</p>
            </div>
            <a className="text-link" href="/equipment">
              View All Inventory <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>

          <div className="inventory-grid" data-reveal>
            {homeInventory.map((item, index) => (
              <a className={`equipment-card ${index === 0 ? 'equipment-card-featured' : ''}`} href={item.href} key={item.title}>
                <div className="card-image"><img src={item.image} alt={item.alt} loading="lazy" /></div>
                <div className="card-body">
                  <span className="category-label">{item.category}</span>
                  <h3>{item.title}</h3>
                  <span className="equipment-details">{item.details}</span>
                  <strong className="price">{item.price}</strong>
                  <span className="card-link">View Details <ArrowRight size={16} aria-hidden="true" /></span>
                </div>
              </a>
            ))}
          </div>
          <p className="inventory-note">Inventory, hours and pricing are shown from current public listings and may change. Contact Gordon to confirm availability.</p>

          <div className="category-block" data-reveal>
            <div className="category-heading">
              <h2>Shop by Equipment Type</h2>
              <p>Find the right machine for your next project.</p>
            </div>
            <div className="category-grid">
              {categories.map(({ label, filter }, index) => (
                <a href={filter ? `/equipment?category=${encodeURIComponent(filter)}` : '/equipment'} className="category-tile" key={label}>
                  <span className="category-index">0{index + 1}</span>
                  <span>{label}</span>
                  <ArrowRight className="category-arrow" size={17} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="container about-grid">
          <figure className="about-photo" data-reveal>
            <img
              src="https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558555025423-4S4QOJNHAC4Q5974GOF3/cat.png?format=1500w"
              alt="CAT 320C excavator in Gordon Machinery Solutions' equipment yard"
              loading="lazy"
            />
          </figure>
          <div className="about-copy" data-reveal>
            <p className="eyebrow">About Gordon</p>
            <h2>Equipment Sales, Rentals and Sourcing in Atlanta</h2>
            <p>
              Gordon Machinery Solutions is a value-driven used equipment dealer serving
              contractors and construction businesses throughout the Atlanta area.
            </p>
            <p>
              We help customers buy, rent and locate dependable machinery with clear
              communication and hands-on support from people who know equipment.
            </p>
            <div className="about-services" aria-label="Gordon Machinery Solutions services">
              <div><strong>Sales</strong><span>Used construction and landscaping equipment</span></div>
              <div><strong>Rentals</strong><span>Short-term, long-term and rental-purchase options</span></div>
              <div><strong>Sourcing</strong><span>Help locating equipment beyond current inventory</span></div>
            </div>
            <a className="text-link" href="#contact">
              Talk With Gordon <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="rentals-section" id="rentals">
        <div className="container rentals-grid">
          <figure className="rentals-photo" data-reveal>
            <img
              src="https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558546181171-881IF7O9MBGS55ZESNNG/jcb3cxbackhoe.png?format=1500w"
              alt="2017 JCB 3CX backhoe loader available from Gordon Machinery Solutions"
              loading="lazy"
            />
          </figure>
          <div className="rentals-copy" data-reveal>
            <p className="eyebrow">Equipment Rentals</p>
            <h2>Short- and Long-Term Equipment Rentals</h2>
            <p>Short-term, long-term and rental-purchase options are available for qualifying equipment.</p>
            <ul>
              <li><Check size={18} aria-hidden="true" /> Short-term rental</li>
              <li><Check size={18} aria-hidden="true" /> Long-term rental</li>
              <li><Check size={18} aria-hidden="true" /> Rental purchase options</li>
            </ul>
            <a className="button" href="/equipment?availability=Rental%20Available">
              View Rentals <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="section sourcing-section">
        <div className="container sourcing-inner" data-reveal>
          <span className="sourcing-icon"><Search size={27} strokeWidth={1.7} aria-hidden="true" /></span>
          <div className="sourcing-copy">
            <p className="eyebrow">Equipment Sourcing</p>
            <h2>Looking for a Specific Machine?</h2>
            <p>If it isn&apos;t in our current inventory, tell us what you need and we&apos;ll help locate it.</p>
          </div>
          <a className="button" href="#contact">Request Equipment <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="financing-section" id="financing">
        <div className="container financing-card" data-reveal>
          <div className="financing-copy">
            <span className="finance-icon"><CircleDollarSign size={28} strokeWidth={1.7} aria-hidden="true" /></span>
            <div>
              <span className="financing-label">Financing Options</span>
              <h2>Need Financing?</h2>
              <p>Ask about financing options available for qualifying equipment purchases, including transportation costs.</p>
            </div>
          </div>
          <a className="text-link" href="#contact">
            Ask About Financing <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="container contact-panel" data-reveal>
          <div className="contact-copy">
            <p className="eyebrow">Let&apos;s Talk</p>
            <h2>Tell Us What You Need</h2>
            <p>Have a machine to find, a rental need or a question about current inventory? Our team is ready to help.</p>
            <div className="contact-details">
              <a href="tel:+17707695281"><span><Phone size={19} aria-hidden="true" /></span><div><small>PHONE</small><strong>770-769-5281</strong></div></a>
              <a href="mailto:Sales@GordonMachinerySolutions.com"><span><Mail size={19} aria-hidden="true" /></span><div><small>EMAIL</small><strong>Sales@GordonMachinerySolutions.com</strong></div></a>
              <div><span><MapPin size={19} aria-hidden="true" /></span><div><small>OFFICE</small><strong>2400 Herodian Way SE, Ste 220<br />Smyrna, GA 30080</strong></div></div>
              <div><span><Clock3 size={19} aria-hidden="true" /></span><div><small>AVAILABILITY</small><strong>Call to speak with our team</strong></div></div>
            </div>
          </div>

          {inquiryState === 'sent' ? (
            <div className="contact-form form-success" role="status">
              <span><Check size={28} aria-hidden="true" /></span>
              <p className="eyebrow">Request Received</p>
              <h2>Thanks—we&apos;ll be in touch.</h2>
              <p>Your inquiry has been sent to the Gordon equipment desk. {acknowledgementSent && 'A confirmation email is on its way. '}For immediate assistance, call <a href="tel:+17707695281">770-769-5281</a>.</p>
              <button className="admin-secondary-button" type="button" onClick={() => setInquiryState('idle')}>Send Another Request</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submitInquiry}>
              <label className="form-honeypot" aria-hidden="true">Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
              <div className="field-grid">
                <label>Name<input name="name" type="text" autoComplete="name" required /></label>
                <label>Company<input name="company" type="text" autoComplete="organization" /></label>
                <label>Phone<input name="phone" type="tel" autoComplete="tel" required /></label>
                <label>Email<input name="email" type="email" autoComplete="email" required /></label>
              </div>
              <label>
                I&apos;m interested in
                <span className="select-wrap">
                  <select name="interest" defaultValue="Buying equipment">
                    <option>Buying equipment</option>
                    <option>Equipment rental</option>
                    <option>Equipment sourcing</option>
                    <option>Financing</option>
                    <option>Other</option>
                  </select>
                </span>
              </label>
              <label>Message<textarea name="message" rows={4} required /></label>
              {inquiryState === 'error' && <p className="form-error" role="alert">{inquiryError}</p>}
              <button className="button submit-button" type="submit" disabled={inquiryState === 'sending'}>{inquiryState === 'sending' ? 'Sending…' : 'Send Request'} {inquiryState !== 'sending' && <ArrowRight size={17} aria-hidden="true" />}</button>
              <p className="form-note">By submitting, you agree that Gordon Machinery Solutions may contact you about this request.</p>
            </form>
          )}
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="/"><Logo /></a>
            <p>Heavy equipment sales, rentals and sourcing in the Atlanta area.</p>
            <a className="footer-phone" href="tel:+17707695281"><Phone size={16} /> 770-769-5281</a>
          </div>
          <div>
            <h3>Company</h3>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#financing">Financing</a>
          </div>
          <div>
            <h3>Equipment</h3>
            <a href="/equipment">Inventory</a>
            <a href="#rentals">Rentals</a>
            <a href="#contact">Equipment Sourcing</a>
          </div>
          <div>
            <h3>Contact</h3>
            <a href="mailto:Sales@GordonMachinerySolutions.com">Sales@GordonMachinerySolutions.com</a>
            <span>2400 Herodian Way SE, Ste 220</span>
            <span>Smyrna, GA 30080</span>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 Gordon Machinery Solutions. All rights reserved.</span>
          <div className="footer-legal"><a href="#top">Back to top ↑</a></div>
        </div>
      </footer>

      <div className="mobile-cta-bar">
        <a href="tel:+17707695281"><Phone size={18} aria-hidden="true" /> Call</a>
        <a href="#contact"><HardHat size={18} aria-hidden="true" /> Request Quote</a>
      </div>
    </main>
  );
}
