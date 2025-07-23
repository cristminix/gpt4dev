import type {SectionInterface, TocInterface} from "@/global/classes/types";
import {getTocXmlParentElement} from "@/global/fn/course/getTocXmlParentElement";
/**
 * Get all tocs by its sections item stars
 * */
export function getCourseSectionTocsFromDoc(section: SectionInterface, doc:any, courseSlug:string){
    let tocs:TocInterface[]=[]
    for (const itemStar of section.itemStars){
        let $entityNdP = getTocXmlParentElement(itemStar,doc)
        if(!$entityNdP){
            return null
        }
        const toc:TocInterface={
            streamLocations : [],
            transcripts : [],
            duration:0,
            itemStar,
            vStatusUrn:'',
            slug:'',
            title:'',
            visibility:'',
            thumbnails:[],
            url:''
        }
        let $tocSlugNd = $entityNdP.find("slug")
        if($tocSlugNd.length > 0){
            let tocSlug = $tocSlugNd.text()
            toc.slug = tocSlug
            toc.url = `https://www.linkedin.com/learning/${courseSlug}/${tocSlug}`
        }

        toc.title = $entityNdP.find("title").text()
        toc.visibility = $entityNdP.find("visibility").text()
        toc.duration = parseInt($entityNdP.find("duration").text())

        let vStatusUrn = $entityNdP.find("star_lyndaVideoViewingStatus").text().trim()
        if(vStatusUrn.length == 0){
            vStatusUrn = $entityNdP.find("star_interactionstatusv2").text().trim()

        }
        toc.vStatusUrn = vStatusUrn

        // const {title, slug, url, duration, captionUrl, captionFmt} = toc
        // const row = await mToc.create(title, slug, url, duration, captionUrl, captionFmt, section.id,itemStar,vStatusUrn)

        // section.tocIds = tocIds
        tocs.push(toc)
    }
    return tocs
}