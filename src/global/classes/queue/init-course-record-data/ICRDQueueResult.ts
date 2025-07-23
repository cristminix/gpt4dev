export class ICRDQueueResult {
  static INIT = 0
  static FAILED = 1
  static FAILED_MEDIA = 2
  static FAILED_TRANS = 3
  static SUCCESS_MEDIA = 4
  static SUCCESS_TRANS = 5
  static SUCCESS = 6

  static toStr(result: number) {
    const strs = ["INIT", "FAILED", "FAILED_MEDIA", "FAILED_TRANS", "SUCCESS_MEDIA", "SUCCESS_TRANS", "SUCCESS"]
    if (typeof strs[result] != "undefined") {
      return strs[result]
    }
    return `${result} : Unknown`
  }
}
