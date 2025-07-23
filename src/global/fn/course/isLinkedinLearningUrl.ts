export const isLinkedinLearningUrl = (url: string) => {
  let pattern = /^https:\/\/www\.linkedin\.com\/learning\//
  return pattern.test(url)
}
