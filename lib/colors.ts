export function generateRandomHexColor(): string {
  const letters = '0123456789ABCDEF'
  let color = '#'

  for (let i = 0; i < 6; i++) {
    color = color + letters[Math.floor(Math.random() * 16)]
  }

  return color
}

export function validateHexCode(hexCode: string): string | null {
  hexCode.trim()

  const hexPattern = /^#?(?:[0-9a-fA-F]{3}){1,2}$/
  if (hexPattern.test(hexCode)) {
    return hexCode.startsWith('#') ? hexCode : `#${hexCode}`
  }

  return null
}
