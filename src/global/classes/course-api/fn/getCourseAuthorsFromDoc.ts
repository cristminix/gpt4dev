import {getNText} from "@/global/fn/course/getNText";
import { slugToTitle } from "@/global/fn/course/slugToTitle";
import {getCourseXmlParentElement} from "@/global/fn/course/getCourseXmlParentElement";
import jQuery from "jquery";
import type {CourseAuthorInterface} from "@/global/classes/types";

export function getCourseAuthorsFromDoc($doc: any) {
    let courseAuthors: CourseAuthorInterface[] = []
    // authors=[]
    const [pp] = getCourseXmlParentElement($doc)
    if(pp) {
        const p = pp as any
        let authorEls = p.find("authors")
        if (authorEls.length == 0) {
            authorEls = p.find("star_authorsv2")
        }
        if (authorEls.length == 0) {
            authorEls = p.find("star_authorsv3")
        }
        const authorSlugExists:string[] =[]
        for (const authorEl of authorEls) {
            let authorUrn = jQuery(authorEl).text()
            let authorEntityEls = $doc.find(`entityUrn:contains('${authorUrn}')`)
            // authorEntityEls = authorEntityEls.filter((elem:any) => jQuery(elem).text().trim().match(/urn:li:learningApiAuthor:/))
            if (authorEntityEls.length > 0) {
                for (const authorEntityElem of authorEntityEls) {
                    const authorEntityEl = jQuery(authorEntityElem)
                    const authorEntityUrn = authorEntityEl.text().trim()
                    if (authorEntityUrn.length > 0) {

                        if (authorEntityUrn == authorUrn) {
                            let $authorEntityElP = authorEntityEl.parent()
                            // console.log(authorEntityElP.html())
                            let slug = getNText($authorEntityElP, 'slug')
                            let name = slugToTitle(slug)
                            if(slug.length > 0 && !authorSlugExists.includes(slug)) {
                                authorSlugExists.push(slug)
                            }else {
                                continue
                            }
                            /*let biography = getNText(authorEntityElP, ['biography', 'text'])
                            let biographyV2 = getNText(authorEntityElP, ['biographyV2', 'text'])
                            let biographyV3 = getNText(authorEntityElP, ['biographyV3', 'text'])
                            if(biographyV3.length > 0) {
                                biography = biographyV3
                            }else if(biographyV2.length > 0) {
                                biography = biographyV2
                            }
                            */
                            let shortBiography = getNText($authorEntityElP, ['shortBiography', 'text'])
                            let shortBiographyV2 = getNText($authorEntityElP, ['shortBiographyV2', 'text'])
                            let shortBiographyV3 = getNText($authorEntityElP, ['shortBiographyV3', 'text'])

                            if(shortBiographyV3.length>0){
                                shortBiography = shortBiographyV3
                            }else if(shortBiographyV2.length>0){
                                shortBiography = shortBiographyV2
                            }
                            let author:CourseAuthorInterface = {name, slug, shortBiography}
                            // let author = {
                            //     slug, name, biography, shortBiography
                            // }
                            // if(author){
                            //     await mCourse.addAuthorId(course.id, author.id)
                            // }
                            courseAuthors.push(author)
                            // m_author.addCourse(author,course)
                        }
                    }
                }
            }
        }
    }
    return courseAuthors
}