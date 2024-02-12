import type { ShapeType } from './shape'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface InspectedShape<S extends ShapeType> {}

export type InspectedObject =
  | {
      type: InspectedShape<'rectangle'>
      width: number
      height: number
      fill: string
      objectId: string
    }
  | {
      type: InspectedShape<'circle'>
      radius: number
      fill: string
      objectId: string
    }
