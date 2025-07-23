<script lang="ts">
    import type DBStore from "@/global/db/DBStore"
    import type MCourse from "@/global/db/models/MCourse";
    import type MAuthor from "@/global/db/models/MAuthor";
    import type MSection from "@/global/db/models/MSection";
    import type MToc from "@/global/db/models/MToc";
    import type MExerciseFile from "@/global/db/models/MExerciseFile";
    import type MThumbnail from "@/global/db/models/MThumbnail";
    import type {AuthorInterface, CourseAuthorInterface, CourseInfoInterface, TocSecInterface} from "@/global/classes/types";
    import {processCourseQueue} from "./icrd-queue-man/fn/processCourseQueue";
    import type MAuthorCourse from "@/global/db/models/MAuthorCourse";
    import {processQueueAuthor} from "@/options/pages/course/add-course-page/icrd-queue-man/fn/processQueueAuthor";
    import Button from "@/global/components/ux/Button.svelte";
    import {onMount} from "svelte";
    import { processQueueSection, processQueueToc } from "./icrd-queue-man/fn";
    import { processQueueExerciseFile } from "./icrd-queue-man/fn/processQueueExerciseFile";
    import { processQueueThumbnail } from "./icrd-queue-man/fn/processQueueThumbnail";

    export let routeApp: any = null
    
    export let store: DBStore
    export let config: any = null

    let mCourse:MCourse
    let mAuthor:MAuthor
    let mAuthorCourse:MAuthorCourse
    let mSection:MSection
    let mToc:MToc
    let mExFile:MExerciseFile
    let mThumbnail:MThumbnail
    // let menus: any = []


    export async function processQueue(courseInfo:CourseInfoInterface,authors:CourseAuthorInterface[],tocsBySections:TocSecInterface){
        const resultPQC = await processCourseQueue(mCourse,courseInfo)
        console.log({processCourseQueue:resultPQC})
        const {id:courseId} = resultPQC
        const resultPQA = await processQueueAuthor(mAuthorCourse,mAuthor,courseId,authors)
        console.log({processQueueAuthor:resultPQA})
        // process exercise files
        const {exerciseFiles} = courseInfo
        if(Array.isArray(exerciseFiles)){
            if(exerciseFiles.length > 0){
                const resultPQEF = await processQueueExerciseFile(mExFile,exerciseFiles,courseId)
                console.log({processQueueExerciseFile:resultPQEF})
            }
        } 
        // process thumbnails

        const {thumbnails} = courseInfo
        if(Array.isArray(thumbnails)){
            if(thumbnails.length > 0){
                const resultPQTMB = await processQueueThumbnail(mThumbnail,thumbnails,courseId)
                console.log({processQueueThumbnail:resultPQTMB})
            }
            
        }
        
        
        if(Array.isArray(courseInfo.sections)&& Object.keys(tocsBySections).length > 0){
            const {sections:inputSections} = courseInfo
            const resultPQS = await processQueueSection(mSection,inputSections,courseId)
            const {sections:sectionRecs} = resultPQS
            console.log({processQueueSection:resultPQS})

            for (const sectionRec of sectionRecs) {
                const {id:sectionId,slug:sectionSlug} = sectionRec
                const tocs = tocsBySections[sectionSlug]
                const resultPQT = await processQueueToc(mToc,tocs,sectionId)
                console.log({processQueueToc:resultPQT})
            }
            
        }else{
            console.log("No sections found")
        }
        if(routeApp){
            routeApp.triggerRouteChangeKey("menu")
        }
        return {courseId}
    }
    onMount(() => {
        if (store.isReady()) {
            mCourse = store.get<MCourse>("Course") as MCourse
            mAuthor = store.get<MAuthor>("Author") as MAuthor
            mAuthorCourse = store.get<MAuthorCourse>("AuthorCourse") as MAuthorCourse
            mSection = store.get<MSection>("Section") as MSection
            mToc = store.get<MToc>("Toc") as MToc
            mExFile = store.get<MExerciseFile>("ExerciseFile") as MExerciseFile
            mThumbnail = store.get<MThumbnail>("Thumbnail") as MThumbnail
        }
    })

</script>
<div>
<!--    <Button caption="Process ICRD Queue" on:click/>-->
</div>
