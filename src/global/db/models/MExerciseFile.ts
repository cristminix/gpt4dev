import { ExerciseFileSchema, type TExerciseFile } from "./schema"
import DrizzleDB from "./DrizzleDB"
import { eq } from "drizzle-orm"

class MExerciseFile extends DrizzleDB {
  schema = ExerciseFileSchema
  async exists(courseId: number, name: string, returnId = false) {
    if (returnId) {
      const exerciseFile: TExerciseFile | null = await this.getRow({
        courseId,
        name,
      })
      if (exerciseFile) {
        return exerciseFile.id
      } else {
        return 0
      }
    }
    return (await this.count({ courseId, name })) > 0
  }
  getByNameAndCourseId(name: string, courseId: number) {
    // return this.singleQuery({query: {name,courseId}})
  }
  getListByCourseId(courseId: number) {
    const condition = eq(this.schema.courseId, courseId)
    return this.db.select().from(this.schema).where(condition)
  }
  async createLegacy(
    name: string,
    url: string,
    size: number,
    courseId: number
  ) {
    /*
    let exerciseFile = this.getByNameAndCourseId(name,courseId)

    if(!exerciseFile){
        const id = 0
        exerciseFile = {id,courseId,name,url,size}
        exerciseFile.id = this.db.insert(this.table,exerciseFile)

    }else{
        console.log(exerciseFile.url, url)
        const id = exerciseFile.id
        exerciseFile.url = url
        this.db.update(this.table,{id}, row => {
            row.url = url
            return row
        })
        console.log(`Exercise file updated`)
    }
    await this.db.commit()

    return exerciseFile
    */
  }
}

export default MExerciseFile
