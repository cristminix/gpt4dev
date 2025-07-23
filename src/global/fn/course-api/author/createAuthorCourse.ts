import type MAuthorCourse from "@/global/db/models/MAuthorCourse"
import type { TAuthorCourse, TAuthorCourseN } from "@/global/db/models/schema"

export async function createAuthorCourse(authorCourseRow: TAuthorCourseN, mAuthorCourse: MAuthorCourse) {
  let authorRec: TAuthorCourse | null = null
  const { courseId, authorId } = authorCourseRow
  const existing = await mAuthorCourse.getRow({ courseId, authorId })
  if (!existing) {
    authorRec = await mAuthorCourse.create(authorCourseRow)
  } else {
    authorRec = existing
  }
  return authorRec
}
