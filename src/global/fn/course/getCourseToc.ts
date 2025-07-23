import { getTocXmlParentElement } from "./getTocXmlParentElement"

export const getCourseToc = async (itemStar: string, doc: JQuery, mToc: any, mSection: any, section: any, courseSlug: string) => {
  let toc = mToc.getByItemStar(itemStar)
  if (toc) {
    return toc
  }
  let entityNdP = getTocXmlParentElement(itemStar, doc)
  if (!entityNdP) {
    return null
  }
  toc = {
    streamLocations: null,
    transcripts: null,
  }
  let tocSlugNd = entityNdP.find("slug")
  if (tocSlugNd.length > 0) {
    let tocSlug = tocSlugNd.text()
    toc.slug = tocSlug
    toc.url = `https://www.linkedin.com/learning/${courseSlug}/${tocSlug}`
  }

  toc.title = entityNdP.find("title").text()

  toc.visibility = entityNdP.find("visibility").text()

  toc.duration = parseInt(entityNdP.find("duration").text())

  let vStatusUrn = entityNdP.find("star_lyndaVideoViewingStatus").text().trim()
  if (vStatusUrn.length == 0) {
    vStatusUrn = entityNdP.find("star_interactionstatusv2").text().trim()
  }
  toc.vStatusUrn = vStatusUrn

  const { title, slug, url, duration, captionUrl, captionFmt } = toc
  const row = await mToc.create(title, slug, url, duration, captionUrl, captionFmt, section.id, itemStar, vStatusUrn)
  if (row) {
    const { tocIds } = section

    if (!tocIds.includes(row.id)) {
      tocIds.push(row.id)
      await mSection.updateTocIds(section.id, tocIds)
    }
    section.tocIds = tocIds
  }
  return row
}
