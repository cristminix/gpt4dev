import type MToc from "@/global/db/models/MToc";

export async function checkTocExists(mToc:MToc,sectionId:number,slug:string){
    return (await mToc.exists(slug,sectionId,true)) as number
}