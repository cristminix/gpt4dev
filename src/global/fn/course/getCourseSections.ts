import { slugify } from "./slugify"
import $ from "jquery"
export const getCourseSections = async (p: any, doc: JQuery, mSection: any, courseId: number) => {
  let sections = mSection.getListByCourseId(courseId)
  if (sections.length > 0) {
    return sections
  }
  let courseSectionStars = p.find("contents")
  if (courseSectionStars.length == 0) {
    courseSectionStars = p.find("contentsderived")
  }
  sections = []
  let tocs: any = {}
  for (const sectionStarEl of courseSectionStars) {
    const sectionStar = $(sectionStarEl).text().trim()
    let sectionNds = doc.find(`cachingKey:contains('${sectionStar}')`)
    // # print("213:%s" % section_star)
    if (sectionNds.length > 0) {
      for (const sectionNdElem of sectionNds) {
        const sectionNd = $(sectionNdElem)
        const sectionNdStar = sectionNd.text().trim()
        if (sectionNdStar == sectionStar) {
          let sectionNdP = sectionNd.parent()
          let sectionTitleEl = sectionNdP.find("title")
          if (sectionTitleEl.length > 0) {
            const sectionTitle = sectionTitleEl.text()
            // # print(section_title)
            const sectionSlug = slugify(sectionTitle)
            tocs[sectionSlug] = []
            let section: any = {
              title: sectionTitle,
              itemStars: [],
              slug: sectionSlug,
            }
            let itemStarNds = sectionNdP.find("star_items")
            if (itemStarNds.length == 0) {
              itemStarNds = sectionNdP.find("star_video")
            }
            // # item_stars=[]
            if (itemStarNds.length > 0) {
              for (const itemStarEl of itemStarNds) {
                let itemStar: string = ""
                const $itemStar = $(itemStarEl)
                if ($itemStar.length > 0) itemStar = $itemStar.text().trim()
                const skipPattern = "urn:li:learningApiTocItem:urn:li:learningApiAssessmen"
                const matchSkipPattern = itemStar.match(skipPattern)
                if (!matchSkipPattern) {
                  if (itemStar.length > 0) {
                    section.itemStars.push(itemStar)
                  }
                }
              }
            }
            const { title, itemStars, slug } = section
            const row = await mSection.create(title, slug, courseId, itemStars)
            sections.push(row)
          }
        }
      }
    }
  }
  return sections
}
