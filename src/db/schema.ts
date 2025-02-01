//@/db/schema.ts

import { pgTable, uuid, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(), // Unique user ID
  name: varchar("name", { length: 255 }).notNull(), // Participant's name
  registerNumber: varchar("register_number", { length: 20 }).notNull().unique(), // Unique student register number
  department: varchar("department", { length: 255 }).notNull(), // Participant's department
  email: varchar("email", { length: 255 }).unique().notNull(), // Email for login
  password: varchar("password", { length: 255 }).notNull(), // Hashed password
  
  level0: boolean("level0").default(false), // Tutorial Level
  level1: boolean("level1").default(false),
  level2: boolean("level2").default(false),
  level3: boolean("level3").default(false),
  level4: boolean("level4").default(false),
  level5: boolean("level5").default(false),
  level6: boolean("level6").default(false),

  finalSubmissionTime: timestamp("final_submission_time", { mode: "date" }), // Final submission timestamp
});

export const flags = pgTable("flags", {
  id: uuid("id").defaultRandom().primaryKey(), // Unique flag ID
  level: integer("level").notNull().unique(), // Level associated with the flag
  flag: varchar("flag", { length: 255 }).notNull(), // Hashed flag for security
});
