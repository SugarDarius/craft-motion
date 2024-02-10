import { Gradient, Pattern } from 'fabric/fabric-impl'

export type ShapeProps = {
  width: string
  height: string
  fill: string | Gradient | Pattern
  left: number
  top: number
  objectId: string | undefined
}
