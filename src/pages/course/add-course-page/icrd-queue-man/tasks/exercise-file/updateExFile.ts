import type MExerciseFile from "@/global/db/models/MExerciseFile";
import type {TExerciseFile, TExerciseFileU} from "@/global/db/models/schema";

export async function updateExFile(mExFile:MExerciseFile,pk:number,row:TExerciseFileU){
    return (await mExFile.update(pk,row,true)) as TExerciseFile
}
