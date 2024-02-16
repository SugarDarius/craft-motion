import type { Canvas } from 'fabric/fabric-impl'

import type {
  CraftMotionObject,
  ExtendedFabricObject,
  ShapeType,
} from './codex/shape'
import type { ActiveControl } from './codex/control'
import type { InspectedObject } from './codex/inspector'

import {
  handleCanvasMouseDown,
  handleCanvasMouseMove,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasObjectMoving,
  handleCanvasSelectionCreatedOrObjectScaled,
  handleCanvasZoom,
} from './factory'

export function listenOnCanvasEvents({
  fabricCanvasRef,
  isCurrentUserDrawing,
  currentDrawnShapeRef,
  currentSelectedShapeRef,
  setZoom,
  setActiveControl,
  setActiveObjectId,
  setInspectedObject,
  syncCraftMotionObjectsInStorage,
  findAndSyncCraftMotionObjectInStorage,
}: {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>
  isCurrentUserDrawing: React.MutableRefObject<boolean>
  currentDrawnShapeRef: React.MutableRefObject<CraftMotionObject | null>
  currentSelectedShapeRef: React.MutableRefObject<ShapeType | null>
  setZoom: (value: React.SetStateAction<number>) => void
  setActiveControl: (value: React.SetStateAction<ActiveControl | null>) => void
  setActiveObjectId: (value: React.SetStateAction<string | null>) => void
  setInspectedObject: (
    value: React.SetStateAction<InspectedObject | null>
  ) => void
  syncCraftMotionObjectsInStorage: (
    craftMotionObject: CraftMotionObject | null
  ) => void
  findAndSyncCraftMotionObjectInStorage: (
    fabricObject: ExtendedFabricObject
  ) => void
}): void {
  if (!fabricCanvasRef.current) {
    return
  }

  const canvas = fabricCanvasRef.current

  canvas.on('mouse:wheel', (options): void => {
    handleCanvasZoom({ options, canvas, setZoom })
  })

  canvas.on('mouse:down', (options): void => {
    handleCanvasMouseDown({
      options,
      canvas,
      isCurrentUserDrawing,
      currentDrawnShapeRef,
      currentSelectedShapeRef,
    })
  })

  canvas.on('mouse:up', (): void => {
    handleCanvasMouseUp({
      canvas,
      isCurrentUserDrawing,
      currentDrawnShapeRef,
      currentSelectedShapeRef,
      syncCraftMotionObjectsInStorage,
      setActiveControl,
    })
  })

  canvas.on('mouse:move', (options): void => {
    handleCanvasMouseMove({
      options,
      canvas,
      isCurrentUserDrawing,
      currentDrawnShapeRef,
      currentSelectedShapeRef,
      syncCraftMotionObjectsInStorage,
    })
  })

  canvas.on('object:moving', (options): void => {
    handleCanvasObjectMoving({
      options,
      canvas,
    })
  })

  canvas.on('object:modified', (options): void => {
    handleCanvasObjectModified({
      options,
      findAndSyncCraftMotionObjectInStorage,
    })
  })

  canvas.on('selection:created', (): void => {
    handleCanvasSelectionCreatedOrObjectScaled({
      canvas,
      setActiveObjectId,
      setInspectedObject,
    })
  })

  canvas.on('selection:updated', (): void => {
    handleCanvasSelectionCreatedOrObjectScaled({
      canvas,
      setActiveObjectId,
      setInspectedObject,
    })
  })

  canvas.on('selection:cleared', (): void => {
    setActiveObjectId(null)
    setInspectedObject(null)
  })

  canvas.on('object:scaling', (): void => {
    handleCanvasSelectionCreatedOrObjectScaled({
      canvas,
      setActiveObjectId,
      setInspectedObject,
    })
  })
}
