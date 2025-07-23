import type MThumbnail from "@/global/db/models/MThumbnail"
import type { TThumbnail, TThumbnailN } from "@/global/db/models/schema"

export async function createThumbnail(thumbnailRow: TThumbnailN, mThumbnail: MThumbnail, commit = true) {
  let thumbnailRec: TThumbnail | null = null
  const { size, parentId, kind } = thumbnailRow
  if (!(await mThumbnail.exists(size, parentId, kind))) {
    thumbnailRec = await mThumbnail.create(thumbnailRow)
  } else {
    const existing = await mThumbnail.getBySize(size, parentId, kind)
    mThumbnail.update(existing.id, thumbnailRow)
  }
  if (commit) await mThumbnail.commit()
  return thumbnailRec
}
