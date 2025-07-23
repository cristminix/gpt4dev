export const sanitizeKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      return typeof item === "object" ? sanitizeKeys(item) : item
    })
  }

  let sanitizedObj: any = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      let sanitizedKey = key.replace(/^\$/, "")
      sanitizedKey = sanitizedKey.replace(/^\@/, "")
      sanitizedKey = sanitizedKey.replace(/^\#/, "")
      sanitizedKey = sanitizedKey.replace(/^\*/, "star_")
      sanitizedKey = /^\d/.test(sanitizedKey) ? `child_element_${sanitizedKey}` : sanitizedKey
      if (typeof obj[key] === "object") {
        sanitizedObj[sanitizedKey] = sanitizeKeys(obj[key])
      } else {
        sanitizedObj[sanitizedKey] = obj[key]
      }
    }
  }
  return sanitizedObj
}
