import type { Gradient, Pattern, Rect, Circle } from 'fabric/fabric-impl'

export type ShapeType = 'rectangle' | 'circle'

export type ShapeProps = {
  width: string
  height: string
  fill: string | Gradient | Pattern
  left: number
  top: number
  objectId: string
}

export type CraftMotionObject = {
  objectId: string
  type: ShapeType
  fabricObject: Rect | Circle
}
