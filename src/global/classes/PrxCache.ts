import {WebCache} from "./WebCache";


class PrxCache {
  //   table = "PrxCache"
  static instance: PrxCache | null = null
  static getInstance() {
    if (!PrxCache.instance) {
      PrxCache.instance = new PrxCache()
    }
    return PrxCache.instance
  }
  async clearAll() {
    console.log(`PrxCache.clearAll():method not implemented`)
  }
  async get(url: string) {
    const webCache = new WebCache(url)
    // if (noCache) {
    //   await webCache.delete()
    //   console.log(`PrxCache.get(${url},noCache=${noCache ? "1" : "0"})`)
    // } else {
      await webCache.load()
    // }
    return webCache
  }
  async getByKey(key: string) {
    return await WebCache.fromKey(key)
  }
  async set(url: string, content: string, statusCode: number) {
    const webCache = new WebCache(url)
    webCache.setContent(content)
    webCache.setStatusCode(statusCode)
    await webCache.save()
    return webCache
  }

  async unset(url: string) {
    const webCache = await this.get(url)
    if (!webCache.isEmpty()) {
      await webCache.remove()
    }
  }
  async unsetByKey(key: string) {
    const webCache = await this.getByKey(key)
    if (webCache) {
      if (!webCache.isEmpty()) {
        await webCache.remove()
      }
    }
  }
  async getCounts() {
    console.log(`PrxCache.getCounts():method not implemented`)
    return 0
  }
  async getSize() {
    console.log(`PrxCache.getSize():method not implemented`)

    return 0
  }
}
export default PrxCache
