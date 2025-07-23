import { isLinkedinLearningUrl } from "./isLinkedinLearningUrl"
import { isValidUrl } from "./isValidUrl"

export const getCourseSlugFromUrl = (url: string) => {
  if (!isValidUrl(url)) {
    return [null, null]
  }
  if (!isLinkedinLearningUrl(url)) {
    return [null, null]
  }
  const slugs = url.replace("https://www.linkedin.com/learning/", "").split("/")
  const courseSlug = slugs[0]
  let tocSlug: string = ""
  if (slugs.length > 1) {
    tocSlug = slugs[1]
    return [courseSlug, tocSlug]
  }

  return [null, null]
}
