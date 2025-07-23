import type MThumbnail from "@/global/db/models/MThumbnail"
import type { TThumbnail, TThumbnailU } from "@/global/db/models/schema"

export async function updateThumbnail(
  mThumbnail: MThumbnail,
  pk: number,
  row: TThumbnailU
) {
  return (await mThumbnail.update(pk, row, true)) as TThumbnail
}
