import { DMStatusSchema } from "./schema"
import DrizzleDB from "./DrizzleDB"

class MDMStatus extends DrizzleDB {
  schema = DMStatusSchema
}

export default MDMStatus
