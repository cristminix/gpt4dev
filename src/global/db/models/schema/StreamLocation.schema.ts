import { type InferModel, sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const StreamLocationSchema = sqliteTable("streamLocation", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  tocId: integer("tocId").notNull(),
  fmt: text("fmt", { length: 50 }).notNull(),
  url: text("url").notNull(),
  expiresAt: text("expiresAt").notNull(),
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})
export type TStreamLocationSchema = InferModel<typeof StreamLocationSchema>
