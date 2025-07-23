export const slugToTitle = (slug: string) => {
  var words = slug.split("-")
  var titleCaseWords = words.map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
  })

  return titleCaseWords.join(" ")
}
