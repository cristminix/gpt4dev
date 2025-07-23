import type MToc from "@/global/db/models/MToc"
import type { TTocN } from "@/global/db/models/schema"

export async function createToc(tocRow: TTocN, mToc: MToc, commit = true) {
  let course: TTocN | null
  const { sectionId, slug } = tocRow
  if (!(await mToc.exists(slug, sectionId))) {
    course = await mToc.create(tocRow)
  } else {
    const existing = await mToc.getBySlug(slug, sectionId)
    course = await mToc.update(existing.id, tocRow)
  }
  if (commit) await mToc.commit()
  return course
}
