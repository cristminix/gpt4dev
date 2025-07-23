import type { SectionInterface, TM3Rec } from "@/global/classes/types"
import { slugify } from "../../../slugify"
import { findPropLegacy } from "@/content-scripts/inject/fn/legacy/findProp"
import { getTocItemStars } from "./getTocItemStars"

export function getCourseSections(ds: TM3Rec, courseUrn: string) {
  const sections: SectionInterface[] = []

  if (ds) {
    let sectionsTmp: any
    let markup = findPropLegacy(courseUrn, ds) as any

    try {
      sectionsTmp = markup.__data.contents ?? markup.__data.contents
      if (!sectionsTmp) {
        sectionsTmp = markup.__data.contentsDerived
      }
    } catch (e) {
      sectionsTmp = []
    }
    // console.log({ test: Object.keys(markup.__data.contentsDerived), courseUrn, sectionsTmp })
    for (const sectionTmp of sectionsTmp) {
      let sectionUrn = sectionTmp["*section"] as keyof TM3Rec
      const subMarkup = ds[sectionUrn] as any
      if (subMarkup) {
        if (subMarkup.__data) {
          const sectionData = subMarkup.__data
          let itemStars = getTocItemStars(sectionData)
          const section: SectionInterface = {
            title: sectionData.title,
            slug: slugify(sectionData.title),
            itemStars,
          }
          sections.push(section)
        } else {
          console.error(`Unable to find section data by urn: ${sectionUrn}`)
        }
      } else {
        console.error(`Unable to find section by urn: ${sectionUrn}`)
      }
    }
  }
  return sections
}
