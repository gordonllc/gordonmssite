CREATE INDEX `idx_equipment_published_sort` ON `equipment_items` (`published`,`sort_order`);--> statement-breakpoint
CREATE INDEX `idx_equipment_status` ON `equipment_items` (`status`);--> statement-breakpoint
CREATE INDEX `idx_equipment_category` ON `equipment_items` (`category`);--> statement-breakpoint
PRAGMA optimize;
