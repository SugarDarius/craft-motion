import type { Circle, Gradient, Pattern, Rect } from 'fabric/fabric-impl'

export type ShapeType = 'rectangle' | 'circle'

export type ShapeProps = {
  width: string
  height: string
  fill: string | Gradient | Pattern
  left: number
  top: number
  objectId: string
}

type ExtendsWithObjectId<T> = T & { objectId: string }
export type ExtendedFabricObject =
  | ExtendsWithObjectId<Rect>
  | ExtendsWithObjectId<Circle>

export type CraftMotionObject = {
  objectId: string
  type: ShapeType
  fabricObject: ExtendedFabricObject
}

export type Pointer = { x: number; y: number }
export type DimensionsBox = { width: number; height: number }
export type BoundingBoxByOriginCenter = {
  left: number
  top: number
  right: number
  bottom: number
}
export type RelativePosition = { x: number; y: number }
