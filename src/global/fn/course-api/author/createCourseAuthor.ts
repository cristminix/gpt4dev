import type MAuthor from "@/global/db/models/MAuthor"
import type { TAuthor, TAuthorN } from "@/global/db/models/schema"

export async function createCourseAuthor(authorRow: TAuthorN, mAuthor: MAuthor) {
  let authorRec: TAuthor | null = null
  const { slug } = authorRow
  if (!(await mAuthor.exists(slug))) {
    authorRec = await mAuthor.create(authorRow)
  } else {
    const existing = await mAuthor.getBySlug(slug)
    authorRec = await mAuthor.update(existing.id, authorRow)
  }
  return authorRec
}
