export interface GridOptionsInterface {
  editUrl?: string | (() => string)
  deleteUrl?: string | (() => string)
  fields: string[]
  routeApp: any
  numberWidthCls: any
  actionWidthCls: any
  callbackFields?: any
  useAutoEditor?: boolean
  editors?: any
  actions?: any
  widthCls?: any
  headers: string[]
  enableEdit: boolean
  enableDelete: boolean
  callbackActions?: any
  callbackHeaders?: any
  enableActions?: boolean
  fieldTypes?: string[]
  editorFactory?: (
    editor: any,
    field: string,
    value: any,
    item: any,
    index: number,
    fieldIndex: number,
  ) => any
}
export interface OptionalGridOptionsInterface {
  editUrl?: string | (() => string)
  deleteUrl?: string | (() => string)
  fields?: string[]
  numberWidthCls?: any
  actionWidthCls?: any
  callbackFields?: any
  useAutoEditor?: boolean
  editors?: any
  actions?: any
  widthCls?: any
  headers?: string[]
  enableEdit?: boolean
  enableDelete?: boolean
  callbackActions?: any
  callbackHeaders?: any
  enableActions?: boolean
  fieldTypes?: string[]
  editorFactory?: (
    editor: any,
    field: string,
    value: any,
    item: any,
    index: number,
    fieldIndex: number,
  ) => any
}

export interface GridActionsInterface {
  edit: any
}
export type OptionalParams = null | undefined
export interface IGridData {
  records: any[]
  limit: number
  page: number
  totalPages: number
  totalRecords: number
  orderBy: string
  orderDir: string
}
