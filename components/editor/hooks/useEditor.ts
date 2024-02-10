import { useEffect, useRef } from 'react'
import { setupCanvas } from '@/lib/fabric'

type UseEditorReturnType = {
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export function useEditor(): UseEditorReturnType {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = setupCanvas({ targetCanvasRef: canvasRef })

    return (): void => {
      canvas.dispose()
    }
  }, [])

  return { canvasRef } as const
}
