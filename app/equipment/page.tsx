import type { Metadata } from 'next';
import { equipmentCategories } from '../data/equipment';
import { SiteFooter, SiteHeader } from '../components/site-chrome';
import CatalogClient from './catalog-client';

export const metadata: Metadata = {
  title: 'Equipment Inventory | Gordon Machinery Solutions',
  description: 'Browse company-owned excavators, backhoe loaders, stump grinders and rental-ready equipment available from Gordon Machinery Solutions.',
  alternates: { canonical: '/equipment' },
  openGraph: {
    title: 'Equipment Inventory | Gordon Machinery Solutions',
    description: 'Browse company-owned heavy equipment for sale and rent in the Atlanta area.',
    url: '/equipment',
  },
  twitter: {
    title: 'Equipment Inventory | Gordon Machinery Solutions',
    description: 'Browse company-owned heavy equipment for sale and rent in the Atlanta area.',
  },
};

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; availability?: string }>;
}) {
  const params = await searchParams;
  const requested = params.category;
  const initialCategory = requested && equipmentCategories.includes(requested)
    ? requested
    : 'All Equipment';
  const initialAvailability = params.availability === 'Rental Available' || params.availability === 'For Sale'
    ? params.availability
    : 'All Availability';

  return (
    <main id="top">
      <SiteHeader active="inventory" />
      <CatalogClient initialCategory={initialCategory} initialAvailability={initialAvailability} />
      <SiteFooter />
    </main>
  );
}
