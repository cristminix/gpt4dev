import { type InferModel, sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const ExerciseFileSchema = sqliteTable("exerciseFile", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  courseId: integer("courseId").notNull(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  size: integer("size").notNull(),
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})
export type TExerciseFile = InferModel<typeof ExerciseFileSchema>
// interface for new record
export type TExerciseFileN = Partial<Pick<TExerciseFile, "id" | "timestamp">> & Omit<TExerciseFile, "id" | "timestamp">

// interface for update record
export type TExerciseFileU = Partial<Omit<TExerciseFile, "id" | "timestamp">>