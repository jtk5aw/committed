PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_commits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`parent_commit_id` integer,
	`content` text NOT NULL,
	`deleted` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_commits`("id", "user_id", "parent_commit_id", "content", "deleted", "created_at", "updated_at") SELECT "id", "user_id", "parent_commit_id", "content", "deleted", "created_at", "updated_at" FROM `commits`;--> statement-breakpoint
DROP TABLE `commits`;--> statement-breakpoint
ALTER TABLE `__new_commits` RENAME TO `commits`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `username_idx` ON `users` (`username`);