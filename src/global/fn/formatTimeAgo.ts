import moment from "moment"
/**
 * Returns a friendly, relative-time string like
 *   ・1 minute ago
 *   ・2 hours ago
 *   ・Yesterday
 *   ・Last week
 *   ・1 month ago
 *
 * Uses moment.js under the hood.
 *
 * @param  {Date|String|moment} input – any date/ISO-string you have
 * @return {String} – “x time ago” description
 */
export function formatTimeAgo(input: any) {
  //   console.log(typeof input, input)
  const inputDate = new Date(input)
  const m = moment(input)
  const fm = moment.utc(input).format("D/M/YYYY HH:mm")
  console.log({ input, fm })
  // Basic sanity check
  if (!m.isValid()) return "Invalid date"

  const now = moment()
  const diffMs = now.diff(m) // milliseconds ago
  const diffDays = Math.round(diffMs / 86400000)

  // Special labels for yesterday & last week
  if (diffDays === 1 && diffMs < 86400000 * 2) return "Yesterday"
  if (diffDays === 7) return "Last week"

  // Otherwise fall back to moment’s “fromNow”
  return m.fromNow()
}
