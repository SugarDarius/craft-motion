type InspectObjectCommonProps = {
  objectId: string
  fill: string
  x: number
  y: number
}

export type InspectedObject =
  | ({
      type: 'rectangle'
      width: number
      height: number
    } & InspectObjectCommonProps)
  | ({
      type: 'circle'
      radius: number
    } & InspectObjectCommonProps)
