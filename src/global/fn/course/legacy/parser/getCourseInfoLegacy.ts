import type { CourseInfoInterface, TM3Rec } from "@/global/classes/types"
import { getDsRecordsByType } from "../getDsRecordsByType"
import { getCourseTitle } from "./course/getCourseTItle"
import { getCourseDuration } from "./course/getCourseDuration"
import { getCourseSourceCodeRepository } from "./course/getCourseSourceCodeRepository"
import { getCourseUrn } from "./course/getCourseUrn"
import { getCourseGithubCodespace } from "./course/getCourseGithubCodespace"
import { getCourseExerciseFiles } from "./course/getCourseExerciseFiles"
import { getCourseSubtitle } from "./course/getCourseSubtitle"
import { getCourseDescription } from "./course/getCourseDescription"
import { getCourseAuthorsLegacy } from "./course/getCourseAuthorsLegacy"
import { getCourseSections } from "./section/getCourseSections"
import { getCourseThumbnails } from "./course/getCourseThumbnails"
import { getCourseTimestamp } from "./course/getCourseTimestamp"

function getCourseMarkup(ds: any, slug: string) {
  const rows = getDsRecordsByType("com.linkedin.learning.api.deco.content.Course", ds)
  let markup: any

  const filteredRow = rows.find((row) => row?.slug === slug)
  if (filteredRow) {
    markup = filteredRow
  }
  return markup
}
export function getCourseInfoLegacy(ds: TM3Rec, slug: string): CourseInfoInterface | null {
  const markup = getCourseMarkup(ds, slug)
  // console.log({ markup })
  let courseInfo: CourseInfoInterface | null = null

  if (markup) {
    const title = getCourseTitle(markup)
    const duration = getCourseDuration(markup)
    const sourceCodeRepository = getCourseSourceCodeRepository(markup)
    const subtitle = getCourseSubtitle(markup)
    const entityUrn = getCourseUrn(markup)
    const githubCodespace = getCourseGithubCodespace(markup)
    const exerciseFiles = getCourseExerciseFiles(markup)
    const description = getCourseDescription(markup)
    const authors = getCourseAuthorsLegacy(ds)
    const sections = getCourseSections(ds, entityUrn)
    const thumbnails = getCourseThumbnails(markup)
    const timestamp = getCourseTimestamp(markup)
    // console.log({ authors, exerciseFiles, sections })
    courseInfo = {
      url:`https://www.linkedin.com/learning/${slug}`,
      title,
      duration,
      sourceCodeRepository,
      subtitle,
      slug,
      urn: entityUrn,
      githubCodespace,
      exerciseFiles,
      description,
      authors,
      sections,
      thumbnails,
      timestamp,
    }
  }
  return courseInfo
}
