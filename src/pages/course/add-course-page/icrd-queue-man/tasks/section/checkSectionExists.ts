import type MSection from "@/global/db/models/MSection";

export async function checkSectionExists(mSection:MSection,courseId:number,slug:string){
    return (await mSection.exists(slug,courseId,true)) as number
}