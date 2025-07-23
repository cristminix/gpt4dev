// many to many Author <----> Course
import { type InferModel, sql, relations } from "drizzle-orm"
import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core"
import { CourseSchema } from "./Course.schema"
import { AuthorSchema } from "./Author.schema"

export const AuthorCourseSchema = sqliteTable(
  "authorCourse",
  {
    courseId: integer("courseId")
      .notNull()
      .references(() => CourseSchema.id),
    authorId: integer("authorId")
      .notNull()
      .references(() => AuthorSchema.id),
    timestamp: text("timestamp")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.courseId, t.authorId] }),
  })
)

export const CourseRelations = relations(CourseSchema, ({ many }) => ({
  AuthorCourseSchema: many(AuthorCourseSchema),
}))

export const AuthorRelations = relations(AuthorSchema, ({ many }) => ({
  AuthorCourseSchema: many(AuthorCourseSchema),
}))
export type TAuthorCourse = InferModel<typeof AuthorCourseSchema>
export type TAuthorCourseN = Partial<Pick<TAuthorCourse, "timestamp">> & Omit<TAuthorCourse, "timestamp">

// interface for update record
export type TAuthorCourseU = Partial<Omit<TAuthorCourse, "timestamp">>
