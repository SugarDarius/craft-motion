'use client'

import { ToggleColorMode } from '@/components/ui/toggle-color-mode'

import { useEditor } from './hooks/useEditor'

import { FileMenu } from './file-menu'
import { ProjectName } from './project-name'
import { ZoomInfo } from './zoom-info'
import { ExportMenu } from './export-menu'
import { LiveUsers } from './live-users'
import { SocialLinks } from './social-links'
import { InspectedOject } from './inspected-object'

import { EditorHeader } from './editor-header'
import { EditorControls } from './editor-controls'
import { EditorCanvas } from './editor-canvas'
import { EditorLayer } from './editor-layers'
import { EditorInspector } from './editor-inspector'
import { EditorFooter } from './editor-footer'

export function EditorView() {
  const {
    canvasRef,
    activeControl,
    onChangeActiveControl,
    canUndo,
    onUndo,
    canRedo,
    onRedo,
    canDelete,
    onDeleteObject,
    onDeleteObjectById,
    canDeleteAll,
    onDeleteAllObjects,
    onReCenter,
    activeObjectId,
    canvasObjects,
    onSelectObject,
    zoom,
    duration,
    onChangeDuration,
    ease,
    onSelectEase,
    inspectedObject,
    onEditedObject,
    isPlaying,
    onPlay,
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
            canDeleteAll={canDeleteAll}
            onDeleteAllObjects={onDeleteAllObjects}
          />
          <ProjectName />
        </div>
        <div className='flex w-full flex-row items-center justify-center'>
          <EditorControls
            canControl={!isPlaying}
            activeControl={activeControl}
            onChangeActiveControl={onChangeActiveControl}
            canUndo={canUndo}
            onUndo={onUndo}
            canRedo={canRedo}
            onRedo={onRedo}
            canDelete={canDelete}
            onDeleteObject={onDeleteObject}
            canDeleteAll={canDeleteAll}
            onDeleteAllObjects={onDeleteAllObjects}
            onReCenter={onReCenter}
          />
        </div>
        <div className='flex w-full flex-row items-center justify-end gap-4'>
          <ZoomInfo zoom={zoom} />
          <ExportMenu />
          <LiveUsers />
        </div>
      </EditorHeader>
      <div className='relative flex w-full flex-grow flex-col overflow-hidden'>
        <EditorLayer
          activeObjectId={activeObjectId}
          canvasObjects={canvasObjects}
          onLayerClick={onSelectObject}
          onLayerDelete={onDeleteObjectById}
          isDisabled={isPlaying}
        />
        <EditorCanvas
          canvasRef={canvasRef}
          canUndo={canUndo}
          onUndo={onUndo}
          canRedo={canRedo}
          onRedo={onRedo}
        />
        <EditorInspector
          isPlaying={isPlaying}
          duration={duration}
          onChangeDuration={onChangeDuration}
          ease={ease}
          onSelectEase={onSelectEase}
          onPlay={onPlay}
        >
          {inspectedObject ? (
            <InspectedOject
              inspectedObject={inspectedObject}
              onEditedObject={onEditedObject}
            />
          ) : null}
        </EditorInspector>
      </div>
      <EditorFooter>
        <ToggleColorMode />
        <SocialLinks />
      </EditorFooter>
    </div>
  )
}
