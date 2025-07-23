import type MExerciseFile from "@/global/db/models/MExerciseFile";

export async function checkExFileExists(mExFile:MExerciseFile,courseId:number,name:string){
    return (await  mExFile.exists(courseId,name,true)) as number
}