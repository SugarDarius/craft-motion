import type { JsonObject, Lson } from '@liveblocks/client'

class LsonIsNotAJsonObjectError extends Error {
  constructor() {
    super('Lson is not a json object')
    Object.setPrototypeOf(this, LsonIsNotAJsonObjectError.prototype)
  }
}

function isJsonObject(v: Lson): v is JsonObject {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export function getJsonObject(items: Lson): JsonObject {
  if (!isJsonObject(items)) {
    throw new LsonIsNotAJsonObjectError()
  }

  return items
}
