import type { JsonObject } from '@liveblocks/client'
import type { ShapeType } from './shape'

export type CanvasObjects = ReadonlyMap<
  string,
  {
    objectId: string
    type: ShapeType
    fabricObjectData: JsonObject
  }
>
