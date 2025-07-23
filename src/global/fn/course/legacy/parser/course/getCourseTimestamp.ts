export function getCourseTimestamp(markup: any) {
  let timestamp: any = null
  if (!markup) {
    return null
  }
  if (markup.activatedAt) {
    if (typeof markup.activatedAt === "number") {
      timestamp = markup.activatedAt
    }
    try {
      const result = parseInt(markup.activatedAt)
      if (result > 0) {
        timestamp = result
      }
    } catch (error) {}
  }
  if (timestamp) {
    const timestampDate = new Date(timestamp)
    const timestampDateString = timestampDate.toISOString().replace("T", " ").replace("Z", "")
    return timestampDateString
  }
  return null
}
