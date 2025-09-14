import { CHAT_BACKEND_BASE_URL } from "@/global/store/config"
import { Client } from "../Client"

class Dummy extends Client {
  constructor(options: any = {}) {
    super({
      baseUrl: `${CHAT_BACKEND_BASE_URL}/v1`,
      defaultModel: "dummy",
      ...options,
    })
  }
}

export { Dummy as DeepInfra }
export default Dummy
