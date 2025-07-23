import { TocSectionSchema } from "./schema"
import DrizzleDB from "./DrizzleDB"

class MTocSection extends DrizzleDB {
  schema = TocSectionSchema
}

export default MTocSection
