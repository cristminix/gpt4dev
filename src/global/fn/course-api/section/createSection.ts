import type MSection from "@/global/db/models/MSection"
import type { TSection, TSectionN } from "@/global/db/models/schema"

export async function createSection(sectionRow: TSectionN, mSection: MSection, commit = true) {
  let sectionRec: TSection | null = null
  const { slug, courseId } = sectionRow
  if (!(await mSection.exists(slug, courseId))) {
    sectionRec = await mSection.create(sectionRow)
  } else {
    const existing = await mSection.getBySlug(slug, courseId)
    sectionRec = await mSection.update(existing.id, sectionRow)
  }
  if (commit) await mSection.commit()
  return sectionRec
}
