import type MAuthorCourse from "@/global/db/models/MAuthorCourse";

export async function checkAuthorCourseExists(mAuthorCourse: MAuthorCourse,courseId:number,authorId:number){
    return (await mAuthorCourse.exists(courseId,authorId))
}