export function getCourseDuration(markup: any) {
  let duration = 0
  if (markup.duration) {
    if (typeof markup.duration.duration === "number") return markup.duration.duration
    try {
      return parseInt(markup.duration.duration)
    } catch (error) {}
  }
  return duration
}
