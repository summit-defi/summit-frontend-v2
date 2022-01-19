export const chunkArray = <T>(chunkSize: number, array: T[]): T[][] => {
  const groups: T[][] = []
  let i = 0
  for (i = 0; i < array.length; i += chunkSize) {
    groups.push(array.slice(i, i + chunkSize))
  }
  return groups
}

export const promiseSequenceForEach = async <T, R>(
  inputArray: T[],
  callback: (element: T, index: number, array: T[]) => Promise<R>,
) => {
  for (let i = 0; i < inputArray.length; i++) {
    await callback(inputArray[i], i, inputArray)
  }
}

type IfTrueThenNotNull<BoolOrNothing extends boolean | undefined, R> = BoolOrNothing extends true
  ? Exclude<R, null | undefined>
  : R

export const mapValues = <T, U, V extends boolean | undefined>(
  input: Map<string | number, T>,
  valueTransformer: (value: T) => U,
  filterValues?: V,
): Map<string | number, IfTrueThenNotNull<V, U>> => {
  const newMap: Map<string | number, IfTrueThenNotNull<V, U>> = {} as Map<string | number, IfTrueThenNotNull<V, U>>
  Object.keys(input).forEach((key) => {
    const newValue = valueTransformer(input[key])
    if (!!newValue || !filterValues) {
      newMap[key] = newValue as IfTrueThenNotNull<V, U>
    }
  })
  return newMap
}

export const mapKeysAndValues = <T, U, V extends boolean | undefined>(
  input: Map<string | number, T>,
  valueTransformer: (key: string, value: T) => U,
  filterValues?: true,
): Map<string | number, IfTrueThenNotNull<V, U>> => {
  const newMap: Map<string | number, IfTrueThenNotNull<V, U>> = {} as Map<string | number, IfTrueThenNotNull<V, U>>
  Object.keys(input).forEach((key) => {
    const newValue = valueTransformer(key, input[key])
    if (!!newValue || !filterValues) {
      newMap[key] = newValue as IfTrueThenNotNull<V, U>
    }
  })
  return newMap
}

export const groupBy = <T>(
  fromArray: T[],
  keyExtractor: (item: T, index: number) => string | number,
): Map<string | number, T> => {
  const grouped: Map<string | number, T> = {} as Map<string | number, T>
  fromArray.forEach((item, index) => {
    grouped[keyExtractor(item, index)] = item
  })
  return grouped
}

export const groupByAndMap = <T, U>(
  fromArray: T[],
  keyExtractor: (item: T, index: number) => string | number,
  transform: (item: T, index: number) => U,
): Map<string | number, U> => {
  const grouped: Map<string | number, U> = {} as Map<string | number, U>
  fromArray.forEach((item, index) => {
    grouped[keyExtractor(item, index)] = transform(item, index)
  })
  return grouped
}
export const nFormatter = (num: number, digits = 2): string => {
  const si = [
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    // { value: 1e3, symbol: 'K' },
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toFixed(digits)
}

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
