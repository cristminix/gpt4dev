import type MAuthor from "@/global/db/models/MAuthor";
import type {TAuthor, TAuthorN} from "@/global/db/models/schema";

export async function insertAuthor(mAuthor:MAuthor,row:TAuthorN) {
    return await mAuthor.create(row,true) as TAuthor
}