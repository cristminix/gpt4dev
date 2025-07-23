import { getDsRecordsByType } from "../../getDsRecordsByType"

export function getCourseMarkup(slug: string, ds: any) {
  const rows = getDsRecordsByType("com.linkedin.learning.api.deco.content.Course", ds)
  if (rows.length > 0) {
    const filteredRows = rows.filter((row) => {
      if (row) {
        if (row.slug) {
          return row.slug == slug
        }
      }
    })
    if (filteredRows.length > 0) {
      return filteredRows.pop()
    }
  }
  return null
}
