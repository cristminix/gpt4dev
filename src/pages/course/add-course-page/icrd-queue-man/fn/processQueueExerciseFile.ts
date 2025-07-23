import type { ExerciseFileInterface } from "@/global/classes/types"
import type MExerciseFile from "@/global/db/models/MExerciseFile"
import type { TExerciseFile } from "@/global/db/models/schema"
import {
  checkExFileExists,
  insertExFile,
  updateExFile,
} from "../tasks/exercise-file"
export type TProcessQueueExerciseFileResult = {
  exerciseFiles: TExerciseFile[]
}
export async function processQueueExerciseFile(
  mExFile: MExerciseFile,
  exerciseFiles: ExerciseFileInterface[],
  courseId: number
) {
  const results: TProcessQueueExerciseFileResult = {
    exerciseFiles: [],
  }
  for (const exerciseFile of exerciseFiles) {
    const { name, url, sizeInBytes: size } = exerciseFile
    const exFileId = await checkExFileExists(mExFile, courseId, name)
    let exFileRec: TExerciseFile
    const row = { name, url, size, courseId }

    if (exFileId) {
      exFileRec = await updateExFile(mExFile, exFileId, row)
    } else {
      exFileRec = await insertExFile(mExFile, row)
    }
    results.exerciseFiles.push(exFileRec)
  }
  return results
}
