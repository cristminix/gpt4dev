import type MToc from "@/global/db/models/MToc";
import type {TocInterface} from "@/global/classes/types";
import { checkTocExists, insertToc, updateToc } from "../tasks/toc";
import type { TToc } from "@/global/db/models/schema";
export type TProcessQueueTocResult = {
    tocs:TToc[]
}
export async function processQueueToc(mToc:MToc,tocs:TocInterface[],sectionId:number){
    const results:TProcessQueueTocResult = {
        tocs:[]
    }
    for(const toc of tocs){
        const {title,slug,itemStar,vStatusUrn,visibility} = toc
        let tocId = await checkTocExists(mToc,sectionId,slug)
        let tocRec:TToc
        const row = {title,slug,itemStar,vStatusUrn,visibility, sectionId}

        if(tocId) {
            tocRec = await updateToc(mToc,tocId, row)
        }else {
            tocRec = await insertToc(mToc,row)
        }
        results.tocs.push(tocRec)
    }
    return results;
}