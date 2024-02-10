import type { Canvas, IEvent } from 'fabric/fabric-impl'
import { fabric } from 'fabric'

import type { ShapeType, CraftMotionObject } from './codex/shape'
import { createSpecificShape } from './shapes'

export function setupCanvas({
  targetCanvasRef,
}: {
  targetCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}): Canvas {
  const canvasElement =
    targetCanvasRef.current ?? document.getElementById('canvas')
  const canvas = new fabric.Canvas(targetCanvasRef.current, {
    width: canvasElement?.clientWidth ?? 0,
    height: canvasElement?.clientHeight ?? 0,
  })

  return canvas
}

export function handleCanvasMouseDown({
  options,
  canvas,
  isCurrentUserDrawing,
  currentDrawnShapeRef,
  currentSelectedShapeRef,
}: {
  options: IEvent<MouseEvent>
  canvas: Canvas
  isCurrentUserDrawing: React.MutableRefObject<boolean>
  currentDrawnShapeRef: React.MutableRefObject<CraftMotionObject | null>
  currentSelectedShapeRef: React.MutableRefObject<ShapeType | null>
}): void {
  const pointer = canvas.getPointer(options.e)
  const target = canvas.findTarget(options.e, false)

  canvas.isDrawingMode = false

  if (
    target &&
    target.type &&
    (currentSelectedShapeRef.current === target.type ||
      'activeSelection' === target.type)
  ) {
    isCurrentUserDrawing.current = false
    canvas.setActiveObject(target)

    target.setCoords()
  } else if (currentSelectedShapeRef.current) {
    isCurrentUserDrawing.current = true

    currentDrawnShapeRef.current = createSpecificShape({
      type: currentSelectedShapeRef.current,
      pointer: pointer as PointerEvent,
    })
  }
}
