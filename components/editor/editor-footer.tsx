'use client'

export function EditorFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className='absolute bottom-6 right-6 flex flex-row items-center gap-2'>
      {children}
    </div>
  )
}
