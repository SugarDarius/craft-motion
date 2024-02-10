import { fabric } from 'fabric'
import { nanoid } from 'nanoid'

import type { ShapeType, CraftMotionObject } from './codex/shape'
import { generateRandomHexColor } from './colors'

export function createRect({
  pointer,
}: {
  pointer: PointerEvent
}): CraftMotionObject {
  const id = nanoid(16)
  const rect = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: generateRandomHexColor(),
  })

  return { objectId: id, type: 'rectangle', fabricObject: rect }
}

export function createSpecificShape({
  type,
  pointer,
}: {
  type: ShapeType
  pointer: PointerEvent
}): CraftMotionObject {
  switch (type) {
    case 'rectangle':
      return createRect({ pointer })
    default:
      throw new Error('unsupported shape type: ' + type)
  }
}
