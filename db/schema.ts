import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const equipmentItems = sqliteTable('equipment_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  year: integer('year').notNull(),
  make: text('make').notNull(),
  model: text('model').notNull(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  price: integer('price').notNull(),
  hours: integer('hours'),
  availability: text('availability').notNull(),
  status: text('status').notNull().default('Available'),
  image: text('image').notNull(),
  alternateImage: text('alternate_image'),
  alt: text('alt').notNull(),
  description: text('description').notNull(),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  published: integer('published', { mode: 'boolean' }).notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (table) => [
  index('idx_equipment_published_sort').on(table.published, table.sortOrder),
  index('idx_equipment_status').on(table.status),
  index('idx_equipment_category').on(table.category),
]);
