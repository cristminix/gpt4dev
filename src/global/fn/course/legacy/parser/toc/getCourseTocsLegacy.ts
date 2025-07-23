import type { TM3Rec, ThumbnailInterface, TocInterface } from "@/global/classes/types"
import { getCourseTocMarkup } from "./getCourseTocMarkup"
import { getTocDuration } from "./getTocDuration"
import { getTocThumbnails } from "./getTocThumbnails"
import { getTocVStatusUrn } from "./getTocVStatusUrn"

export function getCourseTocsLegacy(ds: TM3Rec, itemStars: string[]) {
  const tocs: TocInterface[] = []
  if (ds) {
    for (const itemStar of itemStars) {
      const tocsMarkup = getCourseTocMarkup(ds, itemStar)
      if (tocsMarkup) {
        let { visibility, title, duration, slug } = tocsMarkup
        const toc: TocInterface = {
          title,
          slug,
          duration: getTocDuration(duration),
          itemStar,
          visibility,
          thumbnails: getTocThumbnails(tocsMarkup),
          vStatusUrn: getTocVStatusUrn(tocsMarkup),
          streamLocations: [],
          transcripts:[],
          url:''
        }
        tocs.push(toc)
      }
      //   console.log({ tocs })
    }
  }
  return tocs
}
