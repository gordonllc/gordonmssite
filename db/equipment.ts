import { env } from 'cloudflare:workers';
import { equipment as seedEquipment, type EquipmentItem } from '../app/data/equipment';

type EquipmentRow = {
  slug: string;
  year: number;
  make: string;
  model: string;
  title: string;
  category: string;
  price: number;
  hours: number | null;
  availability: EquipmentItem['availability'];
  status: EquipmentItem['status'];
  image: string;
  alternate_image: string | null;
  alt: string;
  description: string;
  featured: number;
  published: number;
  sort_order: number;
};

export type EquipmentInput = Omit<EquipmentItem, 'priceLabel'> & {
  slug?: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

let initialization: Promise<void> | null = null;

function database() {
  if (!env.DB) throw new Error('Inventory database is unavailable.');
  return env.DB;
}

export async function initializeInventory() {
  if (initialization) return initialization;
  initialization = (async () => {
    const db = database();
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS equipment_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        year INTEGER NOT NULL,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        price INTEGER NOT NULL,
        hours INTEGER,
        availability TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Available',
        image TEXT NOT NULL,
        alternate_image TEXT,
        alt TEXT NOT NULL,
        description TEXT NOT NULL,
        featured INTEGER NOT NULL DEFAULT 0,
        published INTEGER NOT NULL DEFAULT 1,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `).run();
    await db.batch([
      db.prepare('CREATE INDEX IF NOT EXISTS idx_equipment_published_sort ON equipment_items (published, sort_order)'),
      db.prepare('CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment_items (status)'),
      db.prepare('CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment_items (category)'),
    ]);
    await db.prepare('PRAGMA optimize').run();

    const now = new Date().toISOString();
    await db.batch(seedEquipment.map((item, index) => db.prepare(`
      INSERT OR IGNORE INTO equipment_items (
        slug, year, make, model, title, category, price, hours, availability,
        status, image, alternate_image, alt, description, featured, published,
        sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
    `).bind(
      item.slug,
      item.year,
      item.make,
      item.model,
      item.title,
      item.category,
      item.price,
      item.hours,
      item.availability,
      item.status,
      item.image,
      item.alternateImage ?? null,
      item.alt,
      item.description,
      item.featured ? 1 : 0,
      seedEquipment.length - index,
      now,
      now,
    )));
  })().catch((error) => {
    initialization = null;
    throw error;
  });
  return initialization;
}

export async function listEquipment(options: {
  publishedOnly?: boolean;
  featuredOnly?: boolean;
  limit?: number;
} = {}): Promise<EquipmentItem[]> {
  await initializeInventory();
  const where = [options.publishedOnly === false ? '' : 'published = 1', options.featuredOnly ? 'featured = 1' : '']
    .filter(Boolean);
  const limit = options.limit ? ' LIMIT ?' : '';
  const statement = database().prepare(`
    SELECT slug, year, make, model, title, category, price, hours, availability,
      status, image, alternate_image, alt, description, featured, published, sort_order
    FROM equipment_items
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY featured DESC, sort_order DESC, updated_at DESC
    ${limit}
  `);
  const result = options.limit
    ? await statement.bind(options.limit).all<EquipmentRow>()
    : await statement.all<EquipmentRow>();
  return result.results.map(mapRow);
}

export async function getEquipmentRecord(slug: string, publishedOnly = true): Promise<EquipmentItem | null> {
  await initializeInventory();
  const result = await database().prepare(`
    SELECT slug, year, make, model, title, category, price, hours, availability,
      status, image, alternate_image, alt, description, featured, published, sort_order
    FROM equipment_items
    WHERE slug = ? ${publishedOnly ? 'AND published = 1' : ''}
    LIMIT 1
  `).bind(slug).first<EquipmentRow>();
  return result ? mapRow(result) : null;
}

export async function createEquipment(input: EquipmentInput): Promise<EquipmentItem> {
  await initializeInventory();
  const slug = input.slug || slugify(input.title);
  const now = new Date().toISOString();
  await database().prepare(`
    INSERT INTO equipment_items (
      slug, year, make, model, title, category, price, hours, availability,
      status, image, alternate_image, alt, description, featured, published,
      sort_order, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    slug, input.year, input.make, input.model, input.title, input.category,
    input.price, input.hours, input.availability, input.status, input.image,
    input.alternateImage ?? null, input.alt, input.description,
    input.featured ? 1 : 0, input.published ? 1 : 0, input.sortOrder, now, now,
  ).run();
  const created = await getEquipmentRecord(slug, false);
  if (!created) throw new Error('The equipment record could not be created.');
  return created;
}

export async function updateEquipment(currentSlug: string, input: EquipmentInput): Promise<EquipmentItem | null> {
  await initializeInventory();
  const slug = input.slug || slugify(input.title);
  await database().prepare(`
    UPDATE equipment_items SET
      slug = ?, year = ?, make = ?, model = ?, title = ?, category = ?,
      price = ?, hours = ?, availability = ?, status = ?, image = ?,
      alternate_image = ?, alt = ?, description = ?, featured = ?,
      published = ?, sort_order = ?, updated_at = ?
    WHERE slug = ?
  `).bind(
    slug, input.year, input.make, input.model, input.title, input.category,
    input.price, input.hours, input.availability, input.status, input.image,
    input.alternateImage ?? null, input.alt, input.description,
    input.featured ? 1 : 0, input.published ? 1 : 0, input.sortOrder,
    new Date().toISOString(), currentSlug,
  ).run();
  return getEquipmentRecord(slug, false);
}

export async function deleteEquipment(slug: string): Promise<EquipmentItem | null> {
  const item = await getEquipmentRecord(slug, false);
  if (!item) return null;
  await database().prepare('DELETE FROM equipment_items WHERE slug = ?').bind(slug).run();
  return item;
}

export function parseEquipmentInput(value: unknown): EquipmentInput {
  const input = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const title = requiredText(input.title, 'title', 140);
  const year = requiredInteger(input.year, 'year', 1900, 2100);
  const price = requiredInteger(input.price, 'price', 0, 100_000_000);
  const rawHours = input.hours === '' || input.hours === null || input.hours === undefined ? null : input.hours;
  const hours = rawHours === null ? null : requiredInteger(rawHours, 'hours', 0, 10_000_000);
  const availability = input.availability === 'Rental Available' ? 'Rental Available' : 'For Sale';
  const allowedStatuses: EquipmentItem['status'][] = ['Available', 'Pending', 'Sold', 'Rented'];
  const status = allowedStatuses.includes(input.status as EquipmentItem['status'])
    ? input.status as EquipmentItem['status']
    : 'Available';
  const image = requiredText(input.image, 'primary image', 2_000);
  if (!isAllowedImageUrl(image)) throw new Error('Enter a valid primary image URL or upload an image.');
  const alternateImage = optionalText(input.alternateImage, 2_000);
  if (alternateImage && !isAllowedImageUrl(alternateImage)) throw new Error('Enter a valid alternate image URL or upload an image.');

  return {
    slug: optionalText(input.slug, 180) ? slugify(String(input.slug)) : slugify(title),
    year,
    make: requiredText(input.make, 'make', 80),
    model: requiredText(input.model, 'model', 100),
    title,
    category: requiredText(input.category, 'category', 100),
    price,
    hours,
    availability,
    status,
    image,
    alternateImage: alternateImage || undefined,
    alt: optionalText(input.alt, 220) || `${title} available from Gordon Machinery Solutions`,
    description: requiredText(input.description, 'description', 1_500),
    featured: Boolean(input.featured),
    published: input.published !== false,
    sortOrder: Number.isFinite(Number(input.sortOrder)) ? Math.trunc(Number(input.sortOrder)) : 0,
  };
}

export function isAdminEmail(email: string) {
  if (process.env.NODE_ENV !== 'production' && email.trim().toLowerCase() === 'seedy@sites.test') return true;
  const allowed = (env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}

function mapRow(row: EquipmentRow): EquipmentItem {
  return {
    slug: row.slug,
    year: row.year,
    make: row.make,
    model: row.model,
    title: row.title,
    category: row.category,
    price: row.price,
    priceLabel: row.price > 0 ? `$${row.price.toLocaleString()}` : 'Call for Price',
    hours: row.hours,
    availability: row.availability,
    status: row.status,
    image: row.image,
    alternateImage: row.alternate_image || undefined,
    alt: row.alt,
    description: row.description,
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    sortOrder: row.sort_order,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180) || `equipment-${Date.now()}`;
}

function requiredText(value: unknown, label: string, max: number) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) throw new Error(`Enter a ${label}.`);
  return text.slice(0, max);
}

function optionalText(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function requiredInteger(value: unknown, label: string, min: number, max: number) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) throw new Error(`Enter a valid ${label}.`);
  return number;
}

function isAllowedImageUrl(value: string) {
  if (value.startsWith('/api/media/')) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}
