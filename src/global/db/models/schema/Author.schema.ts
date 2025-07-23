import { type InferModel, sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const AuthorSchema = sqliteTable("author", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  bio: text("bio").notNull(),
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})
export type TAuthor = InferModel<typeof AuthorSchema>
// interface for new record
export type TAuthorN = Partial<Pick<TAuthor, "id" | "timestamp">> & Omit<TAuthor, "id" | "timestamp">

// interface for update record
export type TAuthorU = Partial<Omit<TAuthor, "id" | "timestamp">>
