import type { Canvas } from 'fabric/fabric-impl'

export function exportJSON({
  fabricCanvasRef,
  duration,
  ease,
}: {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>
  duration: number
  ease: string
}): Promise<void> {
  return new Promise<void>((resolve) => {
    if (!fabricCanvasRef.current) {
      resolve()
      return
    }

    const canvas = fabricCanvasRef.current
    const exportedCanvasJSON = canvas.toJSON(['objectId'])

    const craftMotionJSON = {
      version: '1.0.0',
      duration,
      ease,
      canvas: exportedCanvasJSON,
    }

    const blobContent = JSON.stringify(craftMotionJSON, null, 2)
    const blob = new Blob([blobContent], { type: 'application/json' })

    const objectURL = URL.createObjectURL(blob)

    const anchor = document.createElement('a')

    anchor.style.display = 'none'
    anchor.href = objectURL
    anchor.download = 'craft-motion-project.json'

    document.body.appendChild(anchor)

    anchor.addEventListener('click', (): void => {
      document.body.removeChild(anchor)

      resolve()
    })

    anchor.click()
  })
}
