import { AuthorCourseSchema, type TAuthorCourse } from "./schema"
import DrizzleDB from "./DrizzleDB"
import type { AuthorInterface } from "@/global/classes/types"
import { eq } from "drizzle-orm"

class MAuthorCourse extends DrizzleDB {
  schema = AuthorCourseSchema
  defaultOrder = { courseId: "asc" }

  async exists(courseId: number, authorId: number) {
    return (await this.count({ courseId, authorId })) > 0
  }
  async getAuthorIdsByCourseId(courseId: number) {
    const condition = eq(this.schema.courseId, courseId)
    const rows = await this.db
      .select({ authorId: this.schema.authorId })
      .from(this.schema)
      .where(condition)
    return rows.map((row: TAuthorCourse) => row.authorId) as number[]
  }
}

export default MAuthorCourse
