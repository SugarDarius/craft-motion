import type { Canvas, IEvent } from 'fabric/fabric-impl'
import { fabric } from 'fabric'
import { nanoid } from 'nanoid'

import type {
  ShapeType,
  CraftMotionObject,
  ExtendedFabricObject,
} from './codex/shape'
import type { ActiveControl } from './codex/control'
import type {
  InspectedObject,
  EditedInspectedProperties,
} from './codex/inspector'
import type { CanvasObjects } from './codex/liveblocks'

import { getStringOrUndef } from './fabric-checkers'

import { createSpecificShape } from './shapes'
import { generateRandomHexColor } from './colors'

import { CANVAS_BOX_ID, WORKING_BOX_ID } from './constants'

export function setupCanvas({
  targetCanvasRef,
}: {
  targetCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}): Canvas {
  const canvasBoxElement = document.getElementById(CANVAS_BOX_ID)

  const canvas = new fabric.Canvas(targetCanvasRef.current, {
    width: canvasBoxElement?.clientWidth ?? 0,
    height: canvasBoxElement?.clientHeight ?? 0,
    selection: false,
  })

  return canvas
}

export function renderCanvas({
  canvasObjects,
  fabricCanvasRef,
  activeObjectIdRef,
}: {
  canvasObjects: CanvasObjects
  fabricCanvasRef: React.MutableRefObject<Canvas | null>
  activeObjectIdRef: React.MutableRefObject<string | null>
}): { workingBoxRect: fabric.Rect | null } {
  if (!fabricCanvasRef.current) {
    return { workingBoxRect: null }
  }

  fabricCanvasRef.current.clear()

  // @note: working box
  const workingBoxRect = new fabric.Rect({
    name: 'Working box',
    originX: 'center',
    originY: 'center',
    left: fabricCanvasRef.current.getWidth() / 2,
    top: fabricCanvasRef.current.getHeight() / 2,
    width: 1720,
    height: 1080,
    fill: '#fafafa',
    shadow: new fabric.Shadow({
      color: '#333333',
      blur: 4,
    }),
    selectable: false,
    hoverCursor: 'default',
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  workingBoxRect.set('objectId', WORKING_BOX_ID)

  fabricCanvasRef.current.add(workingBoxRect)

  for (const [objectId, canvasObject] of canvasObjects) {
    const fabricObjectData = canvasObject.fabricObjectData

    fabric.util.enlivenObjects(
      [fabricObjectData],
      (enlivenObjects: fabric.Object[]): void => {
        for (const enlivenObject of enlivenObjects) {
          if (activeObjectIdRef.current === objectId) {
            fabricCanvasRef.current?.setActiveObject(enlivenObject)
          }

          fabricCanvasRef.current?.add(enlivenObject)
        }
      },
      'fabric'
    )
  }

  fabricCanvasRef.current.renderAll()

  return { workingBoxRect }
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
  syncCraftMotionObjectsInStorage,
  setActiveControl,
}: {
  canvas: Canvas
  isCurrentUserDrawing: React.MutableRefObject<boolean>
  currentDrawnShapeRef: React.MutableRefObject<CraftMotionObject | null>
  currentSelectedShapeRef: React.MutableRefObject<ShapeType | null>
  syncCraftMotionObjectsInStorage: (
    craftMotionObject: CraftMotionObject | null
  ) => void
  setActiveControl: (value: React.SetStateAction<ActiveControl | null>) => void
}): void {
  if (
    isCurrentUserDrawing.current === true &&
    currentDrawnShapeRef.current !== null
  ) {
    isCurrentUserDrawing.current = false

    const allObjects = canvas.getObjects()
    const activeObject = canvas.getActiveObject()
    if (allObjects.length > 0 && activeObject === null) {
      canvas.setActiveObject(allObjects[allObjects.length - 1])
    }

    syncCraftMotionObjectsInStorage(currentDrawnShapeRef.current)

    currentDrawnShapeRef.current = null
    currentSelectedShapeRef.current = null
  }

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

export function handleCanvasObjectModified({
  options,
  findAndSyncCraftMotionObjectInStorage,
}: {
  options: IEvent
  findAndSyncCraftMotionObjectInStorage: (
    fabricObject: ExtendedFabricObject
  ) => void
}): void {
  const target = options.target
  if (!target) {
    return
  }

  if (target.type !== 'activeSelection') {
    findAndSyncCraftMotionObjectInStorage(target as ExtendedFabricObject)
  }
}

export function handleCanvasObjectMoving({
  canvas,
  setActiveObjectId,
  setInspectedObject,
}: {
  canvas: Canvas
  workingBoxRectRef: React.MutableRefObject<fabric.Rect | null>
  setActiveObjectId: (value: React.SetStateAction<string | null>) => void
  setInspectedObject: (
    value: React.SetStateAction<InspectedObject | null>
  ) => void
}): void {
  const activeObject = canvas.getActiveObject()
  if (activeObject) {
    const objectId = (activeObject as ExtendedFabricObject).objectId
    const fill = activeObject.fill?.toString() ?? ''

    activeObject.setCoords()
    // TODO: update based working box bounds
    activeObject.left = Math.max(
      0,
      Math.min(
        activeObject.left ?? 0,
        (canvas.width ?? 0) -
          (activeObject.getScaledWidth() ?? activeObject.width ?? 0)
      )
    )
    activeObject.top = Math.max(
      0,
      Math.min(
        activeObject.top ?? 0,
        (canvas.height ?? 0) -
          (activeObject.getScaledHeight() ?? activeObject.height ?? 0)
      )
    )

    if (activeObject instanceof fabric.Rect) {
      setInspectedObject({
        objectId,
        type: 'rectangle',
        width: activeObject.width ?? 0,
        height: activeObject.height ?? 0,
        fill,
        x: activeObject.left,
        y: activeObject.top,
      })
    } else if (activeObject instanceof fabric.Circle) {
      setInspectedObject({
        objectId,
        type: 'circle',
        radius: activeObject.radius ?? 0,
        fill,
        x: activeObject.left,
        y: activeObject.top,
      })
    }

    setActiveObjectId(objectId)
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
      canvasObject.width =
        (canvasObject.width ?? 0) * (canvasObject.scaleX ?? 0)
      canvasObject.height =
        (canvasObject.height ?? 0) * (canvasObject.scaleY ?? 0)

      canvasObject.scaleX = 1
      canvasObject.scaleY = 1

      canvasObject.left = (canvasObject.left ?? 0) * scaleMultiplierX
      canvasObject.top = (canvasObject.top ?? 0) * scaleMultiplierY

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

export function handleCanvasZoomAndScroll({
  options,
  canvas,
  setZoom,
}: {
  options: IEvent<WheelEvent>
  canvas: Canvas
  setZoom: (value: React.SetStateAction<number>) => void
}): void {
  options.e.preventDefault()
  options.e.stopPropagation()

  const delta = options.e.deltaY

  if (options.e.metaKey) {
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

    setZoom(zoom)
  } else if (options.e.altKey) {
    if (canvas.viewportTransform) {
      canvas.viewportTransform[4] = canvas.viewportTransform[4] + delta / 10
      canvas.renderAll()
    }
  } else {
    if (canvas.viewportTransform) {
      canvas.viewportTransform[5] = canvas.viewportTransform[5] + delta / 10
      canvas.renderAll()
    }
  }
}

export function handleDeleteCanvasObjectById({
  objectId,
  fabricCanvasRef,
  deleteCraftMotionObjectInStorage,
}: {
  objectId: string
  fabricCanvasRef: React.MutableRefObject<Canvas | null>
  deleteCraftMotionObjectInStorage: (objectId: string) => void
}): void {
  if (!fabricCanvasRef.current) {
    return
  }

  const canvas = fabricCanvasRef.current
  const allCanvasObjects = canvas.getObjects()

  const activeObject = canvas.getActiveObject()
  const activeObjectId =
    (activeObject as ExtendedFabricObject)?.objectId ?? null

  if (activeObjectId === objectId) {
    canvas.discardActiveObject()
  }

  // TODO: update time and space complexity here
  const correspondingCanvasObject = allCanvasObjects.find(
    (canvasObject) =>
      (canvasObject as ExtendedFabricObject).objectId === objectId
  )

  if (correspondingCanvasObject) {
    canvas.remove(correspondingCanvasObject)
    deleteCraftMotionObjectInStorage(objectId)
  }

  canvas.requestRenderAll()
}

export function handleDeleteAllCanvasObjects({
  fabricCanvasRef,
  deleteAllCraftMotionObjectsInStorage,
}: {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>
  deleteAllCraftMotionObjectsInStorage: () => void
}): void {
  if (!fabricCanvasRef.current) {
    return
  }

  const canvas = fabricCanvasRef.current
  canvas.clear()

  deleteAllCraftMotionObjectsInStorage()
}

export function handleCanvasSelectionCreatedOrObjectScaled({
  canvas,
  setActiveObjectId,
  setInspectedObject,
}: {
  canvas: Canvas
  setActiveObjectId: (value: React.SetStateAction<string | null>) => void
  setInspectedObject: (
    value: React.SetStateAction<InspectedObject | null>
  ) => void
}): void {
  const activeObject = canvas.getActiveObject()
  if (activeObject) {
    const objectId = (activeObject as ExtendedFabricObject).objectId
    const fill = activeObject.fill?.toString() ?? ''

    const scaleX = activeObject.scaleX ?? 0
    const scaleY = activeObject.scaleY ?? 0

    const x = activeObject.left ?? 0
    const y = activeObject.top ?? 0

    if (activeObject instanceof fabric.Rect) {
      const scaledWidth = scaleX
        ? (activeObject.width ?? 0) * scaleX
        : activeObject.width ?? 0

      const scaledHeight = scaleY
        ? (activeObject.height ?? 0) * scaleY
        : activeObject.height ?? 0

      setInspectedObject({
        objectId,
        type: 'rectangle',
        width: scaledWidth,
        height: scaledHeight,
        fill,
        x,
        y,
      })
    } else if (activeObject instanceof fabric.Circle) {
      const radius =
        (activeObject.radius ?? 0) * activeObject.getObjectScaling().scaleX

      setInspectedObject({
        objectId,
        type: 'circle',
        radius,
        fill,
        x,
        y,
      })
    }

    setActiveObjectId(objectId)
  }
}

export function handleCanvasEditedObject({
  fabricCanvasRef,
  editedInspectedProperties,
  setActiveObjectId,
  setInspectedObject,
  findAndSyncCraftMotionObjectInStorage,
}: {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>
  editedInspectedProperties: EditedInspectedProperties
  setActiveObjectId: (value: React.SetStateAction<string | null>) => void
  setInspectedObject: (
    value: React.SetStateAction<InspectedObject | null>
  ) => void
  findAndSyncCraftMotionObjectInStorage: (
    fabricObject: ExtendedFabricObject
  ) => void
}): void {
  if (!fabricCanvasRef.current) {
    return
  }

  const canvas = fabricCanvasRef.current
  const activeObject = canvas.getActiveObject()

  if (!activeObject) {
    return
  }

  const objectId = (activeObject as ExtendedFabricObject).objectId
  if (objectId !== editedInspectedProperties.objectId) {
    // @note we should throw an error here
    return
  }

  if (
    activeObject instanceof fabric.Rect &&
    editedInspectedProperties.type === 'rectangle'
  ) {
    activeObject.set('scaleX', 1)
    activeObject.set('width', editedInspectedProperties.width)

    activeObject.set('scaleY', 1)
    activeObject.set('height', editedInspectedProperties.height)
  } else if (
    activeObject instanceof fabric.Circle &&
    editedInspectedProperties.type === 'circle'
  ) {
    activeObject.set('scaleX', 1)
    activeObject.set('scaleY', 1)
    activeObject.setRadius(editedInspectedProperties.radius)
  }

  activeObject.set('left', editedInspectedProperties.x)
  activeObject.set('top', editedInspectedProperties.y)
  activeObject.set('fill', editedInspectedProperties.fill)

  setActiveObjectId(objectId)
  setInspectedObject(editedInspectedProperties)
  findAndSyncCraftMotionObjectInStorage(activeObject as ExtendedFabricObject)
}

export function handleReCenterCanvas({
  fabricCanvasRef,
  setZoom,
}: {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>
  setZoom: (value: React.SetStateAction<number>) => void
}): void {
  if (!fabricCanvasRef.current) {
    return
  }

  const canvas = fabricCanvasRef.current

  canvas.viewportTransform = [1, 0, 0, 1, 0, 0]
  canvas.renderAll()

  setZoom(1)
}

export function handleSelectCanvasObject({
  fabricCanvasRef,
  targetObjectId,
  setActiveObjectId,
}: {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>
  targetObjectId: string
  setActiveObjectId: (value: React.SetStateAction<string | null>) => void
}): void {
  if (!fabricCanvasRef.current) {
    return
  }

  const canvas = fabricCanvasRef.current
  const canvasObjects = canvas.getObjects()
  const objectToSelect = canvasObjects.find(
    (canvasObject): boolean =>
      (canvasObject as ExtendedFabricObject).objectId === targetObjectId
  )

  if (objectToSelect) {
    canvas.setActiveObject(objectToSelect)
    setActiveObjectId((objectToSelect as ExtendedFabricObject).objectId)

    fabricCanvasRef.current.requestRenderAll()
  }
}

export function handleDiscardSelectedCanvasObject({
  fabricCanvasRef,
}: {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>
}): void {
  if (!fabricCanvasRef.current) {
    return
  }

  const canvas = fabricCanvasRef.current
  canvas.discardActiveObject()
  canvas.requestRenderAll()
}

export function handleCopyCanvasObject({
  fabricCanvasRef,
}: {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>
}): Promise<void> {
  if (!fabricCanvasRef.current) {
    return Promise.resolve()
  }

  const canvas = fabricCanvasRef.current
  const activeObject = canvas.getActiveObject()
  if (!activeObject) {
    return Promise.resolve()
  }

  return navigator.clipboard.writeText(
    JSON.stringify(activeObject.toJSON(['objectId']))
  )
}

export async function handlePasteCanvasObjects({
  fabricCanvasRef,
  syncCraftMotionObjectsInStorage,
}: {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>
  syncCraftMotionObjectsInStorage: (
    craftMotionObject: CraftMotionObject | null
  ) => void
}): Promise<boolean> {
  if (!fabricCanvasRef.current) {
    return false
  }

  try {
    const data = await navigator.clipboard.readText()
    if (!data) {
      return false
    }

    const canvas = fabricCanvasRef.current
    const canvasObjectJSON = JSON.parse(data)

    const version = getStringOrUndef(canvasObjectJSON, 'version')
    const objectId = getStringOrUndef(canvasObjectJSON, 'objectId')

    // Clipboard data isn't a fabric object
    // Pretty low as checker for now
    if (!version || !objectId) {
      return false
    }

    fabric.util.enlivenObjects(
      [canvasObjectJSON],
      (enlivenObjects: fabric.Object[]): void => {
        for (const enlivenObject of enlivenObjects) {
          const objectId = nanoid(16)

          enlivenObject.left = (enlivenObject.left ?? 0) + 100
          enlivenObject.top = (enlivenObject.top ?? 0) + 100
          enlivenObject.fill = generateRandomHexColor()

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          enlivenObject.set('objectId', objectId)

          const isRect = enlivenObject instanceof fabric.Rect

          canvas.add(enlivenObject)
          canvas.setActiveObject(enlivenObject)
          syncCraftMotionObjectsInStorage({
            objectId,
            type: isRect ? 'rectangle' : 'circle',
            fabricObject: enlivenObject as ExtendedFabricObject,
          })
        }
      },
      'fabric'
    )

    canvas.renderAll()
    return true
  } catch {
    return false
  }
}
