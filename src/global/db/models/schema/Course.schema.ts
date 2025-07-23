import { type InferModel, sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const CourseSchema = sqliteTable("course", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  duration: integer("duration").notNull(),
  sourceCodeRepository: text("sourceCodeRepository"),
  description: text("description"),
  urn: text("urn").notNull(),
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})
export type TCourse = InferModel<typeof CourseSchema>
// interface for new record
export type TCourseN = Partial<Pick<TCourse, "id" | "timestamp">> & Omit<TCourse, "id" | "timestamp">

// interface for update record
export type TCourseU = Partial<Omit<TCourse, "id" | "timestamp">>
