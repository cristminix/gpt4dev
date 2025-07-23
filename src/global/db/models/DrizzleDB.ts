import DrizzleModelRw from "@/global/classes/DrizzleModelRw"
import { getTableName, sql } from "drizzle-orm"

class DrizzleDB extends DrizzleModelRw {
  path = "llfetcher.db"
  dir = "/db"

  async getTableSize(tableName: string) {
    let counts = 0
    let size = 0

    if (this.db) {
      let { rowCount } = this.db.get(sql`select count(*) as rowCount from ${this.schema}`) as any
      const allFields = Object.keys(this.schema)
      const sqlStr = `LENGTH(${allFields.join(") + LENGTH(")})`

      if (this.sqldb) {
        const db = this.sqldb.getSqlDB()
        const sql = `SELECT ${sqlStr} AS row_size FROM ${tableName} LIMIT 10`
        // console.log({sql})
        const result = db.exec(sql)
        if (rowCount) counts = rowCount
        if (rowCount && result.length > 0) {
          let totalRowSize = result[0].values.reduce((sum: number, row: any) => sum + row[0], 0)
          let avgRowSize = totalRowSize / result[0].values.length
          let estimatedTableSize = rowCount * avgRowSize
          size = estimatedTableSize && !isNaN(estimatedTableSize) ? estimatedTableSize : 0
        }
      }
    }
    return { counts, size }
  }
  async getDataSize() {
    const table = getTableName(this.schema)

    return await this.getTableSize(table)
  }
}

export default DrizzleDB
