import type { ShapeType } from './shape'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface InspectedShape<S extends ShapeType> {}
type InspectObjectCommonProps = {
  objectId: string
  fill: string
}

export type InspectedObject =
  | ({
      type: InspectedShape<'rectangle'>
      width: number
      height: number
    } & InspectObjectCommonProps)
  | ({
      type: InspectedShape<'circle'>
      radius: number
    } & InspectObjectCommonProps)
