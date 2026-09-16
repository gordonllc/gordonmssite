'use client';

import { HardHat, Menu, Phone, X } from 'lucide-react';
import { useId, useState, type CSSProperties } from 'react';

const navItems = [
  { label: 'Inventory', href: '/equipment', key: 'inventory' },
  { label: 'Rentals', href: '/rentals', key: 'rentals' },
  { label: 'Financing', href: '/financing', key: 'financing' },
  { label: 'About', href: '/#about', key: 'about' },
  { label: 'Contact', href: '/#contact', key: 'contact' },
];

export function GordonLogo() {
  const filterId = `gordon-dark-${useId().replace(/:/g, '')}`;
  return (
    <span className="brand" style={{ '--logo-dark-filter': `url(#${filterId})` } as CSSProperties}>
      <svg className="logo-treatment" aria-hidden="true" focusable="false" width="0" height="0">
        <defs>
          <filter id={filterId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -.2126 -.7152 -.0722 0 1" result="inverseLuminance" />
            <feComponentTransfer in="inverseLuminance" result="darkPixels"><feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0 1 1" /></feComponentTransfer>
            <feComposite in="darkPixels" in2="SourceAlpha" operator="in" result="darkMask" />
            <feFlood floodColor="#f2f3f0" result="lightInk" />
            <feComposite in="lightInk" in2="darkMask" operator="in" result="lightDetails" />
            <feComposite in="lightDetails" in2="SourceGraphic" operator="over" />
          </filter>
        </defs>
      </svg>
      <img
        src="/gordon-machinery-logo.png"
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
            <a className="button button-small" href="/#contact">Request Equipment</a>
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
            <a href="/financing">Financing</a>
          </div>
          <div>
            <h3>Equipment</h3>
            <a href="/equipment">Inventory</a>
            <a href="/rentals">Rentals</a>
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
