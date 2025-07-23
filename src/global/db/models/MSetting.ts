import { SettingSchema } from "./schema"
import DrizzleDB from "./DrizzleDB"
import { eq } from "drizzle-orm"

class MSetting extends DrizzleDB {
  // pk = "key"
  schema = SettingSchema

  async get(key: string) {
    const record = await this.getRow({ key })
    if (record) {
      console.log(`MSetting.get('${key}')`, { record })

      return record.value
    }
    return null
  }
  async set(key: string, value: any, kind: string = "string") {
    const record = await this.getRow({ key })
    let result: any = null
    if (record) {
      console.log(`MSetting.set update record`)
      if (this.db) result = await this.db.update(this.schema).set({ value }).where(eq(this.schema["key"], key))
    } else {
      console.log(`MSetting.set create new record`, { key, value, kind })

      result = await this.create({ key, value, kind })
    }
    await this.commit()
    return result
  }
}

export default MSetting
