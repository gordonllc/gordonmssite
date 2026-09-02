'use client';

import { HardHat, Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Home', href: '/', key: 'home' },
  { label: 'About', href: '/#about', key: 'about' },
  { label: 'Inventory', href: '/equipment', key: 'inventory' },
  { label: 'Rentals', href: '/#rentals', key: 'rentals' },
  { label: 'Financing', href: '/#financing', key: 'financing' },
  { label: 'Contact', href: '/#contact', key: 'contact' },
];

export function GordonLogo() {
  return (
    <span className="brand">
      <img
        src="https://images.squarespace-cdn.com/content/v1/5983a2bbe45a7c8bbb2e5853/1558671041670-I3D14VD7JQA0ND87ZY10/imageedit_3_2022889204.png?format=original"
        alt="Gordon Machinery Solutions"
      />
    </span>
  );
}

export function SiteHeader({ active = '' }: { active?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="utility-bar">
        <div className="container utility-content">
          <span>Heavy Equipment Sales &amp; Rentals <i /> Atlanta, Georgia</span>
          <span>Mon–Fri 8:00 AM–5:00 PM</span>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <a href="/" aria-label="Gordon Machinery Solutions home"><GordonLogo /></a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a className={active === item.key ? 'active' : ''} href={item.href} key={item.label}>{item.label}</a>
            ))}
          </nav>
          <div className="header-actions">
            <a className="phone-link" href="tel:+17707695281">
              <Phone size={17} strokeWidth={2} aria-hidden="true" />
              <span>770-769-5281</span>
            </a>
            <a className="button button-small" href="/#contact">Request a Quote</a>
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
    </>
  );
}

export function SiteFooter() {
  return (
    <>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="/"><GordonLogo /></a>
            <p>Heavy equipment sales, rentals and sourcing in the Atlanta area.</p>
            <a className="footer-phone" href="tel:+17707695281"><Phone size={16} /> 770-769-5281</a>
          </div>
          <div>
            <h3>Company</h3>
            <a href="/#about">About</a>
            <a href="/#contact">Contact</a>
            <a href="/#financing">Financing</a>
          </div>
          <div>
            <h3>Equipment</h3>
            <a href="/equipment">Inventory</a>
            <a href="/#rentals">Rentals</a>
            <a href="/#contact">Equipment Sourcing</a>
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
        <a href="/#contact"><HardHat size={18} aria-hidden="true" /> Request Quote</a>
      </div>
    </>
  );
}
