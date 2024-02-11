import { useEffect, useRef, useState } from 'react'
import useEvent from 'react-use-event-hook'
import { JsonObject } from '@liveblocks/client'
import type { Canvas } from 'fabric/fabric-impl'

import throttle from 'lodash/throttle'

import {
  useCanUndo,
  useMutation,
  useStorage,
  useUndo,
} from '@/liveblocks.config'
import type { ShapeType, CraftMotionObject } from '@/lib/codex/shape'
import type { ActiveControl } from '@/lib/codex/control'
import {
  setupCanvas,
  renderCanvas,
  handleCanvasWindowResize,
  handleCanvasZoom,
  handleCanvasMouseDown,
  handleCanvasMouseUp,
} from '@/lib/fabric'

type UseEditorReturnType = {
  canvasRef: React.RefObject<HTMLCanvasElement>
  activeControl: ActiveControl | null
  onChangeActiveControl: (value: string) => void
  canUndo: boolean
  onUndo: () => void
}

export function useEditor(): UseEditorReturnType {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<Canvas | null>(null)

  const isCurrentUserDrawing = useRef<boolean>(false)
  const currentDrawnShapeRef = useRef<CraftMotionObject | null>(null)

  const currentSelectedShapeRef = useRef<ShapeType | null>(null)
  const activeObjectRef = useRef<CraftMotionObject | null>(null)

  const [activeControl, setActiveControl] = useState<ActiveControl | null>(null)

  const handleChangeActiveControl = useEvent((value: string) => {
    if (!value) {
      setActiveControl(null)
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
  const undo = useUndo()
  const canUndo = useCanUndo()

  const syncCraftMotionObjectsInStorage = useMutation(
    ({ storage }, craftMotionObject: CraftMotionObject | null): void => {
      if (!craftMotionObject) {
        return
      }

      const fabricObjectData = craftMotionObject.fabricObject.toJSON()
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

  useEffect(() => {
    const canvas = setupCanvas({ targetCanvasRef: canvasRef })
    fabricCanvasRef.current = canvas

    const handleWindowResize = throttle((): void => {
      handleCanvasWindowResize({ fabricCanvasRef })
    }, 200)
    window.addEventListener('resize', handleWindowResize)

    canvas.on('mouse:wheel', (options): void => {
      handleCanvasZoom({ options, canvas })
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
        activeObjectRef,
        syncCraftMotionObjectsInStorage,
        setActiveControl,
      })
    })

    return (): void => {
      canvas.dispose()
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [canvasRef, syncCraftMotionObjectsInStorage])

  useEffect(() => {
    renderCanvas({
      canvasObjects,
      fabricCanvasRef,
      activeObjectRef,
    })
  }, [canvasObjects])

  return {
    canvasRef,
    activeControl,
    onChangeActiveControl: handleChangeActiveControl,
    canUndo,
    onUndo: undo,
  } as const
}
