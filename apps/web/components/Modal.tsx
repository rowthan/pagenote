import { ReactElement, useEffect } from 'react'

interface Props {
  open: boolean
  keepNode?: boolean
  children: ReactElement
  toggleOpen?: (open: boolean) => void
}

export default function Modal(props: Props) {
  const { open, keepNode = false, children, toggleOpen } = props

  useEffect(function () {
    function listenEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        toggleOpen?.(false)
      }
    }

    document.addEventListener('keyup', listenEsc)
    return function () {
      return document.removeEventListener('keyup', listenEsc)
    }
  }, [])

  if (!open && !keepNode) {
    return null
  }
  return (
    <div className={`modal modal-${props.open ? 'open' : 'onClose'}`}>
      <div className="modal-box">
        {toggleOpen && (
          <label
            htmlFor="my-modal-3"
            onClick={() => {
              toggleOpen?.(!open)
            }}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
        )}

        {children}
      </div>
      <div className={'fixed bottom-2 right-2 text-color-400'}>
        <kbd className={'kbd kbd-xs'}>esc 关闭</kbd>
      </div>
    </div>
  )
}
