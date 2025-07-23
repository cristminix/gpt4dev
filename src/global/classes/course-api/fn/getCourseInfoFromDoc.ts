import {getCourseXmlParentElement} from "@/global/fn/course/getCourseXmlParentElement";
import {isValidUrl} from "@/global/fn/course/isValidUrl";
import jQuery from "jquery";
import type {CourseInfoInterface, ThumbnailInterface} from "@/global/classes/types";
import {el2Obj} from "@/global/fn/course/el2Obj";
import {getThumbUrlFromArtifact} from "@/global/fn/course/getThumbUrlFromArtifact";
import {getCourseSectionsFromDoc} from "@/global/classes/course-api/fn/getCourseSectionsFromDoc";
export function getCourseInfoFromDoc(doc: any,slug:string) {
    let courseInfo: CourseInfoInterface|null = null
    const [pp, courseUrn] = getCourseXmlParentElement(doc)
    if (pp) {
        const p = pp as JQuery
        let courseSlugFound = p.find("slug:first").text()
        console.log(`course slug found : ${courseSlugFound}`)

        courseInfo = {
            url: `https://www.linkedin.com/learning/${slug}`,
            title:"",
            slug,
            exerciseFiles: [],
            sourceCodeRepository: "",
            description: "",
            urn: courseUrn as string,
            duration:0
        }
        courseInfo.title = p.find("title:first").text()
        courseInfo.visibility = p.find("visibility").text()

        let viewerCounts = p.find("viewerCounts")
        if (viewerCounts.length > 0) {
            courseInfo.viewerCounts = parseInt(viewerCounts.find("total").text())
        }

        courseInfo.description = p.find("description").text()
        const descriptionV2 = p.find("descriptionV2 text")
        if (descriptionV2.length > 0) {
            courseInfo.description = descriptionV2.text()
        }
        let descriptionV3: any = p.find("descriptionV3 text")
        if (descriptionV3.length > 0) {
            descriptionV3 = jQuery(descriptionV3[0].firstChild).text()
            if (descriptionV3) {
                courseInfo.description = descriptionV3
            }
        }
        let duration = p.find("duration")
        if (duration.length > 0) {
            courseInfo.duration = parseInt(p.find("duration").text())
        }

        let dificulty = p.find("dificulty")
        if (dificulty.length > 0) {
            courseInfo.dificulty = dificulty.find("difficultylevel").text()
        }

        let sourceCodeRepo = p.find("sourceCodeRepository")
        if (sourceCodeRepo.length > 0) {
            const repoUrl = sourceCodeRepo.text()
            if (isValidUrl(repoUrl)) {
                courseInfo.sourceCodeRepository = repoUrl
            }
        }

        let tags = ["sizeInBytes", "name", "url"]
        let exerciseFilesNds = p.find("exerciseFiles")
        let exerciseFiles = []

        if (exerciseFilesNds.length > 0) {
            for (const exerciseFileElem of exerciseFilesNds) {
                const exerciseFileElemNd = jQuery(exerciseFileElem)
                // console.log(exerciseFileElemNd.html())
                let exerciseFileItem: any = {}
                for (const tag of tags) {
                    // const tag = tags[i]
                    let exerciseFileNd = exerciseFileElemNd.find(tag)
                    if (exerciseFileNd.length > 0) {
                        const text = exerciseFileNd.text().trim()

                        if (tag == "sizeInBytes") {
                            exerciseFileItem[tag] = parseInt(text)
                        } else {
                            exerciseFileItem[tag] = text
                        }
                    }
                }
                if(exerciseFileItem.url) {
                    exerciseFiles.push(exerciseFileItem)
                }
            }
        }
        courseInfo.exerciseFiles = exerciseFiles

        // Get course thumbnails
        // Only works from browser env but can't get work on vitest env
        let thumbRootUrl = p.find("primaryThumbnail rootUrl:first").text().trim()
        let thumbRootUrlV2 = p.find("primaryThumbnailV2 rootUrl:first").text().trim()
        if (thumbRootUrlV2.length > 0) {
            thumbRootUrl = thumbRootUrlV2
        }
        const thumbs = p.find("primaryThumbnail artifacts")
        const thumbV2s = p.find("primaryThumbnailV2 artifacts")
        console.log({thumbs, thumbRootUrl})
        console.log({thumbV2s, thumbRootUrlV2})
        const thumbnails:ThumbnailInterface[] = []
        if (thumbs.length > 0) {
            for (const artifactEl of thumbs) {
                const artifact = el2Obj(artifactEl)
                if (artifact) {
                    const thumbUrl = getThumbUrlFromArtifact(artifact, thumbRootUrl)
                    // console.log(thumbUrl)
                    const size = `${artifact.width}x${artifact.height}`
                    const expiresAt = parseInt(artifact.expiresat)
                    const thumbnail:ThumbnailInterface = { size, url:thumbUrl!, expiresAt}
                    thumbnails.push(thumbnail)
                }
            }
        } else if (thumbV2s.length > 0) {
            for (const artifactEl of thumbV2s) {
                const artifact = el2Obj(artifactEl)
                if (artifact) {
                    const thumbUrl = getThumbUrlFromArtifact(artifact, thumbRootUrlV2)
                    // console.log(thumbUrl)
                    const size = `${artifact.width}x${artifact.height}`
                    const expiresAt = parseInt(artifact.expiresat)
                    const thumbnail :ThumbnailInterface= {size, url:thumbUrl!, expiresAt}
                    thumbnails.push(thumbnail)
                }
            }
        }
        courseInfo.thumbnails = thumbnails
        courseInfo.sections = getCourseSectionsFromDoc(doc)
        // const {title, slug, sourceCodeRepository, description, urn} = course

    }
    console.log(courseInfo)
    return courseInfo
}