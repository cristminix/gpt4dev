export function getCourseTitle(markup: any) {
  if (!markup) return ""
  return markup.title ?? ""
}
