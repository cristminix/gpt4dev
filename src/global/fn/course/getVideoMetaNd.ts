import jQuery from "jquery"

export const getVideoMetaNd = (vStatusUrn: string, doc: JQuery) => {
  // benchmark('getVideoMetaNd', 'start')
  let $vMetaDataNd = null
  let vStatusLookups = doc.find(`star_lyndaVideoViewingStatus:contains('${vStatusUrn}')`)
  // const status429 = doc.find(`status:contains('429')`)
  const statusEls = doc.find("status")
  const statuses = []

  for (const statusEl of statusEls) {
    statuses.push(parseInt(jQuery(statusEl).text()))
  }

  if (vStatusLookups.length == 0) {
    console.error("A")
    console.error(`could_not_find_v_status_lookup : ${vStatusUrn}`)
    vStatusUrn = vStatusUrn.replace("urn:li:lyndaVideoViewingStatus:", "")
    vStatusLookups = doc.find(`trackingUrn:contains('${vStatusUrn}')`)
  }

  if (vStatusLookups.length == 0) {
    console.error("B")
    console.error(`could_not_find_v_status_lookup : ${vStatusUrn}`)
    vStatusLookups = doc.find(`star_interactionstatusv2:contains('${vStatusUrn}')`)
  }

  // let streamLocations = null
  // let transcripts = null
  // let vStatusLookup = null
  let pos = -1

  if (vStatusLookups.length > 0) {
    let breakTheLoop = false

    for (const vStatusLookupEl of vStatusLookups) {
      const $elNd = jQuery(vStatusLookupEl).parent()
      $vMetaDataNd = $elNd.find("presentation")

      if ($vMetaDataNd.length == 0) {
        $vMetaDataNd = $elNd.find("presentationDerived")
      }

      pos = 0

      if ($vMetaDataNd.length > 0) {
        pos += 1
        $vMetaDataNd = $vMetaDataNd.find("videoPlay")

        if ($vMetaDataNd.length > 0) {
          pos += 1
          $vMetaDataNd = $vMetaDataNd.find("videoPlayMetadata")
          breakTheLoop = true
          statuses.push(200)
        }
      }

      if (breakTheLoop) {
        break
      }
    }
  }

  if (!$vMetaDataNd) {
    console.error(`could_not_find_v_meta_data_nd_pos : ${pos}`)
    console.log("Try another method")
  }

  // const b = benchmark('getVideoMetaNd', 'end')
  // console.log(`getVideoMetaNd time elapsed:${b['elapsed_time']}\n`)
  return [$vMetaDataNd, statuses]
}
