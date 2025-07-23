export const getAvgSpeed = (value: any, arrayLength: number = 10, integerArray: number[] = [], lastIndex: number = 0) => {
  if (lastIndex >= arrayLength - 1) {
    lastIndex = 0
  }
  if (integerArray.length === arrayLength) {
    integerArray[lastIndex] = value
  } else {
    integerArray.push(value)
  }

  const sum = integerArray.reduce((acc, val) => acc + val, 0)
  const avg = sum / integerArray.length
  lastIndex += 1

  return [avg, arrayLength, integerArray, lastIndex]
}
