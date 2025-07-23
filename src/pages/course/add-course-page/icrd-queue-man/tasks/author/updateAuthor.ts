import type MAuthor from "@/global/db/models/MAuthor";
import type {TAuthor, TAuthorU} from "@/global/db/models/schema";

export async function updateAuthor(mAuthor:MAuthor,pk:number,row:TAuthorU) {
    return (await mAuthor.update(pk,row,true)) as TAuthor
}