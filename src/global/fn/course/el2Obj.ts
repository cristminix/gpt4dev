import $ from "jquery"
export const el2Obj = (el: HTMLElement) => {
  const childrens = $(el).children()
  if (childrens.length == 0) {
    return null
  }
  let obj: any = {}
  childrens.map((i: number, c: HTMLElement) => {
    const prop = c.tagName.toLocaleLowerCase()
    const value = $(c).text().trim()
    obj[prop] = value
  })
  return obj
}
