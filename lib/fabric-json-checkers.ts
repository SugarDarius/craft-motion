type UnknownItems = {
  [key: string]: unknown
}

export function getStringOrUndef(
  items: UnknownItems,
  key: string
): string | undefined {
  const value = items[key]
  if (!(typeof value === 'string')) {
    return undefined
  }
  return value
}
