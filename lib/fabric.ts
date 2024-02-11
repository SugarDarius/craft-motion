import type { Canvas, IEvent } from 'fabric/fabric-impl'
import { fabric } from 'fabric'

import type { ShapeType, CraftMotionObject } from './codex/shape'
import { createSpecificShape } from './shapes'

const CANVAS_BOX_ID = 'canvas-box'

export function setupCanvas({
  targetCanvasRef,
}: {
  targetCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}): Canvas {
  const canvasBoxElement = document.getElementById(CANVAS_BOX_ID)

  const canvas = new fabric.Canvas(targetCanvasRef.current, {
    width: canvasBoxElement?.clientWidth ?? 0,
    height: canvasBoxElement?.clientHeight ?? 0,
  })

  return canvas
}

export function renderCanvas({
  canvasObjects,
  fabricCanvasRef,
  activeObjectRef,
}: {
  canvasObjects: Map<string, CraftMotionObject>
  fabricCanvasRef: React.MutableRefObject<Canvas | null>
  activeObjectRef: React.MutableRefObject<CraftMotionObject | null>
}): void {
  if (fabricCanvasRef.current) {
    fabricCanvasRef.current.clear()

    // @note: working box
    const width = Math.round(fabricCanvasRef.current.getWidth()) * 0.6
    const height = width / (16 / 9)

    const workingBoxRect = new fabric.Rect({
      originX: 'center',
      originY: 'center',
      left: fabricCanvasRef.current.getWidth() / 2,
      top: fabricCanvasRef.current.getHeight() / 2,
      width,
      height,
      fill: 'white',
      shadow: new fabric.Shadow({
        color: '#88A0EB',
        blur: 12,
      }),
      selectable: false,
      hoverCursor: 'default',
    })

    fabricCanvasRef.current.add(workingBoxRect)

    for (const [objectId, craftMotionObject] of canvasObjects) {
      fabric.util.enlivenObjects(
        [craftMotionObject.fabricObject],
        (enlivenObjects: fabric.Object[]): void => {
          for (const enlivenObject of enlivenObjects) {
            if (activeObjectRef.current?.objectId === objectId) {
              fabricCanvasRef.current?.setActiveObject(enlivenObject)
            }

            fabricCanvasRef.current?.add(enlivenObject)
          }
        },
        'fabric'
      )
    }

    fabricCanvasRef.current.renderAll()
  }
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

    if (currentDrawnShapeRef.current) {
      canvas.add(currentDrawnShapeRef.current.fabricObject)
    }
  }
}

export function handleCanvasWindowResize({
  fabricCanvasRef,
}: {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>
}): void {
  const canvasBoxElement = document.getElementById(CANVAS_BOX_ID)
  if (canvasBoxElement && fabricCanvasRef.current) {
    const nextWidth = canvasBoxElement.clientWidth
    const nextHeight = canvasBoxElement.clientHeight

    const scaleMultiplierX = nextWidth / fabricCanvasRef.current.getWidth()
    const scaleMultiplierY = nextHeight / fabricCanvasRef.current.getHeight()

    for (const canvasObject of fabricCanvasRef.current.getObjects()) {
      canvasObject.scaleX = canvasObject.scaleX ?? 0 * scaleMultiplierX
      canvasObject.scaleY = canvasObject.scaleY ?? 0 * scaleMultiplierY

      canvasObject.left = canvasObject.left ?? 0 * scaleMultiplierX
      canvasObject.top = canvasObject.top ?? 0 * scaleMultiplierY

      canvasObject.setCoords()
    }

    fabricCanvasRef.current.setDimensions({
      width: nextWidth,
      height: nextHeight,
    })

    fabricCanvasRef.current.calcOffset()
    fabricCanvasRef.current.renderAll()
  }
}
