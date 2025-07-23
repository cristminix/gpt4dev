import { type InferModel, sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const ThumbnailSchema = sqliteTable("thumbnail", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  kind: text("kind", { length: 10 }).notNull(),
  parentId: integer("parentId").notNull(),
  size: text("size", { length: 50 }).notNull(),
  url: text("url").notNull(),
  path: text("path"),
  expiresAt: text("expiresAt").notNull(),
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})
export type TThumbnail = InferModel<typeof ThumbnailSchema>
export type TThumbnailN = Partial<Pick<TThumbnail, "id" | "timestamp">> &
  Omit<TThumbnail, "id" | "timestamp">

// interface for update record
export type TThumbnailU = Partial<Omit<TThumbnail, "id" | "timestamp">>
