export const calculateOffset = (pageNumber: number, limit: number) => {
  const offset = (pageNumber - 1) * limit
  return offset
}
