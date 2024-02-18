import { useEffect, useRef, useState } from 'react'

import useEvent from 'react-use-event-hook'
import { useHotkeys } from 'react-hotkeys-hook'

import { JsonObject } from '@liveblocks/client'
import type { Canvas, Rect } from 'fabric/fabric-impl'

import throttle from 'lodash/throttle'

import {
  useCanRedo,
  useCanUndo,
  useMutation,
  useRedo,
  useStorage,
  useUndo,
} from '@/liveblocks.config'

import type {
  ShapeType,
  CraftMotionObject,
  ExtendedFabricObject,
} from '@/lib/codex/shape'
import type { ActiveControl } from '@/lib/codex/control'
import type {
  InspectedObject,
  EditedInspectedProperties,
} from '@/lib/codex/inspector'
import type { CanvasObjects } from '@/lib/codex/liveblocks'

import {
  setupCanvas,
  renderCanvas,
  handleCanvasWindowResize,
  handleDeleteCanvasObjectById,
  handleDeleteAllCanvasObjects,
  handleCanvasEditedObject,
  handleReCenterCanvas,
  handleCopyCanvasObject,
  handlePasteCanvasObjects,
  handleSelectCanvasObject,
  handleDiscardSelectedCanvasObject,
  handleCanvasResetZoom,
} from '@/lib/factory'
import { listenOnCanvasEvents } from '@/lib/canvas-event-listener'
import { listenOnClipboardEvents } from '@/lib/clipboard-event-listener'
import { runAnimations } from '@/lib/animations'
import { exportJSON } from '@/lib/export'

import { useToast } from '@/components/ui/use-toast'

type UseEditorReturnType = {
  canvasRef: React.RefObject<HTMLCanvasElement>
  activeControl: ActiveControl | null
  onChangeActiveControl: (value: string) => void
  canUndo: boolean
  onUndo: () => void
  canRedo: boolean
  onRedo: () => void
  onCopyObject: () => void
  onPasteObject: () => void
  canPaste: boolean
  canDelete: boolean
  onDeleteObject: () => void
  onDeleteObjectById: (objectId: string) => void
  canDeleteAll: boolean
  onDeleteAllObjects: () => void
  onReCenter: () => void
  activeObjectId: string | null
  canvasObjects: CanvasObjects
  onSelectObject: (objectId: string) => void
  zoom: number
  onResetZoom: () => void
  duration: number
  onChangeDuration: (duration: number) => void
  ease: string
  onSelectEase: (ease: string) => void
  inspectedObject: InspectedObject | null
  onEditedObject: (editedInspectedProperties: EditedInspectedProperties) => void
  canPlay: boolean
  isPlaying: boolean
  onPlay: () => void
  canExport: boolean
  onExportJSON: () => void
}

export function useEditor(): UseEditorReturnType {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<Canvas | null>(null)
  const workingBoxRectRef = useRef<Rect | null>(null)

  const isCurrentUserDrawing = useRef<boolean>(false)
  const currentDrawnShapeRef = useRef<CraftMotionObject | null>(null)

  const currentSelectedShapeRef = useRef<ShapeType | null>(null)

  const [activeObjectId, setActiveObjectId] = useState<string | null>(null)
  const activeObjectIdRef = useRef<string | null>(null)
  activeObjectIdRef.current = activeObjectId

  const [activeControl, setActiveControl] = useState<ActiveControl | null>(
    'select'
  )

  const [zoom, setZoom] = useState<number>(1)

  const [inspectedObject, setInspectedObject] =
    useState<InspectedObject | null>(null)

  const [canPaste, setCanPasteState] = useState<boolean>(false)

  const [duration, setDuration] = useState<number>(1)
  const [ease, setEase] = useState<string>('linear')
  const [isPlaying, setPlayingState] = useState<boolean>(false)

  const { toast } = useToast()

  const handleChangeActiveControl = useEvent((value: string) => {
    if (!value) {
      setActiveControl(null)
      setActiveObjectId(null)
      fabricCanvasRef.current?.discardActiveObject().renderAll()
    } else {
      switch (value) {
        case 'select':
          setActiveControl('select')
          currentSelectedShapeRef.current = null
          break
        case 'rectangle':
          currentSelectedShapeRef.current = 'rectangle'
          setActiveControl('rectangle')
          break
        case 'circle':
          currentSelectedShapeRef.current = 'circle'
          setActiveControl('circle')
          break
        default:
          throw new Error('unsupported active control value: ' + value)
      }
    }
  })

  const canvasObjects = useStorage((root) => root.craftMotionData.canvasObjects)

  const canUndo = useCanUndo()
  const undo = useUndo()

  const canRedo = useCanRedo()
  const redo = useRedo()

  const deleteCraftMotionObjectInStorage = useMutation(
    ({ storage }, objectId: string): void => {
      const canvasObjects = storage.get('craftMotionData').get('canvasObjects')
      canvasObjects.delete(objectId)
    },
    []
  )

  const deleteAllCraftMotionObjectsInStorage = useMutation(
    ({ storage }): void => {
      const canvasObjects = storage.get('craftMotionData').get('canvasObjects')
      if (canvasObjects.size > 0) {
        for (const objectId of canvasObjects.keys()) {
          canvasObjects.delete(objectId)
        }
      }
    },
    []
  )

  const syncCraftMotionObjectsInStorage = useMutation(
    ({ storage }, craftMotionObject: CraftMotionObject | null): void => {
      if (!craftMotionObject) {
        return
      }

      const fabricObjectData = craftMotionObject.fabricObject.toJSON([
        'objectId',
      ])
      const canvasObjects = storage.get('craftMotionData').get('canvasObjects')

      canvasObjects.set(craftMotionObject.objectId, {
        objectId: craftMotionObject.objectId,
        type: craftMotionObject.type,
        // Make Liveblocks happy. A bit a shame this typing to serialize
        fabricObjectData: fabricObjectData as unknown as JsonObject,
      })
    },
    []
  )

  const findAndSyncCraftMotionObjectInStorage = useEvent(
    (fabricObject: ExtendedFabricObject): void => {
      if (!fabricObject.objectId) {
        return
      }

      const craftMotionObject = canvasObjects.get(fabricObject.objectId)
      if (craftMotionObject) {
        const updatedCraftMotionObject: CraftMotionObject = {
          objectId: craftMotionObject.objectId,
          type: craftMotionObject.type,
          fabricObject,
        }

        syncCraftMotionObjectsInStorage(updatedCraftMotionObject)
      }
    }
  )

  const handleDeleteObject = useEvent((): void => {
    if (activeObjectId !== null) {
      handleDeleteCanvasObjectById({
        objectId: activeObjectId,
        fabricCanvasRef,
        deleteCraftMotionObjectInStorage,
      })
    }
  })

  const handleDeleteObjectById = useEvent((objectId: string): void => {
    handleDeleteCanvasObjectById({
      objectId,
      fabricCanvasRef,
      deleteCraftMotionObjectInStorage,
    })
  })

  const handleDeleteAllObjects = useEvent((): void => {
    handleDeleteAllCanvasObjects({
      fabricCanvasRef,
      deleteAllCraftMotionObjectsInStorage,
    })
  })

  const handleReCenter = useEvent((): void => {
    handleReCenterCanvas({ fabricCanvasRef, setZoom })
  })

  const handleResetZoom = useEvent((): void => {
    handleCanvasResetZoom({ fabricCanvasRef, setZoom })
  })

  const handleSelectObject = useEvent((objectId: string) => {
    handleSelectCanvasObject({
      fabricCanvasRef,
      targetObjectId: objectId,
      setActiveObjectId,
    })
  })

  const handleEditedObject = useEvent(
    (editedInspectedProperties: EditedInspectedProperties): void => {
      handleCanvasEditedObject({
        fabricCanvasRef,
        workingBoxRectRef,
        editedInspectedProperties,
        setActiveObjectId,
        setInspectedObject,
        findAndSyncCraftMotionObjectInStorage,
      })
    }
  )

  const handleChangeDuration = useEvent((duration: number): void => {
    setDuration(duration)
  })

  const handleSelectEase = useEvent((ease: string): void => {
    setEase(ease)
  })

  const handlePlay = useEvent((): void => {
    if (!isPlaying) {
      runAnimations({
        fabricCanvasRef,
        duration,
        ease,
        setPlayingState,
        findAndSyncCraftMotionObjectInStorage,
      })
    }
  })

  const handleExportJSON = useEvent((): void => {
    exportJSON({ fabricCanvasRef, duration, ease }).then((): void => {
      toast({
        title: 'You export JSON is ready!',
        description: 'The exported file is currently downloading...',
      })
    })
  })

  const handleCopy = useEvent((dispatchEvent: boolean = true): void => {
    handleCopyCanvasObject({ fabricCanvasRef }).then((): void => {
      toast({ description: 'Copied to clipboard!' })
      if (dispatchEvent) {
        window.dispatchEvent(new Event('copy'))
      }
    })
  })

  const handlePaste = useEvent((): void => {
    handlePasteCanvasObjects({
      fabricCanvasRef,
      syncCraftMotionObjectsInStorage,
    }).then((pasted: boolean): void => {
      if (pasted) {
        toast({ description: 'Pasted from clipboard!' })
      }
    })
  })

  const handleDiscardSelectedObject = useEvent((): void => {
    handleDiscardSelectedCanvasObject({ fabricCanvasRef })
  })

  useHotkeys('mod+z', () => undo(), { enabled: canUndo })
  useHotkeys('shift+mod+z', () => redo(), { enabled: canRedo })
  useHotkeys('backspace', () => handleDeleteObject(), {
    enabled: activeObjectId !== null,
  })
  useHotkeys(
    'mod+1',
    (e) => {
      e.preventDefault()
      handleChangeActiveControl('select')
    },
    []
  )
  useHotkeys(
    'mod+2',
    (e) => {
      e.preventDefault()
      handleChangeActiveControl('rectangle')
    },
    []
  )
  useHotkeys(
    'mod+3',
    (e) => {
      e.preventDefault()
      handleChangeActiveControl('circle')
    },
    []
  )
  useHotkeys('escape', () => handleDiscardSelectedObject(), {
    enabled: activeObjectId !== null,
  })
  useHotkeys('mod+c', () => handleCopy(false), {
    enabled: activeObjectId !== null,
  })
  useHotkeys('mod+v', () => handlePaste(), { enabled: canPaste && !isPlaying })
  useHotkeys('space', () => handlePlay(), { enabled: canvasObjects.size > 0 })

  useEffect(() => {
    fabricCanvasRef.current = setupCanvas({ targetCanvasRef: canvasRef })

    const handleWindowResize = throttle((): void => {
      handleCanvasWindowResize({ fabricCanvasRef })
    }, 200)

    window.addEventListener('resize', handleWindowResize)

    listenOnCanvasEvents({
      fabricCanvasRef,
      isCurrentUserDrawing,
      currentDrawnShapeRef,
      currentSelectedShapeRef,
      workingBoxRectRef,
      setZoom,
      setActiveControl,
      setActiveObjectId,
      setInspectedObject,
      syncCraftMotionObjectsInStorage,
      findAndSyncCraftMotionObjectInStorage,
    })

    const disposeClipboardListener = listenOnClipboardEvents({
      setCanPaste: setCanPasteState,
    })

    return (): void => {
      fabricCanvasRef.current?.dispose()
      fabricCanvasRef.current = null

      window.removeEventListener('resize', handleWindowResize)
      disposeClipboardListener()
    }
  }, [
    canvasRef,
    syncCraftMotionObjectsInStorage,
    findAndSyncCraftMotionObjectInStorage,
  ])

  useEffect(() => {
    // Note: it would be better with a waiting promise
    // to redraw once a playing has finished
    if (!isPlaying) {
      const { workingBoxRect } = renderCanvas({
        canvasObjects,
        fabricCanvasRef,
        activeObjectIdRef,
      })
      workingBoxRectRef.current = workingBoxRect
    }
  }, [canvasObjects, isPlaying])

  const canDelete =
    canvasObjects.size > 0 && activeObjectId !== null && !isPlaying
  const canDeleteAllOrExport = canvasObjects.size > 0 && !isPlaying
  const canPlay = canvasObjects.size > 0

  return {
    canvasRef,
    activeControl,
    onChangeActiveControl: handleChangeActiveControl,
    canUndo: canUndo && !isPlaying,
    onUndo: undo,
    canRedo: canRedo && !isPlaying,
    onRedo: redo,
    onCopyObject: handleCopy,
    canPaste: canPaste && !isPlaying,
    onPasteObject: handlePaste,
    canDelete,
    onDeleteObject: handleDeleteObject,
    onDeleteObjectById: handleDeleteObjectById,
    canDeleteAll: canDeleteAllOrExport,
    onDeleteAllObjects: handleDeleteAllObjects,
    onReCenter: handleReCenter,
    activeObjectId,
    canvasObjects,
    onSelectObject: handleSelectObject,
    zoom,
    onResetZoom: handleResetZoom,
    duration,
    onChangeDuration: handleChangeDuration,
    ease,
    onSelectEase: handleSelectEase,
    inspectedObject,
    onEditedObject: handleEditedObject,
    canPlay,
    isPlaying,
    onPlay: handlePlay,
    canExport: canDeleteAllOrExport,
    onExportJSON: handleExportJSON,
  } as const
}
