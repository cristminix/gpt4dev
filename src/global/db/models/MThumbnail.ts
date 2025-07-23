import {
  ThumbnailSchema,
  type TThumbnail,
  type TThumbnailN,
  type TThumbnailU,
} from "./schema"
import DrizzleDB from "./DrizzleDB"
import { and, eq } from "drizzle-orm"

class MThumbnail extends DrizzleDB {
  schema = ThumbnailSchema
  async exists(size: string, parentId: number, kind: string, returnId = false) {
    if (returnId) {
      const thumbnail: TThumbnail | null = await this.getRow({
        size,
        parentId,
        kind,
      })
      if (thumbnail) {
        return thumbnail.id
      } else {
        return 0
      }
    }
    return (await this.count({ size, parentId, kind })) > 0
  }
  async getListByParent(parentId: number, kind: string) {
    return await this.db
      .select()
      .from(this.schema)
      .where(
        and(eq(this.schema.kind, kind), eq(this.schema.parentId, parentId))
      )
  }
  async getBySize(size: string, parentId: number, kind: string) {
    // console.log(`called`, { table: this.schema })
    return await this.getRow({ size, parentId, kind })
  }
  // async update(pk: number | string, row: TThumbnailU) {
  //   const condition = eq(this.schema.id, pk as number)
  //   const success = await this.db.update(this.schema).set(row).where(condition)
  //   const { size, parentId, kind } = row
  //   if (success) {
  //     return await this.getRow({ size, parentId, kind })
  //   }
  //   return null
  // }
  // async create(row: TThumbnailN, returnId = false) {
  //   const cursor = this.db.insert(this.schema).values(row)
  //   const { size, parentId, kind } = row
  //   if (returnId) {
  //     return await this.getRow({ size, parentId, kind })
  //   }
  //   return null
  // }
  async deleteByCourseId(courseId: number) {
    // await this.deleteRows({ courseId })
  }

  getListByCourseId(courseId: number) {
    // return this.query({ query: { courseId } })
  }
  getListByCourseIdAsObject(courseId: number) {
    /*
    const results = this.getListByCourseId(courseId)
    let thumbs = null
    if (results.length > 0) {
      thumbs = {}
      for (const row of results) {
        thumbs[row.size] = row
      }
    }
    return thumbs
    */
  }
  getBySizeAndCourseId(size: number, courseId: number) {
    // return this.singleQuery({ query: { courseId, size } })
  }
  getById(id: number) {
    // return this.singleQuery({ query: { id } })
  }
  async createLegacy(
    courseId: number,
    size: number,
    url: string,
    expiresAt: number | null
  ) {
    /*
    let row = this.getBySizeAndCourseId(size, courseId)
    if (!row) {
      const id = 0
      row = { courseId, size, url, expiresAt }
      row.id = this.db.insert(this.table, row)
      await this.db.commit()
    } else {
      await this.update(row.id, { size, url, expiresAt })
      // console.error(`${this.constructor.name}.create() toc row exists`)
    }

    return row
    */
  }
  async updateLegacy(id: number, row_: any) {
    /*
    let record = this.getById(id)
    if (record) {
      this.db.update(this.table, { id }, (row) => {
        for (let k in row_) {
          row[k] = row_[k]
          record[k] = row_[k]
        }
        return row
      })
      await this.db.commit()
    }

    return record
    */
  }
}

export default MThumbnail
