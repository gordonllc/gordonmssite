'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Gauge,
  Phone,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { equipment, equipmentCategories } from '../data/equipment';

type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high';

export default function CatalogClient({ initialCategory }: { initialCategory: string }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [availability, setAvailability] = useState('All Availability');
  const [sort, setSort] = useState<SortOption>('featured');

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = equipment.filter((item) => {
      const matchesQuery = !normalized || [item.title, item.make, item.model, item.category]
        .join(' ')
        .toLowerCase()
        .includes(normalized);
      const matchesCategory = category === 'All Equipment' || item.category === category;
      const matchesAvailability = availability === 'All Availability' || item.availability === availability;
      return matchesQuery && matchesCategory && matchesAvailability;
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'newest') return b.year - a.year;
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [query, category, availability, sort]);

  function resetFilters() {
    setQuery('');
    setCategory('All Equipment');
    setAvailability('All Availability');
    setSort('featured');
  }

  return (
    <>
      <section className="equipment-hero">
        <div className="container equipment-hero-inner">
          <div>
            <p className="breadcrumbs"><a href="/">Home</a><span>/</span>Equipment</p>
            <p className="eyebrow">Company-Owned Inventory</p>
            <h1>Find the Right Machine for the Work Ahead.</h1>
            <p>Browse equipment for sale and rent from Gordon. Clear pricing, real machine photography and direct access to a team that knows the inventory.</p>
          </div>
          <div className="equipment-hero-facts" aria-label="Inventory benefits">
            <div><strong>6</strong><span>Machines listed</span></div>
            <div><strong>100%</strong><span>Company-owned</span></div>
            <div><strong>Atlanta</strong><span>Area support</span></div>
          </div>
        </div>
      </section>

      <section className="catalog-section">
        <div className="container">
          <div className="catalog-toolbar">
            <label className="catalog-search">
              <span className="sr-only">Search equipment</span>
              <Search size={19} aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="Search by make, model or type"
              />
            </label>
            <div className="catalog-selects">
              <label>
                <span className="sr-only">Equipment category</span>
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  {equipmentCategories.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label>
                <span className="sr-only">Availability</span>
                <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
                  <option>All Availability</option>
                  <option>For Sale</option>
                  <option>Rental Available</option>
                </select>
              </label>
              <label>
                <span className="sr-only">Sort equipment</span>
                <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
                  <option value="featured">Featured First</option>
                  <option value="newest">Newest Year</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </label>
            </div>
          </div>

          <div className="catalog-summary">
            <div><SlidersHorizontal size={17} aria-hidden="true" /><strong>{results.length}</strong> {results.length === 1 ? 'machine' : 'machines'}</div>
            {(query || category !== 'All Equipment' || availability !== 'All Availability') && (
              <button type="button" onClick={resetFilters}>Clear filters</button>
            )}
          </div>

          {results.length > 0 ? (
            <div className="catalog-grid">
              {results.map((item) => (
                <article className="catalog-card" key={item.slug}>
                  <a className="catalog-card-image" href={`/equipment/${item.slug}`} aria-label={`View ${item.title}`}>
                    <img src={item.image} alt={item.alt} loading="lazy" />
                    <span className="status-badge"><BadgeCheck size={14} aria-hidden="true" /> {item.status}</span>
                    {item.availability === 'Rental Available' && <span className="rental-badge">Rental Available</span>}
                  </a>
                  <div className="catalog-card-body">
                    <span className="category-label">{item.category}</span>
                    <h2><a href={`/equipment/${item.slug}`}>{item.title}</a></h2>
                    <div className="catalog-specs">
                      <span><CalendarDays size={15} aria-hidden="true" /> {item.year}</span>
                      <span><Gauge size={15} aria-hidden="true" /> {item.hours ? `${item.hours.toLocaleString()} hours` : 'Hours on request'}</span>
                    </div>
                    <div className="catalog-card-footer">
                      <strong>{item.priceLabel}</strong>
                      <a href={`/equipment/${item.slug}`}>View Details <ArrowRight size={16} aria-hidden="true" /></a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={30} aria-hidden="true" />
              <h2>No matching equipment</h2>
              <p>Try a broader search or tell Gordon what machine you need.</p>
              <button className="button" type="button" onClick={resetFilters}>Reset Filters</button>
            </div>
          )}

          <p className="catalog-disclaimer">Inventory, hours and pricing may change. Contact Gordon to confirm availability and current machine details.</p>
        </div>
      </section>

      <section className="inventory-help">
        <div className="container inventory-help-inner">
          <div>
            <p className="eyebrow">Equipment Sourcing</p>
            <h2>Don&apos;t See the Machine You Need?</h2>
            <p>Tell us what you&apos;re looking for. Gordon can help source equipment that is not currently listed.</p>
          </div>
          <div className="inventory-help-actions">
            <a className="button" href="/#contact">Request Equipment <ArrowRight size={17} aria-hidden="true" /></a>
            <a className="button button-outline light-outline" href="tel:+17707695281"><Phone size={17} aria-hidden="true" /> Call 770-769-5281</a>
          </div>
        </div>
      </section>
    </>
  );
}
