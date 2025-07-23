import DrizzleDB from "./DrizzleDB"
import { AppSchema } from "./schema"

class MApp extends DrizzleDB {
  schema = AppSchema
}

export default MApp
