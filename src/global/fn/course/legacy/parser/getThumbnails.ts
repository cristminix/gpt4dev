import { findPropLegacy } from "@/content-scripts/inject/fn/legacy/findProp"

export function getThumbnails(markup: any) {
  let thumbnails: any[] = []

  if (markup.primaryThumbnail) {
    const rootUrl = findPropLegacy("rootUrl", markup.primaryThumbnail, true)
    const artifacts = findPropLegacy("artifacts", markup.primaryThumbnail, true)
    if (Array.isArray(artifacts)) {
      for (const artifact of artifacts) {
        const size = `${artifact.width}x${artifact.height}`
        const url = `${rootUrl}${artifact.fileIdentifyingUrlPathSegment}`
        const { expiresAt } = artifact

        const thumbnail = { size, url, expiresAt }
        thumbnails.push(thumbnail)
      }
    }
  } else if (markup.primaryThumbnailV2) {
    const rootUrl = findPropLegacy("rootUrl", markup.primaryThumbnailV2, true)
    const artifacts = findPropLegacy("artifacts", markup.primaryThumbnailV2, true)

    if (Array.isArray(artifacts)) {
      for (const artifact of artifacts) {
        const size = `${artifact.width}x${artifact.height}`
        const url = `${rootUrl}${artifact.fileIdentifyingUrlPathSegment}`
        const { expiresAt } = artifact

        const thumbnail = { size, url, expiresAt }
        thumbnails.push(thumbnail)
      }
    }
  }
  return thumbnails
}
