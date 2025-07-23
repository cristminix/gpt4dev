import type MCourse from "@/global/db/models/MCourse"
import type { TCourse, TCourseN } from "@/global/db/models/schema"

export async function createCourse(courseRow: TCourseN, mCourse: MCourse, commit = true) {
  let course: TCourse | null
  const { slug } = courseRow
  if (!(await mCourse.exists(slug))) {
    course = await mCourse.create(courseRow)
  } else {
    const existing = await mCourse.getBySlug(slug)
    course = await mCourse.update(existing.id, courseRow)
  }
  if (commit) await mCourse.commit()
  return course
}
