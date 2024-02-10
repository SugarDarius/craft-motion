'use client'

import { FileMenu } from './file-menu'
import { ProjectName } from './project-name'
import { ExportMenu } from './export-menu'

import { EditorHeader } from './editor-header'
import { EditorCanvas } from './editor-canvas'

export function EditorView() {
  return (
    <div className='relative flex h-full w-full flex-col'>
      <EditorHeader>
        <div className='flex flex-row items-center gap-4'>
          <FileMenu />
          <ProjectName />
        </div>
        <div className='flex flex-row items-center gap-4'>
          <ExportMenu />
        </div>
      </EditorHeader>
      <div className='relative flex w-full flex-grow flex-col overflow-hidden'>
        <EditorCanvas />
      </div>
    </div>
  )
}
