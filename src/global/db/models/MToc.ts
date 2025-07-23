import {TocSchema, type TToc} from "./schema"
// import DrizzleModelRw from "@/global/classes/DrizzleModelRw"
import DrizzleDB from "./DrizzleDB"
import { and, eq } from "drizzle-orm"

class MToc extends DrizzleDB {
  schema = TocSchema
  async exists(slug: string, sectionId: number,returnId = false) {
    if(returnId){
        const toc:TToc|null = await this.getRow({ slug, sectionId })
        if(toc){
            return toc.id
        }
        return 0
    }
    return (await this.count({ slug, sectionId })) > 0
  }
  async getListBySectionId(sectionId: number) {
    return await this.db.select().from(this.schema).where(eq(this.schema.sectionId, sectionId))
  }
  async getBySlug(slug: string, sectionId: number) {
    return await this.getRow({ slug, sectionId })
  }
  get(id: string) {
    // return this.singleQuery({ query: { id } })
  }
  getByItemStar(itemStar: string) {
    // return this.singleQuery({ query: { itemStar } })
  }
  async updateLegacy(id: number, tocUrl: string, captionUrl: string, captionFmt: string, streamlocIds: number[]) {
    /*
    const toc = this.get(id)
    if (toc) {
      this.db.update(this.table, { id }, (row) => {
        row.captionUrl = captionUrl
        row.captionFmt = captionFmt
        row.streamLocationIds = streamlocIds
        row.url = tocUrl
        return row
      })
      toc.streamLocationIds = streamlocIds
      await this.db.commit()
    } else {
      console.warn(`${this.constructor.name}.update() row is not exists`)
    }
    return toc
    */
  }

  async createLegacy(title: string, slug: string, url: string, duration: number, captionUrl: string, captionFmt: string, sectionId: number, itemStar: string, vStatusUrn: string) {
    /*
    let toc = this.getBySlug(slug, sectionId)

    if (!toc) {
      const id = 0
      const streamLocationIds = []
      toc = { id, sectionId, title, slug, url, duration, captionUrl, captionFmt, streamLocationIds, itemStar, vStatusUrn }
      toc.id = this.db.insert("toc", toc)
      await this.db.commit()
    } else {
      console.error(`${this.constructor.name}.create() toc row exists`)
    }

    return toc
  */
  }
}

export default MToc
