import { getStringOrUndef } from './fabric-json-checkers'

type DisposeFn = () => void
export function listenOnClipboardEvents({
  setCanPaste,
}: {
  setCanPaste: (value: React.SetStateAction<boolean>) => void
}): DisposeFn {
  const handleClipboardCopy = (): void => {
    const checkClipboardData = async (): Promise<boolean> => {
      const data = await navigator.clipboard.readText()
      if (!data) {
        return false
      }

      const canvasObjectJSON = JSON.parse(data)

      const version = getStringOrUndef(canvasObjectJSON, 'version')
      const objectId = getStringOrUndef(canvasObjectJSON, 'objectId')

      if (!version || !objectId) {
        return false
      }

      return true
    }

    const wait = (timeout: number): Promise<boolean> =>
      new Promise<boolean>((resolve) => {
        setTimeout(() => {
          resolve(false)
        }, timeout)
      })

    Promise.race([checkClipboardData(), wait(500)])
      .then((result) => setCanPaste(result))
      .catch(() => setCanPaste(false))
  }

  window.addEventListener('copy', handleClipboardCopy)

  return (): void => {
    window.removeEventListener('copy', handleClipboardCopy)
  }
}
