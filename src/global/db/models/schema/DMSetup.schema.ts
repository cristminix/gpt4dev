import { type InferModel, sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const DMSetupSchema = sqliteTable("dmSetup", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  courseId: integer("courseId").notNull(),
  finished: integer("finished").notNull(),
  availableFmt: text("availableFmt").notNull(),
  availableTrans: text("availableTrans").notNull(),
  selectedFmt: text("selectedFmt").notNull(),
  selectedTrans: text("selectedTrans").notNull(),
  exerciseFiles: text("exerciseFiles"),
  sourceRepo: text("sourceRepo"),
  enableFilenameIndex: integer("enableFilenameIndex"),
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})
export type TDMSetupSchema = InferModel<typeof DMSetupSchema>
