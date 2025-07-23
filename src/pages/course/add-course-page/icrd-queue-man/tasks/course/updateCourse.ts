import type MCourse from "@/global/db/models/MCourse";
import type {TCourse, TCourseU} from "@/global/db/models/schema";

export  async function updateCourse(mCourse:MCourse,pk:number,row:TCourseU){
    return (await mCourse.update(pk,row,true)) as TCourse
}