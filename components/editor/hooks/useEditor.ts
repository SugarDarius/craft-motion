import { useEffect, useRef } from 'react'
import type { Canvas } from 'fabric/fabric-impl'

import { useStorage } from '@/liveblocks.config'

import type { ShapeType, CraftMotionObject } from '@/lib/codex/shape'
import { setupCanvas, renderCanvas, handleCanvasMouseDown } from '@/lib/fabric'

type UseEditorReturnType = {
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export function useEditor(): UseEditorReturnType {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<Canvas | null>(null)

  const isCurrentUserDrawing = useRef<boolean>(false)
  const currentDrawnShapeRef = useRef<CraftMotionObject | null>(null)

  const currentSelectedShapeRef = useRef<ShapeType | null>(null)
  const activeObjectRef = useRef<CraftMotionObject | null>(null)

  // Extra type casting as Liveblocks' typing do not allow to use
  // own defined type definitions
  const canvasObjects = useStorage(
    (root) => root.craftMotionData.canvasObjects
  ) as unknown as Map<string, CraftMotionObject>

  useEffect(() => {
    const canvas = setupCanvas({ targetCanvasRef: canvasRef })
    fabricCanvasRef.current = canvas

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
    }
  }, [canvasRef])

  useEffect(() => {
    renderCanvas({
      canvasObjects,
      fabricCanvasRef,
      activeObjectRef,
    })
  }, [canvasObjects])

  return { canvasRef } as const
}
