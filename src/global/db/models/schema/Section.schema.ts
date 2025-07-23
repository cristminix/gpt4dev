import { type InferModel, sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const SectionSchema = sqliteTable("section", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  courseId: integer("courseId").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})
export type TSection = InferModel<typeof SectionSchema>
// interface for new record
export type TSectionN = Partial<Pick<TSection, "id" | "timestamp">> & Omit<TSection, "id" | "timestamp">

// interface for update record
export type TSectionU = Partial<Omit<TSection, "id" | "timestamp">>
