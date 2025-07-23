import { QStateSchema } from "./schema"
import DrizzleDB from "./DrizzleDB"

class MQState extends DrizzleDB {
  schema = QStateSchema

  // async deleteByCourseId(courseId:number) {
  //   // await this.deleteRows({ courseId })
  // }
  getListWithCourse() {
    /*
    const mCourse = Course.gotInstance()
    let results = this.db.queryAll(this.table)
    results = results.map((item) => {
      try {
        item.course = mCourse.getById(item.courseId).title
      } catch (e) {}
      const state = QueueState.toStr(item.state)
      const mState = QueueState.toStr(item.mState)
      const tState = QueueState.toStr(item.tState)

      const result = QueueResult.toStr(item.result)
      const mResult = QueueResult.toStr(item.mResult)
      const tResult = QueueResult.toStr(item.tResult)
      item.state = `[${state},${mState},${tState}]`
      item.result = `[${result},${mResult},${tResult}]`

      const mLoaded = item.tLoaded
      const tLoaded = item.tLoaded
      const mSize = item.mSize
      const tSize = item.tSize

      item.size = `[${mLoaded},${mSize},${tLoaded},${tSize}]`
      return item
    })
    return results
    */
  }
  getRowLast(courseId: number, tocId: number, idx: number) {
    // return this.singleQuery({ query: { courseId, tocId, idx } })
  }
  getByTocId(tocId: number) {
    // return this.singleQuery({ query: { tocId } })
  }
  getListByCourseId(courseId: number) {
    // return this.query({ query: { courseId } })
  }
  getById(id: number) {
    // return this.singleQuery({ query: { id } })
  }
  async deleteByCourseId(courseId: number) {
    // await this.deleteRows({ courseId })
  }

  async createLegacy(courseId: number, tocId: number, idx: number, state: number | null, result: number = 0) {
    /*
    let row = this.getRow(courseId, tocId, idx)
    if (!row) {
      const tState = 0
      const mState = 0
      const mResult = 0
      const tResult = 0
      const mLoaded = 0
      const mSize = 0
      const tLoaded = 0
      const tSize = 0

      row = {
        courseId,
        tocId,
        idx,
        state,
        result,
        mState,
        mResult,
        tState,
        tResult,
        mLoaded,
        mSize,
        tLoaded,
        tSize,
      }

      row.id = this.db.insert(this.table, row)
      await this.db.commit()
    } else {
      console.error(`${this.constructor.name}.create() rowExist`)
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
  async updateRow(courseId: number, tocId: number, idx: number, row: any) {
    /*
    let record = this.getRow(courseId, tocId, idx)
    if (record) {
      record = await this.update(record.id, row)
    }
    return record*/
  }
  async updateState(id: number, state: number | null) {
    /*
    let record = this.getById(id)
    if (record) {
      record = await this.update(id, { state })
    }
    return record
    */
  }
  async updateTState(id: number, tState: number | null) {
    /*
    let record = this.getById(id)
    if (record) {
      record = await this.update(id, { tState })
    }
    return record
    */
  }
  async updateMState(id: number, mState: number | null) {
    /*
    let record = this.getById(id)
    if (record) {
      record = await this.update(id, { mState })
    }
    return record
    */
  }
  async updateResult(id: number, result: number | null) {
    /*
    let record = this.getById(id)
    if (record) {
      record = await this.update(id, { result })
    }
    return record
    */
  }
  async updateMResult(id: number, mResult: number | null) {
    /*
    let record = this.getById(id)
    if (record) {
      record = await this.update(id, { mResult })
    }
    return record
    */
  }
  async updateTResult(id: number, tResult: number | null) {
    /*
    let record = this.getById(id)
    if (record) {
      record = await this.update(id, { tResult })
    }
    return record
    */
  }
  async updateMLoaded(id: number, mLoaded: number | null) {
    /*
    let record = this.getById(id)
    if (record) {
      record = await this.update(id, { mLoaded })
    }
    return record
    */
  }
  async updateMSize(id: number, mSize: number | null, mLoaded: number | null = null) {
    /*
    let record = this.getById(id)
    if (record) {
      if (!mLoaded) {
        mLoaded = record.mLoaded
      }
      record = await this.update(id, { mSize, mLoaded })
    }
    return record
    */
  }
  async updateTLoaded(id: string, tLoaded: number | null) {
    /*
    let record = this.getById(id)
    if (record) {
      record = await this.update(id, { tLoaded })
    }
    return record
    */
  }
  async updateTSize(id: number, tSize: number | null, tLoaded: number | null = null) {
    /*
    let record = this.getById(id)
    if (record) {
      if (!tLoaded) {
        tLoaded = record.tLoaded
      }
      record = await this.update(id, { tSize, tLoaded })
    }
    return record
    */
  }
  isFinished(tocId: number) {
    /*
    const record = this.getByTocId(tocId)
    if (!record) {
      return false
    }

    return record.result === QueueResult.SUCCESS
    */
  }

  getResult(tocId: number) {
    /*
    const record = this.getByTocId(tocId)
    if (!record) {
      return null
    }

    return record.result
    */
  }
  getTResult(tocId: number) {
    /*
    const record = this.getByTocId(tocId)
    if (!record) {
      return null
    }

    return record.tResult
    */
  }
  getMResult(tocId: number) {
    /*
    const record = this.getByTocId(tocId)
    if (!record) {
      return null
    }

    return record.mResult
    */
  }
}

export default MQState
