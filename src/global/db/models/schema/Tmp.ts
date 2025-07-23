// many to many Author <----> Course
import { type InferModel, sql, relations } from "drizzle-orm"
import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core"
import { TocSchema } from "./Toc.schema"
import { SectionSchema } from "./Section.schema"

export const TocSectionSchema = sqliteTable(
  "tocSection",
  {
    sectionId: integer("sectionId")
      .notNull()
      .references(() => TocSchema.id),
    tocId: integer("tocId")
      .notNull()
      .references(() => SectionSchema.id),
    timestamp: text("timestamp")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.sectionId, t.tocId] }),
  })
)

export const SectionRelations = relations(TocSchema, ({ many }) => ({
  TocSectionSchema: many(TocSectionSchema),
}))

export const TocRelations = relations(SectionSchema, ({ many }) => ({
  TocSectionSchema: many(TocSectionSchema),
}))
export type TocSection = InferModel<typeof TocSectionSchema>
