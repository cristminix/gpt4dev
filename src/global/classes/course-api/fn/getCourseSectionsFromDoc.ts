import {getCourseXmlParentElement} from "@/global/fn/course/getCourseXmlParentElement";
import type {SectionInterface} from "@/global/classes/types";
import jQuery from "jquery";
import {slugify} from "@/global/fn/course/slugify";
export function getCourseSectionsFromDoc(doc: any) {
    let sections:SectionInterface[] = []
    const [pp] = getCourseXmlParentElement(doc)
    if (pp) {
        const p = pp as JQuery
        let courseSectionStars = p.find("contents")
        if(courseSectionStars.length == 0){
            courseSectionStars = p.find("contentsderived")
        }
        for (const sectionStarEl of courseSectionStars) {
            const sectionStar = jQuery(sectionStarEl).text().trim()
            let sectionNds = doc.find(`cachingKey:contains('${sectionStar}')`)
            // # print("213:%s" % section_star)
            if (sectionNds.length > 0) {
                for (const sectionNdElem of sectionNds) {
                    const sectionNd = jQuery(sectionNdElem)
                    const sectionNdStar = sectionNd.text().trim()
                    if (sectionNdStar == sectionStar) {

                        let sectionNdP = sectionNd.parent()
                        let sectionTitleEl = sectionNdP.find("title")
                        if (sectionTitleEl.length > 0) {
                            const sectionTitle = sectionTitleEl.text()
                            // # print(section_title)
                            const sectionSlug = slugify(sectionTitle)
                            // tocs[sectionSlug] = []
                            let section: SectionInterface = {
                                title: sectionTitle,
                                itemStars: [],
                                slug: sectionSlug
                            }
                            let itemStarNds = sectionNdP.find("star_items")
                            if (itemStarNds.length == 0) {
                                itemStarNds = sectionNdP.find("star_video")
                            }
                            // # item_stars=[]
                            if (itemStarNds.length > 0) {
                                for (const itemStarEl of itemStarNds) {
                                    const itemStar = jQuery(itemStarEl).text().trim()
                                    const skipPattern = "urn:li:learningApiTocItem:urn:li:learningApiAssessmen";
                                    const matchSkipPattern = itemStar.match(skipPattern)
                                    if (matchSkipPattern) {
                                        // continue
                                    } else {
                                        if (itemStar.length > 0) {
                                            section.itemStars.push(itemStar)
                                        }
                                    }
                                }
                            }
                            // const {title, itemStars, slug} = section
                            // const row = await mSection.create(title, slug, courseId,itemStars)
                            sections.push(section)
                        }
                    }
                }
            }
        }
    }
    return sections
}