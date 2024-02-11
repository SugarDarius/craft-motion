import type { JsonObject, Lson } from '@liveblocks/client'

class LsonIsNotAnObjectError extends Error {
  constructor() {
    super('Lson is not an object')
    Object.setPrototypeOf(this, LsonIsNotAnObjectError.prototype)
  }
}

function isObject(v: Lson): v is JsonObject {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export function getObject(items: Lson): JsonObject {
  if (!isObject(items)) {
    throw new LsonIsNotAnObjectError()
  }

  return items
}
