import type MCourse from "@/global/db/models/MCourse";

export async function checkCourseExists(mCourse:MCourse,slug:string) {
  return (await mCourse.exists(slug,true)) as number
}