import { isTimeExpired } from "./isTimeExpired"

export const getThumbUrlFromArtifact = (artifact: any, rootUrl: any) => {
  // console.log(artifact)
  const expired = isTimeExpired(parseInt(artifact.expiresat))
  if (expired) {
    return null
  }
  return `${rootUrl}${artifact.fileidentifyingurlpathsegment}`
}
