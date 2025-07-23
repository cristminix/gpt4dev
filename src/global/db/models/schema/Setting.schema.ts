import { type InferModel, sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const SettingSchema = sqliteTable("setting", {
  key: text("key", { length: 100 }).notNull(),
  value: text("value").notNull(),
  kind: text("kind", { length: 50 }).notNull(),
  description: text("description", { length: 255 }),
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})
export type TSetting = InferModel<typeof SettingSchema>
