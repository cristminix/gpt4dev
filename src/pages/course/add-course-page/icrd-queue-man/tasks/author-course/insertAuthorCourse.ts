import type MAuthorCourse from "@/global/db/models/MAuthorCourse";
import type {TAuthorCourse, TAuthorCourseN} from "@/global/db/models/schema";

export async function insertAuthorCourse(mAuthorCourse:MAuthorCourse, row:TAuthorCourseN) {
  return await (mAuthorCourse.create(row,true)) as TAuthorCourse
}