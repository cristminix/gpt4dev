export const makeDelay = (ms: number) => {
  let timer: NodeJS.Timeout
  return function (callback: () => void) {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
    return timer
  }
}
