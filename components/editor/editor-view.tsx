'use client'

import { FileMenu } from './file-menu'
import { EditorHeader } from './editor-header'

export function EditorView() {
  return (
    <div className='flex h-full w-full flex-row'>
      <EditorHeader>
        <div className='flex flex-row items-center gap-2'>
          <FileMenu />
        </div>
      </EditorHeader>
    </div>
  )
}
