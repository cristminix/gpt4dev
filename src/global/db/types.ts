import type {TApp,TAuthor,TCourse, TSection} from "@/global/db/models/schema";
export interface DBListInterface {
    limit:number
    totalPages:number
    totalRecords:number
    recordCount:number
    records:TCourse[]|TSection[]|TAuthor|TApp[]
}