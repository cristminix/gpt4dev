import { ICRDQueue } from "./ICRDQueue"
import { ICRDQueueItem } from "./ICRDQueueItem"
import { ICRDQueueState} from "./ICRDQueueState"


export class ICRDQueueData {
  course: any = null
  tocs: any = null
  tocArr: any[] = []
  sections: any = null
  vidx: any = {}
  pkIdxMaps: any = {}
  defaultQueue: ICRDQueue|null = null
  constructor(sections: any, tocs: any, course: any) {
    this.sections = sections
    this.tocs = tocs
    this.course = course
    this.defaultQueue = new ICRDQueue()
    this.buildQueue()
  }

  buildQueue() {
    if(!this.defaultQueue){
      throw new Error("defaultQueue is null")
    }
    let sidx = 0
    let midx = 0
    if (this.sections) {
      for (const section of this.sections) {
        let tidx = 0
        for (const toc of this.tocs[section.slug]) {
          const pk = toc.id
          this.tocArr.push(toc)
          const pkIdx = `pk-${pk}`
          const vidxKey = `v-${sidx}-${tidx}`
          this.pkIdxMaps[pkIdx] = midx
          this.vidx[vidxKey] = midx
          this.defaultQueue.enqueue(new ICRDQueueItem(midx, ICRDQueueState.INIT))
          tidx += 1
          midx += 1
        }
        sidx += 1
      }
    }
  }

  getByVidx(sidx: number, tidx: number) {
    const vidxKey = `v-${sidx}-${tidx}`
    const midx = this.vidx[vidxKey]
    return this.tocArr[midx]
  }
  getByPkIdx(pk: number) {
    const pkIdx = `pk-${pk}`
    const midx = this.pkIdxMaps[pkIdx]
    return this.tocArr[midx]
  }
  getByIdx(idx: number) {
    return this.tocArr[idx]
  }
  cloneQueue() {
    if(!this.defaultQueue){
      throw new Error("defaultQueue is null")
    }
    return ICRDQueue.clone(this.defaultQueue)
  }

  getTocArr() {
    return this.tocArr
  }
  pk2Idx(pk: number) {
    const pkIdx = `pk-${pk}`
    const midx = this.pkIdxMaps[pkIdx]
    return midx
  }
  getQueueItem(idx: number) {
    if(!this.defaultQueue){
      return null
    }
    return this.defaultQueue.items[idx]
  }
}
