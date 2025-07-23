import type { AuthorInterface } from "@/global/classes/types"
import { slugToTitle } from "../../../slugToTitle"
import { getDsRecordsByType } from "../../getDsRecordsByType"

export function getCourseAuthorsLegacy(ds: any,courseSlug: string): AuthorInterface[] {
    const rows = getDsRecordsByType("com.linkedin.learning.api.deco.content.Course", ds)
  console.info({rows})
  const results = getDsRecordsByType("com.linkedin.learning.api.deco.content.Author", ds)
  if (!results) return []
  return results.map((item) => {
    // console.log({ item })
    const { slug, entityUrn, biography, shortBiography, biographyV3, biographyV2, shortBiographyV2, shortBiographyV3 } = item
    return {
      name: slugToTitle(slug),
      slug,
      urn: entityUrn,
      biography: biographyV3?.text || biographyV2?.text || biography?.text || null,
      shortBiography: shortBiographyV3?.text || shortBiographyV2?.text || shortBiography?.text || null,
    } as AuthorInterface
  })
}
