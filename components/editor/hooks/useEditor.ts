import { useEffect, useRef, useState } from 'react'

import useEvent from 'react-use-event-hook'
import { useHotkeys } from 'react-hotkeys-hook'

import { JsonObject } from '@liveblocks/client'
import type { Canvas } from 'fabric/fabric-impl'

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
  handleCanvasZoom,
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasMouseMove,
  handleCanvasObjectMoving,
  handleCanvasObjectModified,
  handleDeleteCanvasObjectById,
  handleDeleteAllCanvasObjects,
  handleCanvasSelectionCreatedOrObjectScaled,
  handleCanvasEditedObject,
} from '@/lib/factory'

type UseEditorReturnType = {
  canvasRef: React.RefObject<HTMLCanvasElement>
  activeControl: ActiveControl | null
  onChangeActiveControl: (value: string) => void
  canUndo: boolean
  onUndo: () => void
  canRedo: boolean
  onRedo: () => void
  canDelete: boolean
  onDeleteObject: () => void
  onDeleteObjectById: (objectId: string) => void
  canDeleteAll: boolean
  onDeleteAllObjects: () => void
  activeObjectId: string | null
  canvasObjects: CanvasObjects
  onSelectObject: (objectId: string) => void
  zoom: number
  duration: number
  onChangeDuration: (duration: number) => void
  ease: string
  onSelectEase: (ease: string) => void
  inspectedObject: InspectedObject | null
  onEditedObject: (editedInspectedProperties: EditedInspectedProperties) => void
  isPlaying: boolean
  onPlay: () => void
}

export function useEditor(): UseEditorReturnType {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<Canvas | null>(null)

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

  const [duration, setDuration] = useState<number>(1)
  const [ease, setEase] = useState<string>('linear')
  const [isPlaying, setPlayingState] = useState<boolean>(false)

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

  const handleSelectObject = useEvent((objectId: string) => {
    if (fabricCanvasRef.current) {
      const canvasObjects = fabricCanvasRef.current.getObjects()
      const objectToSelect = canvasObjects.find(
        (canvasObject): boolean =>
          (canvasObject as ExtendedFabricObject).objectId === objectId
      )

      if (objectToSelect) {
        fabricCanvasRef.current.setActiveObject(objectToSelect)
        setActiveObjectId((objectToSelect as ExtendedFabricObject).objectId)

        fabricCanvasRef.current.requestRenderAll()
      }
    }
  })

  const handleEditedObject = useEvent(
    (editedInspectedProperties: EditedInspectedProperties): void => {
      handleCanvasEditedObject({
        fabricCanvasRef,
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
    }
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

  useEffect(() => {
    const canvas = setupCanvas({ targetCanvasRef: canvasRef })
    // We need to be able to work on the canvas outside this side effect
    fabricCanvasRef.current = canvas

    const handleWindowResize = throttle((): void => {
      handleCanvasWindowResize({ fabricCanvasRef })
    }, 200)
    window.addEventListener('resize', handleWindowResize)

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

    return (): void => {
      canvas.dispose()
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [
    canvasRef,
    syncCraftMotionObjectsInStorage,
    findAndSyncCraftMotionObjectInStorage,
  ])

  useEffect(() => {
    renderCanvas({
      canvasObjects,
      fabricCanvasRef,
      activeObjectIdRef,
    })
  }, [canvasObjects])

  const canDelete = canvasObjects.size > 0 && activeObjectId !== null
  const canDeleteAll = canvasObjects.size > 0

  return {
    canvasRef,
    activeControl,
    onChangeActiveControl: handleChangeActiveControl,
    canUndo,
    onUndo: undo,
    canRedo,
    onRedo: redo,
    canDelete,
    onDeleteObject: handleDeleteObject,
    onDeleteObjectById: handleDeleteObjectById,
    canDeleteAll,
    onDeleteAllObjects: handleDeleteAllObjects,
    activeObjectId,
    canvasObjects,
    onSelectObject: handleSelectObject,
    zoom,
    duration,
    onChangeDuration: handleChangeDuration,
    ease,
    onSelectEase: handleSelectEase,
    inspectedObject,
    onEditedObject: handleEditedObject,
    isPlaying,
    onPlay: handlePlay,
  } as const
}
