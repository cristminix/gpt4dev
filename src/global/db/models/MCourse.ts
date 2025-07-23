import {CourseSchema, type TCourse} from "./schema"
// import DrizzleModelRw from "@/global/classes/DrizzleModelRw"
import DrizzleDB from "./DrizzleDB"

class MCourse extends DrizzleDB {
  schema = CourseSchema
  async exists(slug: string,returnId = false) {
    if(returnId){
        const course:TCourse|null = await this.getRow({ slug })
        if(course){
            return course.id
        }
        return 0
    }
    return (await this.count({ slug })) > 0
  }
  async getBySlug(slug: string) {
    return await this.getRow({ slug })
  }
  async getLastSlug() {
    /*const mApp = await App.getInstance()

    const app = mApp.get()
    if (app) {
        return app.lastCourseSlug
    }
    return ''
    */
  }
  async setLastSlug(slug: string) {
    /*
    const mApp = await App.getInstance()

    if (slug !== '') {
        console.log(`App.init() update courseSlug=${slug}`)

        await mApp.update(row => {
            row.lastCourseSlug = slug
            return row
        })
    }
    */
  }
  async getCoursePageData(slug: string) {
    /*
    if (!slug) {
        return null
    }
    const mAuthor = await Author.getInstance()
    const mSection = await Section.getInstance()
    const mToc = await Toc.getInstance()
    let course = null, authors = [], sections = [], tocs = {}
    course = this.getBySlug(slug)
    if (course) {
        authors = mAuthor.getListByCourse(course)
        sections = mSection.getListByCourseId(course.id)

        for(let i in sections){
            const section = sections[i]
            tocs[section.slug] = mToc.getListBySectionId(section.id)
        }

    } 
    return {course, authors, sections, tocs}
    */
  }
  async getCourseSecsTocs(courseId: number) {
    /*
    let  sections=[], tocs={}

    const mSection = await Section.getInstance()
    const mToc = await Toc.getInstance()
    sections = mSection.getListByCourseId(courseId)
    for(let i in sections){
        const section = sections[i]
        tocs[section.slug] = mToc.getListBySectionId(section.id)
    }

    return {sections, tocs}
    */
  }
  // getList() {
  //   const results = this.db.queryAll(this.table)
  //   return results
  // }

  getById(id: number) {
    // return this.singleQuery({ query: { id } })
  }

  async addAuthorId(id: string, authorId: number) {
    /*
    const course = this.getById(id)
    if (course) {
      const authorIds = course.authorIds.filter((item) => item)
      if (!authorIds.includes(authorId)) {
        authorIds.push(authorId)

        this.db.update(this.table, { id }, (row) => {
          row.authorIds = authorIds
          return row
        })

        await this.db.commit()
      }
    }

    return course
    */
  }
  async createLegacy(title: string, slug: string, duration: number, sourceCodeRepository: string, description: string, urn: string) {
    /*
    let course = this.getBySlug(slug)
    if (!course) {
      const id = 0
      const authorIds = []
      course = { id, title, slug, duration, sourceCodeRepository, description, authorIds, urn }
      course.id = this.db.insert(this.table, course)
      await this.db.commit()
    } else {
      course = await this.update(course.id, { title, slug, duration, sourceCodeRepository, description, urn })
      console.error(`${this.constructor.name}.create() rowExist, update row`)
    }

    return course
    */
  }
  async updateLegacy(id: number, row_: any) {
    /*
    let record = this.getById(id)
    if (record) {
      this.db.update(this.table, { id }, (row) => {
        for (let k in row_) {
          row[k] = row_[k]
          record[k] = row_[k]
        }
        return row
      })
      await this.db.commit()
    }

    return record
    */
  }
}

export default MCourse
