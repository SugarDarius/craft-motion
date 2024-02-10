import { useEffect, useRef } from 'react'
import { Canvas } from 'fabric/fabric-impl'

import { setupCanvas } from '@/lib/fabric'

type UseEditorReturnType = {
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export function useEditor(): UseEditorReturnType {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<Canvas | null>(null)

  useEffect(() => {
    const canvas = setupCanvas({ targetCanvasRef: canvasRef })
    fabricCanvasRef.current = canvas

    return (): void => {
      canvas.dispose()
    }
  }, [])

  return { canvasRef } as const
}
