import type MSection from "@/global/db/models/MSection";
import type {TSection, TSectionN, TSectionU, TToc} from "@/global/db/models/schema";
import type {SectionInterface, TocInterface, TocSecInterface} from "@/global/classes/types";
import {
    checkSectionExists,
    insertSection,
    updateSection
} from "@/options/pages/course/add-course-page/icrd-queue-man/tasks/section";

export type TProcessQueueSectionResult ={
    sections:TSection[],
}
export async function processQueueSection(mSection:MSection,sections:SectionInterface[],courseId:number){
    let results:TProcessQueueSectionResult = {
        sections:[] 
    }
    for(const section of sections){
        const {title,slug,itemStars} = section
        let sectionId = await checkSectionExists(mSection,courseId,slug)
        let sectionRec:TSection
        if(sectionId) {
            const row:TSectionU = {title , slug, courseId}
            sectionRec = await updateSection(mSection,sectionId, row)
        }else {
            const row:TSectionN = {title , slug, courseId}
            sectionRec = await insertSection(mSection, row)
            sectionId = sectionRec.id
        }
        results.sections.push(sectionRec)
        // results.tocSections[slug] =
        // const authorCourseExists = await checkAuthorCourseExists(mAuthorCourse,courseId,sectionId)
        // if(!authorCourseExists){
        //     const authorCourse = await insertAuthorCourse(mAuthorCourse,{courseId,authorId: sectionId})
        //     results.authorCourses.push(authorCourse)
        // }
    }
    return results;
}