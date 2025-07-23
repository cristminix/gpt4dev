import type { TM3Rec } from "@/global/classes/types"
import { getDsRecordsByType } from "../../getDsRecordsByType"

export function getCourseTocMarkup(ds: TM3Rec, urn: string) {
  const rows = getDsRecordsByType("com.linkedin.learning.api.deco.content.Video", ds)
  const markup = rows.find((row) => row?.entityUrn === urn)
  if (markup) {
    return markup
  }
  return null
}
