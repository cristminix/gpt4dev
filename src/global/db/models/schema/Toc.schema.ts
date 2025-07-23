import { type InferModel, sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const TocSchema = sqliteTable("toc", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  sectionId: integer("sectionId").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  itemStar: text("itemStar"),
  vStatusUrn: text("vStatusUrn"),
  visibility: text("visibility"),
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})
export type TToc = InferModel<typeof TocSchema>
// interface for new record
export type TTocN = Partial<Pick<TToc, "id" | "timestamp">> & Omit<TToc, "id" | "timestamp">

// interface for update record
export type TTocU = Partial<Omit<TToc, "id" | "timestamp">>
