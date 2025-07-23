import type MThumbnail from "@/global/db/models/MThumbnail";

export async function checkThumbnailExists(mThumbnail:MThumbnail,courseId:number,size:string){
    return (await mThumbnail.exists(size,courseId,"course",true)) as number
}