import type { Canvas, IEvent } from 'fabric/fabric-impl'
import { fabric } from 'fabric'

import type { ShapeType, CraftMotionObject } from './codex/shape'
import type { ActiveControl } from './codex/control'
import type { CanvasObjects } from './codex/liveblocks'

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
    selectionColor: 'rgba(136,160,235, 0.25)',
  })

  return canvas
}

export function renderCanvas({
  canvasObjects,
  fabricCanvasRef,
  activeObjectRef,
}: {
  canvasObjects: CanvasObjects
  fabricCanvasRef: React.MutableRefObject<Canvas | null>
  activeObjectRef: React.MutableRefObject<CraftMotionObject | null>
}): void {
  if (fabricCanvasRef.current) {
    fabricCanvasRef.current.clear()

    // @note: working box
    const width = Math.round(fabricCanvasRef.current.getWidth()) * 0.6
    const height = width / (16 / 9)

    const workingBoxRect = new fabric.Rect({
      name: 'Working box',
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

    for (const [objectId, canvasObject] of canvasObjects) {
      const fabricObjectData = canvasObject.fabricObjectData

      fabric.util.enlivenObjects(
        [fabricObjectData],
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

    // TODO: update based working box bounds
    currentDrawnShapeRef.current = createSpecificShape({
      type: currentSelectedShapeRef.current,
      pointer: pointer as PointerEvent,
    })

    if (currentDrawnShapeRef.current) {
      canvas.add(currentDrawnShapeRef.current.fabricObject)
    }
  }
}

export function handleCanvasMouseUp({
  canvas,
  isCurrentUserDrawing,
  currentDrawnShapeRef,
  currentSelectedShapeRef,
  activeObjectRef,
  syncCraftMotionObjectsInStorage,
  setActiveControl,
}: {
  canvas: Canvas
  isCurrentUserDrawing: React.MutableRefObject<boolean>
  currentDrawnShapeRef: React.MutableRefObject<CraftMotionObject | null>
  currentSelectedShapeRef: React.MutableRefObject<ShapeType | null>
  activeObjectRef: React.MutableRefObject<CraftMotionObject | null>
  syncCraftMotionObjectsInStorage: (
    craftMotionObject: CraftMotionObject | null
  ) => void
  setActiveControl: (value: React.SetStateAction<ActiveControl | null>) => void
}): void {
  isCurrentUserDrawing.current = false
  syncCraftMotionObjectsInStorage(currentDrawnShapeRef.current)

  currentDrawnShapeRef.current = null
  activeObjectRef.current = null
  currentSelectedShapeRef.current = null

  if (!canvas.isDrawingMode) {
    setActiveControl('select')
  }
}

export function handleCanvasMouseMove({
  options,
  canvas,
  isCurrentUserDrawing,
  currentDrawnShapeRef,
  currentSelectedShapeRef,
  syncCraftMotionObjectsInStorage,
}: {
  options: IEvent<MouseEvent>
  canvas: Canvas
  isCurrentUserDrawing: React.MutableRefObject<boolean>
  currentDrawnShapeRef: React.MutableRefObject<CraftMotionObject | null>
  currentSelectedShapeRef: React.MutableRefObject<ShapeType | null>
  syncCraftMotionObjectsInStorage: (
    craftMotionObject: CraftMotionObject | null
  ) => void
}): void {
  if (!isCurrentUserDrawing.current) {
    return
  }

  canvas.isDrawingMode = false
  const pointer = canvas.getPointer(options.e)

  switch (currentSelectedShapeRef.current) {
    case 'rectangle':
      if (currentDrawnShapeRef.current?.fabricObject instanceof fabric.Rect) {
        currentDrawnShapeRef.current?.fabricObject.set({
          width:
            pointer.x - (currentDrawnShapeRef.current?.fabricObject.left || 0),
          height:
            pointer.y - (currentDrawnShapeRef.current?.fabricObject.top || 0),
        })
      }
      break
    case 'circle':
      if (currentDrawnShapeRef.current?.fabricObject instanceof fabric.Circle) {
        currentDrawnShapeRef.current?.fabricObject.set({
          radius:
            Math.abs(
              pointer.x - (currentDrawnShapeRef.current?.fabricObject.left || 0)
            ) / 2,
        })
      }
      break
    default:
      break
  }

  canvas.renderAll()
  syncCraftMotionObjectsInStorage(currentDrawnShapeRef.current)
}

export function handleCanvasObjectMoving({
  options,
  canvas,
}: {
  options: IEvent
  canvas: Canvas
}): void {
  const target = options.target
  if (!target) {
    return
  }

  target.setCoords()
  // TODO: update based working box bounds
  target.left = Math.max(
    0,
    Math.min(
      target.left ?? 0,
      (canvas.width ?? 0) - (target.getScaledWidth() ?? target.width ?? 0)
    )
  )
  target.top = Math.max(
    0,
    Math.min(
      target.top ?? 0,
      (canvas.height ?? 0) - (target.getScaledHeight() ?? target.height ?? 0)
    )
  )
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

export function handleCanvasZoom({
  options,
  canvas,
}: {
  options: IEvent<WheelEvent>
  canvas: Canvas
}): void {
  const delta = options.e?.deltaY
  const canvasZoom = canvas.getZoom()

  const minZoom = 0.2 // min of 20% of zoom
  const maxZoom = 1.8 // max of 180% of zoom

  const zoomStep = 0.01

  const zoom = Math.min(
    Math.max(minZoom, canvasZoom + delta * zoomStep),
    maxZoom
  )

  canvas.zoomToPoint(
    { x: canvas.getWidth() / 2, y: canvas.getHeight() / 2 },
    zoom
  )

  options.e.preventDefault()
  options.e.stopPropagation()
}
