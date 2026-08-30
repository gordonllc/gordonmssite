'use client';

import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarClock,
  Check,
  CircleDollarSign,
  Clock3,
  Factory,
  HardHat,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Shovel,
  Tractor,
  TreePine,
  Truck,
  Wrench,
  X,
} from 'lucide-react';

const trustItems = [
  { icon: Award, title: '10+ Years Experience', copy: 'Serving contractors across Georgia' },
  { icon: BadgeCheck, title: 'Company-Owned Equipment', copy: 'Know exactly who you are buying from' },
  { icon: CalendarClock, title: 'Short & Long-Term Rentals', copy: 'Flexible terms for the job ahead' },
  { icon: Search, title: 'Equipment Sourcing', copy: 'We help locate the right machine' },
];

const inventory = [
  {
    category: 'BACKHOE LOADER',
    title: '2013 Deere Backhoe Loader',
    details: 'Company-owned used equipment',
    price: '$75,000',
    image: 'https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558558381333-FVAAMBRD0BRH0JP8HEOE/deere2.png?format=1500w',
    alt: '2013 Deere backhoe loader owned by Gordon Machinery Solutions',
    href: 'https://www.gordonmachinerysolutions.com/inventory/2012-deer-bulldozer',
  },
  {
    category: 'STUMP GRINDER',
    title: '2022 Vermeer SC70TX',
    details: '200 hours',
    price: '$72,500',
    image: 'https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1699020594540-9RPIF3KW0DD7H754MNY6/img+7.jpeg?format=1500w',
    alt: '2022 Vermeer SC70TX stump grinder owned by Gordon Machinery Solutions',
    href: 'https://www.gordonmachinerysolutions.com/inventory/2012-deer-bulldozer-3pw2w-jzhhl-z76xp-wzw5p-fsygs-pxpap-72npm-mey9x',
  },
  {
    category: 'COMPACT EXCAVATOR',
    title: '2010 Bobcat E80 Excavator',
    details: '3,740 hours',
    price: '$42,000',
    image: 'https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558540425329-IA0T275AK5VYOV5108NK/bobcattt.png?format=1500w',
    alt: '2010 Bobcat E80 excavator owned by Gordon Machinery Solutions',
    href: 'https://www.gordonmachinerysolutions.com/inventory/2012-deer-bulldozer-3pw2w-jzhhl-a9gmz',
  },
];

const categories = [
  { label: 'Excavators', icon: Shovel },
  { label: 'Backhoes', icon: Tractor },
  { label: 'Loaders', icon: Truck },
  { label: 'Stump Grinders', icon: TreePine },
  { label: 'Forestry Equipment', icon: Factory },
  { label: 'Other Equipment', icon: Wrench },
];

const navItems = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Inventory', href: '#inventory' },
  { label: 'Rentals', href: '#rentals' },
  { label: 'Financing', href: '#financing' },
  { label: 'Contact', href: '#contact' },
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

  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const interest = values.get('interest') || 'Equipment inquiry';
    const subject = encodeURIComponent(`Website inquiry: ${interest}`);
    const lines = [
      `Name: ${values.get('name') || ''}`,
      `Company: ${values.get('company') || ''}`,
      `Phone: ${values.get('phone') || ''}`,
      `Email: ${values.get('email') || ''}`,
      `Interested in: ${interest}`,
      '',
      `${values.get('message') || ''}`,
    ];
    window.location.href = `mailto:Sales@GordonMachinerySolutions.com?subject=${subject}&body=${encodeURIComponent(lines.join('\n'))}`;
  }

  return (
    <main>
      <div className="utility-bar">
        <div className="container utility-content">
          <span>Heavy Equipment Sales &amp; Rentals <i /> Atlanta, Georgia</span>
          <span>Serving contractors for more than 10 years</span>
        </div>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <a href="#top" aria-label="Gordon Machinery Solutions home"><Logo /></a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item, index) => (
              <a className={index === 0 ? 'active' : ''} href={item.href} key={item.label}>{item.label}</a>
            ))}
          </nav>

          <div className="header-actions">
            <a className="phone-link" href="tel:+17707695281">
              <Phone size={17} strokeWidth={2} aria-hidden="true" />
              <span>770-769-5281</span>
            </a>
            <a className="button button-small" href="#contact">Request a Quote</a>
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

      <section className="hero" id="top">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Heavy Equipment Sales &amp; Rentals</p>
            <h1>Heavy Equipment You Can Count On.</h1>
            <p className="hero-lede">
              Quality used construction equipment, rentals and equipment sourcing for
              contractors throughout Atlanta and beyond.
            </p>
            <div className="hero-buttons">
              <a className="button" href="#inventory">View Inventory</a>
              <a className="button button-outline" href="#contact">Contact Us</a>
            </div>
            <p className="support-line">
              <span>10+ years in business</span>
              <span>Equipment owned by Gordon</span>
              <span>Sales &amp; rentals</span>
            </p>
          </div>

          <figure className="hero-media">
            <img
              src="https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558550679017-LPQLUQSFABJQDADHGKL8/cat.jpeg?format=1500w"
              alt="CAT 320CL excavator in Gordon Machinery Solutions' equipment yard"
              fetchPriority="high"
            />
            <figcaption>
              <span>Ready for the job</span>
              <strong>Company-owned · Ready to work</strong>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="trust-strip" aria-label="Why choose Gordon">
        <div className="container trust-grid">
          {trustItems.map(({ icon: Icon, title, copy }) => (
            <div className="trust-item" key={title}>
              <Icon size={25} strokeWidth={1.8} aria-hidden="true" />
              <div><strong>{title}</strong><span>{copy}</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="section inventory-section" id="inventory">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">AVAILABLE NOW</p>
              <h2>Featured Equipment</h2>
              <p>Browse a selection of used construction and landscaping equipment.</p>
            </div>
            <a className="text-link" href="https://www.gordonmachinerysolutions.com/inventory" target="_blank" rel="noreferrer">
              View All Inventory <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>

          <div className="inventory-grid">
            {inventory.map((item) => (
              <a className="equipment-card" href={item.href} target="_blank" rel="noreferrer" key={item.title}>
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

          <div className="category-block">
            <div className="category-heading">
              <h2>Shop by Equipment Type</h2>
              <p>Find the right machine for your next project.</p>
            </div>
            <div className="category-grid">
              {categories.map(({ label, icon: Icon }) => (
                <a href="https://www.gordonmachinerysolutions.com/inventory" target="_blank" rel="noreferrer" className="category-tile" key={label}>
                  <Icon size={27} strokeWidth={1.6} aria-hidden="true" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="container about-grid">
          <figure className="about-photo">
            <img
              src="https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558555025423-4S4QOJNHAC4Q5974GOF3/cat.png?format=1500w"
              alt="CAT 320C excavator in Gordon Machinery Solutions' equipment yard"
              loading="lazy"
            />
            <figcaption>Equipment selected for real-world work.</figcaption>
          </figure>
          <div className="about-copy">
            <p className="eyebrow">About Gordon</p>
            <h2>Serving Equipment Buyers for More Than 10 Years</h2>
            <p>
              Gordon Machinery Solutions is a value-driven used equipment dealer serving
              contractors and construction businesses throughout the Atlanta area.
            </p>
            <p>
              We help customers buy, rent and locate dependable machinery with clear
              communication and hands-on support from people who know equipment.
            </p>
            <blockquote>
              <strong>We sell what we own.</strong>
              <span>Our inventory is company-owned—not brokered—so buyers know exactly who stands behind the sale.</span>
            </blockquote>
            <a className="text-link" href="https://www.gordonmachinerysolutions.com/about-us" target="_blank" rel="noreferrer">
              Learn More About Gordon <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="rentals-section" id="rentals">
        <div className="container rentals-grid">
          <figure className="rentals-photo">
            <img
              src="https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558546181171-881IF7O9MBGS55ZESNNG/jcb3cxbackhoe.png?format=1500w"
              alt="2017 JCB 3CX backhoe loader available from Gordon Machinery Solutions"
              loading="lazy"
            />
          </figure>
          <div className="rentals-copy">
            <p className="eyebrow">Equipment Rentals</p>
            <h2>Flexible Rentals for the Job Ahead</h2>
            <p>Short-term, long-term and rental-purchase options are available for qualifying equipment.</p>
            <ul>
              <li><Check size={18} aria-hidden="true" /> Short-term rental</li>
              <li><Check size={18} aria-hidden="true" /> Long-term rental</li>
              <li><Check size={18} aria-hidden="true" /> Rental purchase options</li>
            </ul>
            <a className="button" href="https://www.gordonmachinerysolutions.com/equipment-rentals" target="_blank" rel="noreferrer">
              View Rentals <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="section sourcing-section">
        <div className="container sourcing-inner">
          <Search size={32} strokeWidth={1.7} aria-hidden="true" />
          <p className="eyebrow">Looking for something specific?</p>
          <h2>Tell Us What Equipment You Need.</h2>
          <p>If the machine you&apos;re looking for isn&apos;t currently in our inventory, our team can help source it.</p>
          <a className="button" href="#contact">Request Equipment</a>
        </div>
      </section>

      <section className="financing-section" id="financing">
        <div className="container financing-card">
          <div className="financing-copy">
            <span className="finance-icon"><CircleDollarSign size={28} strokeWidth={1.7} aria-hidden="true" /></span>
            <div>
              <h2>Need Financing?</h2>
              <p>Ask about financing options available for qualifying equipment purchases, including transportation costs.</p>
            </div>
          </div>
          <a className="text-link" href="https://www.gordonmachinerysolutions.com/financing" target="_blank" rel="noreferrer">
            Financing Information <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="container contact-panel">
          <div className="contact-copy">
            <p className="eyebrow">Let&apos;s Talk</p>
            <h2>Talk With Gordon Machinery Solutions</h2>
            <p>Have a machine to find, a rental need or a question about current inventory? Our team is ready to help.</p>
            <div className="contact-details">
              <a href="tel:+17707695281"><span><Phone size={19} aria-hidden="true" /></span><div><small>PHONE</small><strong>770-769-5281</strong></div></a>
              <a href="mailto:Sales@GordonMachinerySolutions.com"><span><Mail size={19} aria-hidden="true" /></span><div><small>EMAIL</small><strong>Sales@GordonMachinerySolutions.com</strong></div></a>
              <div><span><MapPin size={19} aria-hidden="true" /></span><div><small>OFFICE</small><strong>2400 Herodian Way SE, Ste 220<br />Smyrna, GA 30080</strong></div></div>
              <div><span><Clock3 size={19} aria-hidden="true" /></span><div><small>AVAILABILITY</small><strong>Call to speak with our team</strong></div></div>
            </div>
          </div>

          <form className="contact-form" onSubmit={submitInquiry}>
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
            <button className="button submit-button" type="submit">Send Message <ArrowRight size={17} aria-hidden="true" /></button>
            <p className="form-note">Submitting opens a pre-addressed email to the Gordon team.</p>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="#top"><Logo /></a>
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
            <a href="#inventory">Inventory</a>
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
