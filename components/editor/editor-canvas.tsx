'use client'

export function EditorCanvas({
  canvasRef,
}: {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}) {
  return (
    <div
      id='canvas-box'
      className='flex h-full w-full flex-col items-center justify-center overflow-hidden'
    >
      <canvas ref={canvasRef} id='canvas' className='h-full w-full' />
    </div>
  )
}
