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
    name: id,
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: generateRandomHexColor(),
  })

  return { objectId: id, type: 'rectangle', fabricObject: rect }
}

export function createCircle({
  pointer,
}: {
  pointer: PointerEvent
}): CraftMotionObject {
  const id = nanoid(16)
  const circle = new fabric.Circle({
    name: id,
    left: pointer.x,
    top: pointer.y,
    radius: 100,
    fill: generateRandomHexColor(),
  })

  return { objectId: id, type: 'circle', fabricObject: circle }
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
    case 'circle':
      return createCircle({ pointer })
    default:
      throw new Error('unsupported shape type: ' + type)
  }
}
