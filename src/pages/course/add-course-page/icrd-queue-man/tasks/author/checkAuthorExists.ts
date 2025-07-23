import type MAuthor from "@/global/db/models/MAuthor";

export async function checkAuthorExists(mAuthor:MAuthor,slug:string){
    return (await mAuthor.exists(slug,true)) as number
}