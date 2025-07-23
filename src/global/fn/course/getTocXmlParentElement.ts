import $ from "jquery"
export const getTocXmlParentElement = (itemStar: string, doc: JQuery) => {
  if (!doc) {
    return null
  }
  let tocNd = doc.find(`cachingKey:contains('${itemStar}')`)
  let entityUrn = null
  let entityNdP = null
  if (tocNd.length > 1) {
    for (const tocNdElem of tocNd) {
      const $tocNdElem = $(tocNdElem)
      // const entityUrnNd = $tocNdElem.find("entityUrn")
      // if(entityUrnNd.length>0){
      //     entityUrn = entityUrnNd.text().trim()
      //     entityNdP = $tocNdElem.closest("included")
      //     break
      // }
      let tocNdP = $tocNdElem.parent()
      const urn = $tocNdElem.text().trim()
      if (urn === itemStar) {
        // console.log(tocNdP.html())

        let type: any = tocNdP.find(">type")
        if (type.length > 0) {
          type = type.text().trim()
          if (type === "com.linkedin.learning.api.deco.content.Video") {
            tocNd = $tocNdElem.closest("included")
            return tocNd
            // break
          }
        }
      }
    }
  }
  console.log(tocNd.html())
  if (tocNd.length > 0) {
    let tocNdP = tocNd.parent()
    let videoUrnNd = tocNdP.find("content")
    if (videoUrnNd.length > 0) {
      videoUrnNd = videoUrnNd.find("video")
      if (videoUrnNd.length > 0) {
        const videoUrn = videoUrnNd.text().trim()
        let entityUrnNds = doc.find(`entityUrn:contains('${videoUrn}')`)
        if (entityUrnNds.length > 0) {
          for (const entityUrnNd of entityUrnNds) {
            const $entityUrnNd = $(entityUrnNd)
            const text = $entityUrnNd.text().trim()
            // console.log(text)
            if (text == videoUrn) {
              entityNdP = $entityUrnNd.closest("included")
            }
          }
        }
      } else {
        console.error(`could_not_find_video_urn: ${itemStar}`)
      }
    } else {
      console.error(`could_not_find_video_entity_urn : ${itemStar}`)
    }
  } else {
    console.error(`could_not_find_toc_nd : ${itemStar}`)
  }
  return entityNdP
}
