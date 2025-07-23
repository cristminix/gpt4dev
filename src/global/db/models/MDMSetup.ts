import { DMSetupSchema } from "./schema"
import DrizzleDB from "./DrizzleDB"

class MDMSetup extends DrizzleDB {
  schema = DMSetupSchema
}

export default MDMSetup
