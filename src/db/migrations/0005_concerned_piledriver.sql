ALTER TABLE "flags" ADD COLUMN "obfuscated_flag" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "flags" DROP COLUMN "encryptedFlag";--> statement-breakpoint
ALTER TABLE "flags" DROP COLUMN "iv";