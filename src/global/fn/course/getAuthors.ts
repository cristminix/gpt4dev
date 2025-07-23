import { getCourseXmlParentElement } from "./getCourseXmlParentElement"
import { getNText } from "./getNText"
import { slugToTitle } from "./slugToTitle"

export const getAuthors = async (doc: any, mAuthor: any, mCourse: any, course: any) => {
  let authors = mAuthor.getListByCourse(course)

  if (authors.length == 0) {
    // authors=[]
    const [pp, courseUrn] = getCourseXmlParentElement(doc)
    const p = pp as JQuery
    let authorEls = p.find("authors")
    if (authorEls.length == 0) {
      authorEls = p.find("star_authorsv2")
    }

    for (const authorEl of authorEls) {
      let authorUrn = jQuery(authorEl).text()
      let authorEntityEls = doc.find(`entityUrn:contains('${authorUrn}')`)
      authorEntityEls = authorEntityEls.filter((i: number, item: HTMLElement) =>
        jQuery(item)
          .text()
          .trim()
          .match(/urn:li:learningApiAuthor:/)
      )
      if (authorEntityEls.length > 0) {
        for (const authorEntityElem of authorEntityEls) {
          const authorEntityEl = jQuery(authorEntityElem)
          const authorEntityUrn = authorEntityEl.text().trim()
          if (authorEntityUrn.length > 0) {
            if (authorEntityUrn == authorUrn) {
              let authorEntityElP = authorEntityEl.parent()
              let slug = getNText(authorEntityElP, "slug")
              let name = slugToTitle(slug)
              let biography = getNText(authorEntityElP, ["biographyV2", "text"])
              let shortBiography = getNText(authorEntityElP, ["shortBiographyV2", "text"])
              let author = await mAuthor.create(name, slug, biography, shortBiography, course.id)
              // let author = {
              //     slug, name, biography, shortBiography
              // }
              if (author) {
                await mCourse.addAuthorId(course.id, author.id)
              }
              authors.push(author)
              // m_author.addCourse(author,course)
            }
          }
        }
      }
    }
  }

  return authors
}
