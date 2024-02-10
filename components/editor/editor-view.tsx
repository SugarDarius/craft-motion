'use client'

import { FileMenu } from './file-menu'
import { ProjectName } from './project-name'
import { EditorHeader } from './editor-header'

export function EditorView() {
  return (
    <div className='flex h-full w-full flex-row'>
      <EditorHeader>
        <div className='flex flex-row items-center gap-4'>
          <FileMenu />
          <ProjectName />
        </div>
      </EditorHeader>
    </div>
  )
}
