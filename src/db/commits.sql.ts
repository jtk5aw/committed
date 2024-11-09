import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const commits = sqliteTable("commits", {
  id: integer({ mode: "number" }).primaryKey({
    autoIncrement: true,
  }),
  user_id: integer({ mode: "number" })
    .notNull()
    .references(() => users.id),
  // Nullable to indicate it isn't attached to anything
  parent_commit_id: integer({ mode: "number" }),
  content: text().notNull(),
  deleted: integer({ mode: "boolean" }).notNull(),
  created_at: text().default(sql`(CURRENT_TIMESTAMP)`),
  updated_at: text()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const users = sqliteTable(
  "users",
  {
    id: integer({ mode: "number" }).primaryKey({
      autoIncrement: true,
    }),
    // TODO: Add email for magic link login later
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    salt: text("salt").notNull(),
    deleted: integer("deleted", { mode: "boolean" }).notNull(),
    public: integer("public", { mode: "boolean" }).notNull(),
    created_at: text().default(sql`(CURRENT_TIMESTAMP)`),
    updated_at: text()
      .default(sql`(CURRENT_TIMESTAMP)`)
      .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
  },
  (table) => {
    return {
      usernameIdx: index("username_idx").on(table.username),
    };
  },
);
