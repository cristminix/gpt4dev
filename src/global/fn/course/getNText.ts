export const getNText = (p: any, queries: any) => {
  let nd = p
  let c = queries
  let text = ""
  if (Array.isArray(queries)) {
    let maxLen = c.length - 1
    let idx = 0
    let cEl = nd
    let breakTheLoop = false

    for (let ic of c) {
      let icEl = cEl.find(ic)
      if (icEl.length === 0 || breakTheLoop) {
        break
      }

      if (idx >= maxLen) {
        if (icEl.length > 0) {
          text = icEl.text()
        }
      } else {
        cEl = icEl
      }
      idx += 1
    }
  } else {
    let cNd = nd.find(c)
    if (cNd.length > 0) {
      text = cNd.text()
    }
  }

  return text
}
