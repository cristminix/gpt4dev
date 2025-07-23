import $ from "jquery"
export const getStreamLocations = async (vMetaDataNd: any, toc: any, mStreamLocation: any) => {
  let streamLocations = mStreamLocation.getListByTocId(toc.id)

  if (streamLocations.length > 0) {
    console.log("stream_locations_get_from_m_stream_location")
    return streamLocations
  }

  let pgStreamNds: any = []
  if (vMetaDataNd) {
    pgStreamNds = vMetaDataNd.find("progressiveStreams")
  }

  // let streamLocations = null
  const tags = ["size", "bitRate", "width", "height"]

  if (pgStreamNds.length > 0) {
    for (const pgStreamElem of pgStreamNds) {
      const pgStreamEl = $(pgStreamElem)
      let fmt: any = pgStreamEl.find("height")

      if (fmt.length > 0) {
        fmt = fmt.text().trim()

        if (fmt === "0") {
          fmt = "audio"
        }

        if (!streamLocations) {
          streamLocations = {}
        }

        streamLocations[fmt] = {}
        const streamLoc = pgStreamEl.find("streamingLocations")

        if (streamLoc.length > 0) {
          const url = streamLoc.find("url")

          if (url.length > 0) {
            streamLocations[fmt].url = url.text().trim()
          }

          const expiresAt = streamLoc.find("expiresAt")

          if (expiresAt.length > 0) {
            streamLocations[fmt].expiresAt = parseInt(expiresAt.text().trim()) / 1000
          }

          for (const tag of tags) {
            const tagNd = streamLoc.find(tag)

            if (tagNd.length > 0) {
              streamLocations[fmt][tag] = parseInt(tagNd.text().trim())
            }
          }

          const sLoc = {
            fmt,
            url: streamLocations[fmt].url,
            expiresAt: streamLocations[fmt].expiresAt,
          }
          const row = await mStreamLocation.create(fmt, sLoc.url, toc.id, sLoc.expiresAt)
          streamLocations[fmt] = row
        }
      }
    }
  }

  return streamLocations
}
