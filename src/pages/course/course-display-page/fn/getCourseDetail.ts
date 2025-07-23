import type MAuthor from "@/global/db/models/MAuthor"
import type MAuthorCourse from "@/global/db/models/MAuthorCourse"
import type MCourse from "@/global/db/models/MCourse"
import type MExerciseFile from "@/global/db/models/MExerciseFile"
import type MThumbnail from "@/global/db/models/MThumbnail"
import type {
  TAuthor,
  TCourse,
  TExerciseFile,
  TThumbnail,
} from "@/global/db/models/schema"
export type TGetCourseDetailResult = {
  course: TCourse | null
  exerciseFiles: TExerciseFile[]
  thumbnails: TThumbnail[]
  authors: TAuthor[]
}
export async function getCourseDetail(
  mCourse: MCourse,
  mExerciseFile: MExerciseFile,
  mThumbnail: MThumbnail,
  mAuthor: MAuthor,
  mAuthorCourse: MAuthorCourse,
  courseId: number
) {
  const results: TGetCourseDetailResult = {
    course: null,
    exerciseFiles: [],
    thumbnails: [],
    authors: [],
  }
  results.course = (await mCourse.getRow(courseId)) as TCourse
  results.exerciseFiles = await mExerciseFile.getListByCourseId(courseId)
  results.thumbnails = await mThumbnail.getListByParent(courseId, "course")

  const authorIds = await mAuthorCourse.getAuthorIdsByCourseId(courseId)
  results.authors = await mAuthor.getListByAuthorIds(authorIds)

  return results
}
