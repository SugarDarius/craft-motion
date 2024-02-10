'use client'

export function EditorCanvas() {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center overflow-hidden'>
      <canvas id='canvas' className='h-full w-full' />
    </div>
  )
}
