export class ArrayPager {
  source: any[]
  limit: number
  page: number
  totalRecords: number
  totalRecordsFiltered: number

  totalPages: number
  totalPagesFiltered: number

  constructor(source: any[], limit: number) {
    this.source = source
    this.limit = limit

    this.page = 1
    this.totalRecords = 0
    this.totalRecordsFiltered = 0

    this.totalPages = 0
    this.totalPagesFiltered = 0

    this.calculate()
  }

  fetch(page: number, filter?: string): any[] {
    let res: any[]
    let sourceCopy = [...this.source]
    if (filter) {
      filter = filter.replace(/\W/g, "")
      const qRegex = new RegExp(`${filter}`)
      sourceCopy = sourceCopy.filter((icon) => icon.match(qRegex))
      this.calculate(filter, sourceCopy)

      if (page > this.totalPagesFiltered) {
        page = this.totalPagesFiltered
      }
    }
    const offset = (page - 1) * this.limit
    res = sourceCopy.slice(offset, offset + this.limit)
    return res
  }

  calculate(filter?: string, sourceCopy?: any[]): this {
    if (filter) {
      this.totalRecordsFiltered = sourceCopy?.length ?? 0
      this.totalPagesFiltered = Math.ceil(this.totalRecordsFiltered / this.limit)
      return this
    }
    this.totalRecords = this.source.length
    this.totalPages = Math.ceil(this.totalRecords / this.limit)
    return this
  }

  getTotalPages(filter?: string): number {
    if (filter) {
      return this.totalPagesFiltered
    }
    return this.totalPages
  }

  getTotalRecords(filter?: string): number {
    if (filter) {
      return this.totalRecordsFiltered
    }
    return this.totalRecords
  }
}
