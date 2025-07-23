export function getTocDuration(duration: any) {
  try {
    return parseInt(duration.duration)
  } catch (error) {}
  return 0
}
