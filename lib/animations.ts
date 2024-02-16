import type { Canvas, IAnimationOptions } from 'fabric/fabric-impl'
import { fabric } from 'fabric'

import type { ExtendedFabricObject } from './codex/shape'
import { WORKING_BOX_ID } from './constants'

export const eases = ['linear', ...Object.keys(fabric.util.ease)]

export function runAnimations({
  fabricCanvasRef,
  duration,
  ease,
  setPlayingState,
  findAndSyncCraftMotionObjectInStorage,
}: {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>
  duration: number
  ease: string
  setPlayingState: (value: React.SetStateAction<boolean>) => void
  findAndSyncCraftMotionObjectInStorage: (
    fabricObject: ExtendedFabricObject
  ) => void
}): void {
  if (!fabricCanvasRef.current) {
    return
  }

  setPlayingState(true)

  const canvas = fabricCanvasRef.current
  const animations: Promise<void>[] = []

  for (const canvasObject of canvas.getObjects()) {
    const objectId = (canvasObject as ExtendedFabricObject).objectId
    if (objectId !== WORKING_BOX_ID) {
      const animation = new Promise<void>((resolve) => {
        const options: IAnimationOptions = {
          duration: duration * 1000, // milliseconds
          onChange: canvas.renderAll.bind(canvas),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          easing: ease === 'linear' ? undefined : fabric.util.ease[ease],
          onComplete: (): void => {
            if (canvasObject instanceof fabric.Rect) {
              canvasObject.angle = 0
            }
            findAndSyncCraftMotionObjectInStorage(
              canvasObject as ExtendedFabricObject
            )
            resolve()
          },
        }

        if (canvasObject instanceof fabric.Rect) {
          canvasObject.animate('angle', 360, options)
        } else if (canvasObject instanceof fabric.Circle) {
          canvasObject.animate('left', (canvasObject.left ?? 0) + 100, options)
        }
      })

      animations.push(animation)
    }
  }

  canvas.discardActiveObject()

  Promise.all(animations).finally(() => {
    setPlayingState(false)
  })
}
