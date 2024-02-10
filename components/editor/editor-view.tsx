'use client'

import { FileMenu } from './file-menu'
import { ProjectName } from './project-name'
import { ExportMenu } from './export-menu'
import { EditorHeader } from './editor-header'

export function EditorView() {
  return (
    <div className='flex h-full w-full flex-row'>
      <EditorHeader>
        <div className='flex flex-row items-center gap-4'>
          <FileMenu />
          <ProjectName />
        </div>
        <div className='flex flex-row items-center gap-4'>
          <ExportMenu />
        </div>
      </EditorHeader>
    </div>
  )
}
