export type ToastKind = "normal" | "success" | "error" | "warning" | "closable"
export interface ToastItemInterface {
  kind: ToastKind
  message: string
  hidden: boolean
  interval?: NodeJS.Timeout | null
  clock?: number
}
