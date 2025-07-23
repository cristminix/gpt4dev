export function getCourseSlug(markup: any) {
  if (!markup) return ""
  return markup.slug ?? ""
}
