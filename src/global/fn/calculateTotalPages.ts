export const calculateTotalPages = (recordCount: number, limit: number) => {
  return Math.ceil(recordCount / limit)
}
