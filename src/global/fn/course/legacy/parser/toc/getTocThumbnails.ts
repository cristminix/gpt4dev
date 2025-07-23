import type { ThumbnailInterface } from "@/global/classes/types"
import { getThumbnails } from "../getThumbnails"

export function getTocThumbnails(markup: any) {
  const thumbnails: ThumbnailInterface[] = getThumbnails(markup)
  return thumbnails
}
