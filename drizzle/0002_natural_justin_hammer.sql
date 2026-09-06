CREATE TABLE `inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`company` text,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`interest` text NOT NULL,
	`equipment_slug` text,
	`equipment_title` text,
	`message` text NOT NULL,
	`source_page` text DEFAULT '/' NOT NULL,
	`status` text DEFAULT 'New' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_inquiries_status_created` ON `inquiries` (`status`,`created_at`);