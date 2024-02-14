export function inputValuesFixer(values: number[]): number[] {
  return values.map((value): number => (isNaN(value) ? 0 : value))
}
