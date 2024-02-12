type InspectObjectCommonProps = {
  objectId: string
  fill: string
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
