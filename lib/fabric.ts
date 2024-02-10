import type { Canvas } from 'fabric/fabric-impl'
import { fabric } from 'fabric'

export function setupCanvas({
  targetCanvasRef,
}: {
  targetCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}): Canvas {
  const canvasElement =
    targetCanvasRef.current ?? document.getElementById('canvas')
  const canvas = new fabric.Canvas(targetCanvasRef.current, {
    width: canvasElement?.clientWidth ?? 0,
    height: canvasElement?.clientHeight ?? 0,
  })

  return canvas
}
