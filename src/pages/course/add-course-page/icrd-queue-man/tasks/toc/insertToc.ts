import type MToc from "@/global/db/models/MToc";
import type {TToc, TTocN} from "@/global/db/models/schema";

export async function insertToc(mToc:MToc,row:TTocN){
    return await mToc.create(row,true) as TToc
}