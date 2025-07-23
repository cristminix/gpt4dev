import type MExerciseFile from "@/global/db/models/MExerciseFile";
import type {TExerciseFile, TExerciseFileN} from "@/global/db/models/schema";

export async function insertExFile(mExFile:MExerciseFile,row:TExerciseFileN){
    return (await mExFile.create(row,true)) as TExerciseFile
}