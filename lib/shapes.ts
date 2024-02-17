import { fabric } from 'fabric'
import { nanoid } from 'nanoid'

import type {
  ShapeType,
  CraftMotionObject,
  ExtendedFabricObject,
} from './codex/shape'
import { generateRandomHexColor } from './colors'

fabric.Object.prototype.cornerStrokeColor = '#8b5cf6'
fabric.Object.prototype.borderColor = '#8b5cf6'

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
    originX: 'center',
    originY: 'center',
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
    radius: 50,
    originX: 'center',
    originY: 'center',
    fill: generateRandomHexColor(),
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  circle.set('objectId', id)
  circle.set('lockScalingX', true)
  circle.set('lockScalingY', true)

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

export type DimensionsBox = { width: number; height: number }

export function getDimensionsBox(obj: fabric.Object): DimensionsBox {
  const width = obj.width ?? 0
  const height = obj.height ?? 0

  return { width, height }
}

export type BoundingBoxByOriginCenter = {
  left: number
  top: number
  right: number
  bottom: number
}

export function getBoundingBoxByOriginCenter(
  obj: fabric.Object
): BoundingBoxByOriginCenter {
  const { width, height } = getDimensionsBox(obj)

  const left = (obj.left ?? 0) - width / 2
  const top = (obj.top ?? 0) - height / 2
  const right = left + width
  const bottom = top + height

  return { left, top, right, bottom }
}

export function getCircleRadius(circle: fabric.Circle): number {
  return circle.radius ?? 0
}
