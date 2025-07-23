export const removeQueryString = (url: string) => {
  // Use URL constructor to parse the URL
  var urlObject = new URL(url)

  // Set the search property of the URL object to an empty string
  urlObject.search = ""

  // Convert the URL object back to a string and return it
  return urlObject.toString()
}
