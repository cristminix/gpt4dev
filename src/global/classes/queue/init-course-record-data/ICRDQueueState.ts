export class ICRDQueueState {
  static INIT = 0
  static FETCH_META = 1

  static FETCH_META_FAIL = 2
  static FETCH_META_RETRY = 3
  static FETCH_META_OK = 4

  static FETCH_MEDIA_SKIP = 5
  static FETCH_MEDIA = 6
  static FETCH_MEDIA_FAIL = 7
  static FETCH_MEDIA_RETRY = 8
  static FETCH_MEDIA_OK = 9

  static FETCH_TRANS_SKIP = 9
  static FETCH_TRANS = 10

  static FETCH_TRANS_FAIL = 11
  static FETCH_TRANS_RETRY = 12

  static FETCH_TRANS_OK = 13

  static FINISHED = 14
  static INTERUPTED = 15

  static toStr(state: number) {
    const strs = [
      "INIT",

      "FETCH_META",

      "FETCH_META_FAIL",
      "FETCH_META_RETRY",
      "FETCH_META_OK",

      "FETCH_MEDIA_SKIP",
      "FETCH_MEDIA",
      "FETCH_MEDIA_FAIL",
      "FETCH_MEDIA_RETRY",
      "FETCH_MEDIA_OK",

      "FETCH_TRANS_SKIP",
      "FETCH_TRANS",
      "FETCH_TRANS_FAIL",
      "FETCH_TRANS_RETRY",
      "FETCH_TRANS_OK",

      "FINISHED",
      "INTERUPTED",
    ]
    if (typeof strs[state] != "undefined") {
      return strs[state]
    }
    return `${state} : Unknown`
  }
}
