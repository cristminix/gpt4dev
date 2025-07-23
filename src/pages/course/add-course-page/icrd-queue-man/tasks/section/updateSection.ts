import type MSection from "@/global/db/models/MSection";
import type {TSection, TSectionU} from "@/global/db/models/schema";

export async function updateSection(mSection:MSection,pk:number,row:TSectionU){
    return (await mSection.update(pk,row,true)) as TSection
}