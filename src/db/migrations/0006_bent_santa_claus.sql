ALTER TABLE "flags" ADD COLUMN "obfuscatedPart1" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "flags" ADD COLUMN "obfuscatedPart2" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "flags" DROP COLUMN "obfuscated_flag";