export const isValidUrl = (url: string) => {
  var urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/
  return urlRegex.test(url)
}
