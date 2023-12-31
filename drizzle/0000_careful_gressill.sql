CREATE TABLE `answer_upvotes` (
	`upvoter_name` text NOT NULL,
	`answer_id` integer NOT NULL,
	PRIMARY KEY(`answer_id`, `upvoter_name`),
	FOREIGN KEY (`answer_id`) REFERENCES `answers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`creator_name` text NOT NULL,
	`creator_image` text,
	`creation_timestamp` text NOT NULL,
	`description` text NOT NULL,
	`question_id` integer,
	`creator_crypto_address` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`creator_name` text NOT NULL,
	`creator_image` text,
	`creation_timestamp` text NOT NULL,
	`description` text NOT NULL,
	`selected_answer_id` integer,
	`chip_recipient_address` text DEFAULT '' NOT NULL,
	`chip_wallet_id` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`selected_answer_id`) REFERENCES `answers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `upvotes` (
	`upvoter_name` text NOT NULL,
	`question_id` integer NOT NULL,
	PRIMARY KEY(`question_id`, `upvoter_name`),
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `questions_title_unique` ON `questions` (`title`);