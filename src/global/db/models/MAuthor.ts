import { AuthorSchema, type TAuthor } from "./schema"
import DrizzleDB from "./DrizzleDB"
import { eq, or } from "drizzle-orm"

class MAuthor extends DrizzleDB {
  schema = AuthorSchema

  async exists(slug: string, returnId = false) {
    if (returnId) {
      const author: TAuthor | null = await this.getRow({ slug })
      if (author) {
        return author.id
      } else {
        return 0
      }
    }
    return (await this.count({ slug })) > 0
  }
  async getBySlug(slug: string) {
    return await this.getRow({ slug })
  }
  async getListByAuthorIds(authorIds: number[]) {
    let conditions = authorIds.map((authorId) => {
      return eq(this.schema.id, authorId)
    })
    return (await this.db
      .select()
      .from(this.schema)
      .where(or(...conditions))) as TAuthor[]
  }
}

export default MAuthor
