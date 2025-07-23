import { cleanHtmlMarkup } from "@/global/fn/cleanHtmlMarkup"

export function getCourseDescription(markup: any) {
  if (!markup) return ""
  let description = ""
  if (markup.descriptionV3) {
    description = markup.descriptionV3.text
  }
  if (markup.descriptionV2) {
    description = markup.descriptionV2.text
  }
  if (markup.description) {
    description = markup.description.text
  }
  return cleanHtmlMarkup(description)
}
