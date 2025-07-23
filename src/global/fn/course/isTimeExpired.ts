export function isTimeExpired(tmStamp: number, useMiliseconds = true) {
  if (!useMiliseconds) {
    return tmStamp <= new Date().getTime()
  }
  let expDt = new Date(tmStamp * 1000) // Convert seconds to milliseconds
  let currStamp = Date.now() / 1000 // Convert milliseconds to seconds
  let currDt = new Date(currStamp * 1000)

  return expDt <= currDt
}
