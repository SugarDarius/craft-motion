import { useEffect, useRef, useState } from 'react'
import useEvent from 'react-use-event-hook'
import type { Canvas } from 'fabric/fabric-impl'

import throttle from 'lodash/throttle'

import { useMutation, useStorage } from '@/liveblocks.config'
import type { ShapeType, CraftMotionObject } from '@/lib/codex/shape'
import type { ActiveControl } from '@/lib/codex/control'
import {
  setupCanvas,
  renderCanvas,
  handleCanvasWindowResize,
  handleCanvasZoom,
  handleCanvasMouseDown,
} from '@/lib/fabric'

type UseEditorReturnType = {
  canvasRef: React.RefObject<HTMLCanvasElement>
  onChangeActiveControl: (value: string) => void
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
          break
        case 'rectangle':
          setActiveControl('rectangle')
          currentSelectedShapeRef.current = 'rectangle'
          break
        case 'circle':
          setActiveControl('circle')
          currentSelectedShapeRef.current = 'circle'
          break
        default:
          throw new Error('unsupported active control value: ' + value)
      }
    }
  })

  // Extra type casting as Liveblocks' typing do not allow to use
  // own defined type definitions
  const canvasObjects = useStorage(
    (root) => root.craftMotionData.canvasObjects
  ) as unknown as Map<string, CraftMotionObject>

  const syncCraftMotionObjectsInStorage = useMutation(
    ({ storage }, craftMotionObject: CraftMotionObject | null): void => {
      if (!craftMotionObject) {
        return
      }

      const fabricObjectData = craftMotionObject.fabricObject.toJSON()
      const canvasObjects = storage.get('craftMotionData').get('canvasObjects')

      canvasObjects.set(
        craftMotionObject.objectId,
        JSON.parse(
          JSON.stringify({
            objectId: craftMotionObject.objectId,
            fabricObjectData: fabricObjectData,
            type: craftMotionObject.type,
          })
        )
      )
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

    return (): void => {
      canvas.dispose()
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [canvasRef])

  useEffect(() => {
    renderCanvas({
      canvasObjects,
      fabricCanvasRef,
      activeObjectRef,
    })
  }, [canvasObjects])

  return {
    canvasRef,
    onChangeActiveControl: handleChangeActiveControl,
  } as const
}
