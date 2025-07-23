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
import { getCourseAuthors } from "./course/getCourseAuthors"
import { getCourseSections } from "./section/getCourseSections"
import { getCourseThumbnails } from "./course/getCourseThumbnails"
import { getCourseTimestamp } from "./course/getCourseTimestamp"
import {courseUrlFromSlug} from "@/global/fn/course/courseUrlFromSlug";

function getCourseMarkup(ds: any, slug: string) {
  const rows = getDsRecordsByType("com.linkedin.learning.api.deco.content.Course", ds)
  let markup: any

  const filteredRow = rows.find((row) => row?.slug === slug)
  if (filteredRow) {
    markup = filteredRow
  }
  return markup
}
export function getCourseInfo(ds: TM3Rec, slug: string): CourseInfoInterface | null {
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
    const authors = getCourseAuthors(ds)
    const sections = getCourseSections(ds, entityUrn)
    const thumbnails = getCourseThumbnails(markup)
    const timestamp = getCourseTimestamp(markup)
    // console.log({ authors, exerciseFiles, sections })
    courseInfo = {
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
      url:courseUrlFromSlug(slug)
    }
  }
  return courseInfo
}
