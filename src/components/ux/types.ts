export interface MenuInterface {
  id?: number

  title: string
  path: string
  iconCls: string

  slug?: string
  level?: number
  parent?: number
  hasChild?: boolean

  dev?: boolean
  children?: MenuInterface[]

  hidden?: boolean
  order?: number

  childIconCls?: string
  childRoutePath?: string
  slugField?: string
  useModel?: boolean
  model?: string
  displayField?: string
  modelListMethod?: string
}
