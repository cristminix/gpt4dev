import type {CourseInfoInterface} from "@/global/classes/types";
import {
    checkCourseExists,
    insertCourse,
    updateCourse
} from "@/options/pages/course/add-course-page/icrd-queue-man/tasks/course";
import type {TCourse, TCourseN, TCourseU} from "@/global/db/models/schema";
import type MCourse from "@/global/db/models/MCourse";
// export type TProcessCourseQueueResult = {
//     pk:number
// }
export async function processCourseQueue(mCourse:MCourse,courseInfo:CourseInfoInterface){
     const {slug, title, description, duration,sourceCodeRepository,urn} = courseInfo
     const courseId = await checkCourseExists(mCourse, slug)
     let result:TCourse
     if(courseId){
         const row:TCourseU = {slug, title, description, duration,sourceCodeRepository,urn}
         result = await updateCourse(mCourse,courseId, row)
     }else{
         const row : TCourseN = {slug, title, description, duration,sourceCodeRepository,urn}
         result = await insertCourse(mCourse,row)
     }
     return result
 }