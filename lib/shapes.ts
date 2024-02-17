import { fabric } from 'fabric'
import { nanoid } from 'nanoid'

import type {
  ShapeType,
  CraftMotionObject,
  ExtendedFabricObject,
  Pointer,
  DimensionsBox,
  BoundingBoxByOriginCenter,
  RelativePosition,
} from './codex/shape'
import { generateRandomHexColor } from './colors'

fabric.Object.prototype.cornerStrokeColor = '#8b5cf6'
fabric.Object.prototype.borderColor = '#8b5cf6'

export function createRect({
  pointer,
}: {
  pointer: Pointer
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
  pointer: Pointer
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
  pointer: Pointer
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

export function getDimensionsBox(obj: fabric.Object): DimensionsBox {
  const scaling = obj.getObjectScaling()
  const width = (obj.width ?? 0) * scaling.scaleX
  const height = (obj.height ?? 0) * scaling.scaleY

  return { width, height }
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
  return (circle.radius ?? 0) * circle.getObjectScaling().scaleX
}

export function getRelativePosition(
  parent: fabric.Object,
  child: fabric.Object
): RelativePosition {
  const parentBoundingBox = getBoundingBoxByOriginCenter(parent)
  const childBoundingBox = getBoundingBoxByOriginCenter(child)

  const x = Math.abs(childBoundingBox.left - parentBoundingBox.left)
  const y = Math.abs(childBoundingBox.top - parentBoundingBox.top)

  return { x, y }
}

export function setXRelativePosition(
  parent: fabric.Object,
  child: fabric.Object,
  targetX: number
): number {
  const parentBoundingBox = getBoundingBoxByOriginCenter(parent)
  const parentDimensions = getDimensionsBox(parent)

  const childDimensions = getDimensionsBox(child)

  const x = Math.min(
    parentBoundingBox.left + parentDimensions.width - childDimensions.width / 2,
    parentBoundingBox.left + targetX + childDimensions.width / 2
  )

  return x
}

export function setYRelativePosition(
  parent: fabric.Object,
  child: fabric.Object,
  targetY: number
): number {
  const parentBoundingBox = getBoundingBoxByOriginCenter(parent)
  const parentDimensions = getDimensionsBox(parent)

  const childDimensions = getDimensionsBox(child)

  const y = Math.min(
    parentBoundingBox.top +
      parentDimensions.height -
      childDimensions.height / 2,
    parentBoundingBox.top + targetY + childDimensions.height / 2
  )

  return y
}
