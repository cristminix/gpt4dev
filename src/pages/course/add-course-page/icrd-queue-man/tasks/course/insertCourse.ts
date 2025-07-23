import type MCourse from "@/global/db/models/MCourse";
import type {TCourse, TCourseN} from "@/global/db/models/schema";

export async function insertCourse(mCourse:MCourse,row:TCourseN) {
    return (await mCourse.create(row,true)) as TCourse
}