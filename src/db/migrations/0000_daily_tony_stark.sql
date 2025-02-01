CREATE TABLE "flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"level" integer NOT NULL,
	"flag" varchar(255) NOT NULL,
	CONSTRAINT "flags_level_unique" UNIQUE("level")
);
--> statement-breakpoint
CREATE TABLE "hints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"level" integer NOT NULL,
	"hint" varchar(1000) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"register_number" varchar(20) NOT NULL,
	"department" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"level0" boolean DEFAULT false,
	"level1" boolean DEFAULT false,
	"level2" boolean DEFAULT false,
	"level3" boolean DEFAULT false,
	"level4" boolean DEFAULT false,
	"level5" boolean DEFAULT false,
	"level6" boolean DEFAULT false,
	"final_submission_time" timestamp,
	CONSTRAINT "users_register_number_unique" UNIQUE("register_number"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
