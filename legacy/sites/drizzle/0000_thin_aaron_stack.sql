CREATE TABLE `equipment_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`year` integer NOT NULL,
	`make` text NOT NULL,
	`model` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`price` integer NOT NULL,
	`hours` integer,
	`availability` text NOT NULL,
	`status` text DEFAULT 'Available' NOT NULL,
	`image` text NOT NULL,
	`alternate_image` text,
	`alt` text NOT NULL,
	`description` text NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `equipment_items_slug_unique` ON `equipment_items` (`slug`);