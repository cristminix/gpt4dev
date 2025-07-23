import type MAuthor from "@/global/db/models/MAuthor";
import type {AuthorInterface, CourseAuthorInterface} from "@/global/classes/types";
import {
    checkAuthorExists,
    insertAuthor,
    updateAuthor
} from "@/options/pages/course/add-course-page/icrd-queue-man/tasks/author";
import type {TAuthor, TAuthorCourse, TAuthorN, TAuthorU} from "@/global/db/models/schema";
import {
    checkAuthorCourseExists
} from "@/options/pages/course/add-course-page/icrd-queue-man/tasks/author-course/checkAuthorCourseExists";
import type MAuthorCourse from "@/global/db/models/MAuthorCourse";
import {
    insertAuthorCourse
} from "@/options/pages/course/add-course-page/icrd-queue-man/tasks/author-course/insertAuthorCourse";

export type TProcessQueueAuthorResult = {
    authors: TAuthor[],
    authorCourses: TAuthorCourse[]
}
export async function processQueueAuthor(mAuthorCourse:MAuthorCourse,mAuthor:MAuthor,courseId:number,authors:CourseAuthorInterface[]){
    let results:TProcessQueueAuthorResult = {
        authors:[],
        authorCourses:[]
    }
    for(const author of authors){
        const {name,slug,shortBiography} = author
        let authorId = await checkAuthorExists(mAuthor,slug)
        let authorRec:TAuthor
        if(authorId) {
            const row:TAuthorU = {name, slug, bio:shortBiography}
            authorRec = await updateAuthor(mAuthor,authorId, row)
        }else {
            const row:TAuthorN = {name, slug, bio:shortBiography}
            authorRec = await insertAuthor(mAuthor, row)
            authorId = authorRec.id
        }
        results.authors.push(authorRec)
        const authorCourseExists = await checkAuthorCourseExists(mAuthorCourse,courseId,authorId)
        if(!authorCourseExists){
            const authorCourse = await insertAuthorCourse(mAuthorCourse,{courseId,authorId})
            results.authorCourses.push(authorCourse)
        }
    }
    return results;
}