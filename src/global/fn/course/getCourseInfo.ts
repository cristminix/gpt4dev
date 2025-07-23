import { el2Obj } from "./el2Obj"
import { getCourseXmlParentElement } from "./getCourseXmlParentElement"
import { getThumbUrlFromArtifact } from "./getThumbUrlFromArtifact"
import { isValidUrl } from "./isValidUrl"

export const getCourseInfo = async (doc: JQuery, courseSlug: string, mCourse: any, mExerciseFile: any, mThumbnail: any, noCache: boolean = false) => {
  let course: any = null
  if (!noCache) {
    course = mCourse.getBySlug(courseSlug)

    if (course) {
      course.exerciseFiles = mExerciseFile.getListByCourseId(course.id)
      // if()
      course.thumbnails = mThumbnail.getListByCourseId(course.id)
      return course
    }
  }
  // let course = null
  const [pp, courseUrn] = getCourseXmlParentElement(doc)
  if (pp) {
    const p = pp as JQuery
    let courseSlugFound = p.find("slug:first").text()
    console.log(`course slug found : ${courseSlugFound}`)
    course = {
      url: `https://www.linkedin.com/learning/${courseSlug}`,
      slug: courseSlug,
      exerciseFiles: [],
      sourceCodeRepository: null,
      description: null,
      urn: courseUrn,
    }
    course.title = p.find("title:first").text()
    course.visibility = p.find("visibility").text()

    let viewerCounts = p.find("viewerCounts")
    if (viewerCounts.length > 0) {
      course.viewerCounts = parseInt(viewerCounts.find("total").text())
    }

    course.description = p.find("description").text()
    course.descriptionV2 = p.find("descriptionV2 text").text()
    if (course.descriptionV2) {
      course.description = course.descriptionV2
    }
    let descriptionV3: any = p.find("descriptionV3 text")
    if (descriptionV3.length > 0) {
      // console.log(descriptionV3.html())
      // try{
      course.descriptionV3 = jQuery(descriptionV3[0].firstChild).text()
      // course.descriptionV3 = descriptionV3[0].firstChild.innerText

      // }catch(e){
      // console.error(e)
      // }
      if (course.descriptionV3) {
        course.description = course.descriptionV3
      }
    }
    let duration = p.find("duration")
    if (duration.length > 0) {
      course.duration = parseInt(p.find("duration").text())
    }

    // if(course.description){
    //     course.description = course.description.replace(/com.linkedin.learning.api.common.AttributedText/,'')
    // }
    let dificulty = p.find("dificulty")
    if (dificulty.length > 0) {
      course.dificulty = dificulty.find("difficultylevel").text()
    }

    let sourceCodeRepo = p.find("sourceCodeRepository")
    if (sourceCodeRepo.length > 0) {
      // course.sourceCodeRepository =
      const repoUrl = sourceCodeRepo.text()
      if (isValidUrl(repoUrl)) {
        course.sourceCodeRepository = repoUrl
      }
      // console.log(sourceCodeRepo.html())
    }

    let tags = ["sizeInBytes", "name", "url"]
    let exerciseFilesNds = p.find("exerciseFiles")
    let exerciseFiles = []

    if (exerciseFilesNds.length > 0) {
      for (const exerciseFileElem of exerciseFilesNds) {
        const exerciseFileElemNd = jQuery(exerciseFileElem)
        console.log(exerciseFileElemNd.html())
        const exerciseFileItem: any = {}
        for (let i in tags) {
          const tag = tags[i]
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

        exerciseFiles.push(exerciseFileItem)
      }
    }
    // return
    const { title, slug, sourceCodeRepository, description, urn } = course
    console.log(course)
    // exerciseFiles = course.exerciseFiles
    course = await mCourse.create(title, slug, course.duration, sourceCodeRepository, description, urn)
    course.exerciseFiles = []
    if (exerciseFiles.length > 0) {
      for (let exIdx in exerciseFiles) {
        try {
          const exItem = exerciseFiles[exIdx]
          if (exItem.name.length > 0) {
            // create(name,url,size,courseId)
            const { sizeInBytes, name, url } = exItem
            const savedExerciseFile = await mExerciseFile.create(name, url, sizeInBytes, course.id)
            course.exerciseFiles.push(savedExerciseFile)
          }
        } catch (e) {
          // console.error(e)
        }
      }
    }
    // Get course thumbnails
    let thumbRootUrl = p.find("primaryThumbnail rootUrl:first").text().trim()
    let thumbRootUrlV2 = p.find("primaryThumbnailV2 rootUrl:first").text().trim()
    if (thumbRootUrlV2.length > 0) {
      thumbRootUrl = thumbRootUrlV2
    }
    const thumbs = p.find("primaryThumbnail artifacts")
    const thumbV2s = p.find("primaryThumbnailV2 artifacts")
    console.log(thumbs, thumbRootUrl)
    console.log(thumbV2s, thumbRootUrlV2)
    const thumbnails = []
    if (thumbs.length > 0) {
      for (const artifactEl of thumbs) {
        const artifact = el2Obj(artifactEl)
        if (artifact) {
          const thumbUrl = getThumbUrlFromArtifact(artifact, thumbRootUrl)
          // console.log(thumbUrl)
          const size = `${artifact.width}x${artifact.height}`
          const expiresAt = parseInt(artifact.expiresat)
          const thumbnail = await mThumbnail.create(course.id, size, thumbUrl, expiresAt)
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
          const thumbnail = await mThumbnail.create(course.id, size, thumbUrl, expiresAt)
          thumbnails.push(thumbnail)
        }
      }
    }
    course.thumbnails = thumbnails
    return course
  }
  return null
}
