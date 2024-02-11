'use client'

import { useEditor } from './hooks/useEditor'

import { FileMenu } from './file-menu'
import { ProjectName } from './project-name'
import { ExportMenu } from './export-menu'
import { LiveUsers } from './live-users'

import { EditorHeader } from './editor-header'
import { EditorControls } from './editor-controls'
import { EditorCanvas } from './editor-canvas'

export function EditorView() {
  const {
    canvasRef,
    activeControl,
    onChangeActiveControl,
    canUndo,
    onUndo,
    canRedo,
    onRedo,
  } = useEditor()

  return (
    <div className='relative flex h-full w-full flex-col'>
      <EditorHeader>
        <div className='flex w-full flex-row items-center gap-4'>
          <FileMenu
            canUndo={canUndo}
            onUndo={onUndo}
            canRedo={canRedo}
            onRedo={onRedo}
          />
          <ProjectName />
        </div>
        <div className='flex w-full flex-row items-center justify-center'>
          <EditorControls
            activeControl={activeControl}
            onChangeActiveControl={onChangeActiveControl}
            canUndo={canUndo}
            onUndo={onUndo}
            canRedo={canRedo}
            onRedo={onRedo}
          />
        </div>
        <div className='flex w-full flex-row items-center justify-end gap-4'>
          <LiveUsers />
          <ExportMenu />
        </div>
      </EditorHeader>
      <div className='relative flex w-full flex-grow flex-col overflow-hidden'>
        <EditorCanvas canvasRef={canvasRef} />
      </div>
    </div>
  )
}
