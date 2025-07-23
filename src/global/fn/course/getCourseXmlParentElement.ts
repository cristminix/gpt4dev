import { findElementContainsBeginWith } from "./findElementContainsBeginWith"
import $ from "jquery"
export const getCourseXmlParentElement = (doc: JQuery) => {
  if (!doc) {
    return [null, null]
  }
  let p = null
  let courseUrn = null
  let courseUrnNd = findElementContainsBeginWith(doc, "star_elements", "urn:li:learningApiCourse:") //doc.find(`star_elements:contains('urn:li:learningApiCourse:')`)
  // console.log(courseUrnNd)

  if (courseUrnNd.length == 0) {
    courseUrnNd = doc.find("entityUrn")
  }
  if (courseUrnNd.length > 0) {
    // for(let i in courseUrnNd ){
    // let courseUrnNdItem = $(courseUrnNd[i])
    courseUrn = courseUrnNd.text().trim()
    console.log(courseUrn)
    let entityUrnNd = findElementContainsBeginWith(doc, "entityUrn", courseUrn)
    for (const entityUrnNdItem of entityUrnNd) {
      if ($(entityUrnNdItem).text().trim() == courseUrn) {
        // console.log(entityUrnNdItem)
        p = $(entityUrnNdItem).closest("included")
        break
      }
    }
  }
  return [p, courseUrn]
}
