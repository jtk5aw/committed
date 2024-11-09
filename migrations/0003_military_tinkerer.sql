ALTER TABLE `users` RENAME COLUMN "user_name" TO "username";--> statement-breakpoint
DROP INDEX IF EXISTS `users_user_name_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);