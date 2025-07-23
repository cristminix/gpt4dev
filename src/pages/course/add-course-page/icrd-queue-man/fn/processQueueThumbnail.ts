import type { ThumbnailInterface } from "@/global/classes/types"
import type MThumbnail from "@/global/db/models/MThumbnail"
import type { TThumbnail } from "@/global/db/models/schema"

import {
  checkThumbnailExists,
  insertThumbnail,
  updateThumbnail,
} from "../tasks/thumbnail"
import { crc32Id } from "@/global/fn/crc32Id"
import Fs from "@/global/classes/Fs"
const fs = new Fs("fs")
const ENABLE_DEBUG = true
export type TProcessQueueThumbnailResult = {
  thumbnails: TThumbnail[]
}
function createBlobeFilename(url: string, blob: Blob) {
  return `${crc32Id(url)}.${blob.type.split("/")[1]}`
}
async function downloadThumbnail(url: string, dst: string) {
  let path: string | null = null
  try {
    if (fs) {
      if (!(await fs.existsSync(dst))) {
        if (ENABLE_DEBUG) console.log(`mkdir:${dst}`)
        await fs.mkdirSync(dst)
      }
      const res = await fetch(url)
      if(res.status === 200) {
        const blob = await res.blob()
        if (blob) {
          const filename = createBlobeFilename(url, blob)
          // blob.name = filename
          // blob.lastModified = new Date()
          const file = new File([blob], "image.jpeg", {
            type: blob.type,
          })
          const buffer = await file.arrayBuffer()
          path = `${dst}/${filename}`
          await fs.writeFileSync(path, new Uint8Array(buffer))
          if (ENABLE_DEBUG) console.log(`downloaded thumbnail: ${path}`)
          // console.log("Blob:", blob)
        }
      }

    }
  } catch (error) {
    console.error("Error downloading thumbnail:", error)
  }
  return path
}
export async function processQueueThumbnail(
  mThumbnail: MThumbnail,
  thumbnails: ThumbnailInterface[],
  courseId: number
) {
  const results: TProcessQueueThumbnailResult = {
    thumbnails: [],
  }
  for (const thumbnail of thumbnails) {
    const { size, url, expiresAt } = thumbnail
    const thumbId = await checkThumbnailExists(mThumbnail, courseId, size)
    const path = await downloadThumbnail(url, "/thumbnails")
    const row = {
      url,
      path,
      size,
      expiresAt: expiresAt.toString(),
      parentId: courseId,
      kind: "course",
    }
    let thumbnailRec: TThumbnail
    if (thumbId) {
      thumbnailRec = await updateThumbnail(mThumbnail, thumbId, row)
    } else {
      thumbnailRec = await insertThumbnail(mThumbnail, row)
    }
    results.thumbnails.push(thumbnailRec)
  }
  return results
}
