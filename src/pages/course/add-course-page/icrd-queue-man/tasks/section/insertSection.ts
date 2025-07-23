import type MSection from "@/global/db/models/MSection";
import type {TSection, TSectionN} from "@/global/db/models/schema";

export async function insertSection(mSection:MSection ,row:TSectionN){
    return (await mSection.create(row,true)) as TSection
}