export type TIsSelectedFn = (id: string | number) => boolean
export type TOnSelectFn = (id: string | number, path: string) => void
export type TFolderFileCreationFn = (id: string | number, value: string, isFolder: boolean) => void
export type TFileItem = { id: string | number; expanded: boolean }
export type TSetExpandFn = (data: TFileItem) => void
export type TFolderItem = {
  id: number | string
  name: string
  isFolder: boolean
  items?: TFolderItem[]
  isExpanded?: boolean
  path?: string
  selected?:boolean
}
