import { fabric } from 'fabric'
import { nanoid } from 'nanoid'

import type {
  ShapeType,
  CraftMotionObject,
  ExtendedFabricObject,
} from './codex/shape'
import { generateRandomHexColor } from './colors'

fabric.util

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  rect.set('objectId', id)

  return {
    objectId: id,
    type: 'rectangle',
    fabricObject: rect as ExtendedFabricObject,
  }
}

export function createCircle({
  pointer,
}: {
  pointer: PointerEvent
}): CraftMotionObject {
  const id = nanoid(16)
  const circle = new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 100,
    fill: generateRandomHexColor(),
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  circle.set('objectId', id)

  return {
    objectId: id,
    type: 'circle',
    fabricObject: circle as ExtendedFabricObject,
  }
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
