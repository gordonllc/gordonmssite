import { env } from 'cloudflare:workers';

export type InquiryStatus = 'New' | 'Contacted' | 'Closed';

export type Inquiry = {
  id: number;
  name: string;
  company: string | null;
  phone: string;
  email: string;
  interest: string;
  equipmentSlug: string | null;
  equipmentTitle: string | null;
  message: string;
  sourcePage: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
};

type InquiryRow = {
  id: number;
  name: string;
  company: string | null;
  phone: string;
  email: string;
  interest: string;
  equipment_slug: string | null;
  equipment_title: string | null;
  message: string;
  source_page: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
};

export type InquiryInput = Omit<Inquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

let initialization: Promise<void> | null = null;

function database() {
  if (!env.DB) throw new Error('Inquiry database is unavailable.');
  return env.DB;
}

export async function initializeInquiries() {
  if (initialization) return initialization;
  initialization = (async () => {
    const db = database();
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        company TEXT,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        interest TEXT NOT NULL,
        equipment_slug TEXT,
        equipment_title TEXT,
        message TEXT NOT NULL,
        source_page TEXT NOT NULL DEFAULT '/',
        status TEXT NOT NULL DEFAULT 'New',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `).run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_inquiries_status_created ON inquiries (status, created_at)').run();
    await db.prepare('PRAGMA optimize').run();
  })().catch((error) => {
    initialization = null;
    throw error;
  });
  return initialization;
}

export async function createInquiry(input: InquiryInput): Promise<Inquiry> {
  await initializeInquiries();
  const db = database();
  const duplicateCutoff = new Date(Date.now() - 2 * 60 * 1000).toISOString();
  const duplicate = await db.prepare(`
    SELECT id, name, company, phone, email, interest, equipment_slug,
      equipment_title, message, source_page, status, created_at, updated_at
    FROM inquiries
    WHERE email = ? AND phone = ? AND message = ? AND created_at >= ?
    ORDER BY id DESC LIMIT 1
  `).bind(input.email, input.phone, input.message, duplicateCutoff).first<InquiryRow>();
  if (duplicate) return mapRow(duplicate);

  const now = new Date().toISOString();
  const result = await db.prepare(`
    INSERT INTO inquiries (
      name, company, phone, email, interest, equipment_slug, equipment_title,
      message, source_page, status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'New', ?, ?)
  `).bind(
    input.name,
    input.company,
    input.phone,
    input.email,
    input.interest,
    input.equipmentSlug,
    input.equipmentTitle,
    input.message,
    input.sourcePage,
    now,
    now,
  ).run();
  const id = Number(result.meta.last_row_id);
  const created = await getInquiry(id);
  if (!created) throw new Error('The inquiry could not be saved.');
  return created;
}

export async function listInquiries(): Promise<Inquiry[]> {
  await initializeInquiries();
  const result = await database().prepare(`
    SELECT id, name, company, phone, email, interest, equipment_slug,
      equipment_title, message, source_page, status, created_at, updated_at
    FROM inquiries
    ORDER BY CASE status WHEN 'New' THEN 0 WHEN 'Contacted' THEN 1 ELSE 2 END,
      created_at DESC
  `).all<InquiryRow>();
  return result.results.map(mapRow);
}

export async function updateInquiryStatus(id: number, status: InquiryStatus): Promise<Inquiry | null> {
  await initializeInquiries();
  await database().prepare('UPDATE inquiries SET status = ?, updated_at = ? WHERE id = ?')
    .bind(status, new Date().toISOString(), id)
    .run();
  return getInquiry(id);
}

export function parseInquiryInput(value: unknown): InquiryInput & { website: string } {
  const input = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const email = requiredText(input.email, 'email', 180).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid email address.');
  const phone = requiredText(input.phone, 'phone number', 40);
  if (!/[0-9]{7}/.test(phone.replace(/\D/g, ''))) throw new Error('Enter a valid phone number.');

  return {
    name: requiredText(input.name, 'name', 120),
    company: optionalText(input.company, 140) || null,
    phone,
    email,
    interest: requiredText(input.interest, 'area of interest', 100),
    equipmentSlug: optionalText(input.equipmentSlug, 180) || null,
    equipmentTitle: optionalText(input.equipmentTitle, 180) || null,
    message: requiredText(input.message, 'message', 2_000),
    sourcePage: optionalText(input.sourcePage, 500) || '/',
    website: optionalText(input.website, 300),
  };
}

function getInquiry(id: number) {
  return database().prepare(`
    SELECT id, name, company, phone, email, interest, equipment_slug,
      equipment_title, message, source_page, status, created_at, updated_at
    FROM inquiries WHERE id = ? LIMIT 1
  `).bind(id).first<InquiryRow>().then((row) => row ? mapRow(row) : null);
}

function mapRow(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    phone: row.phone,
    email: row.email,
    interest: row.interest,
    equipmentSlug: row.equipment_slug,
    equipmentTitle: row.equipment_title,
    message: row.message,
    sourcePage: row.source_page,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function requiredText(value: unknown, label: string, max: number) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) throw new Error(`Enter your ${label}.`);
  return text.slice(0, max);
}

function optionalText(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}
