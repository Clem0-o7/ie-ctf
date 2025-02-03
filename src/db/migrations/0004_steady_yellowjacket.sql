ALTER TABLE "flags" RENAME COLUMN "encrypted_flag" TO "encryptedFlag";--> statement-breakpoint
ALTER TABLE "flags" ADD COLUMN "iv" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "flags" DROP COLUMN "created_at";