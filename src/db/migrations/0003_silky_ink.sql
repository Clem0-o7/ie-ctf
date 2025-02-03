ALTER TABLE "flags" ADD COLUMN "encrypted_flag" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "flags" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "flags" DROP COLUMN "originalFlag";