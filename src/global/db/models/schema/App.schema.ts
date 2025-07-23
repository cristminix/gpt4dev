import { type InferModel, sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const AppSchema = sqliteTable("app", {
  version: text("version", { length: 10 }).notNull(),
  freshInstall: integer("freshInstall").notNull(),
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})
export type TApp = InferModel<typeof AppSchema>
