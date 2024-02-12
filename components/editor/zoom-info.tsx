'use client'

export function ZoomInfo({ zoom }: { zoom: number }) {
  const percent = Math.round(zoom * 100)
  return (
    <div className='items center flex flex-row items-center gap-1'>
      <span className='text-md font-bold tracking-tight text-zinc-500'>
        {percent}%
      </span>
    </div>
  )
}
