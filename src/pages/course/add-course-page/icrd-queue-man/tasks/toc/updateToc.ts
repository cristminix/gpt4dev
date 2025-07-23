import type MToc from "@/global/db/models/MToc";
import type {TToc, TTocN} from "@/global/db/models/schema";

export async function updateToc(mToc:MToc,pk:number,row:TTocN){
    return (await mToc.update(pk,row)) as TToc

}