import React, { useEffect, useRef, useState } from 'react'
import EditSvg from 'assets/svg/edit.svg'

export default function PlainInputArea(props: {
  onInputChange: (text: string) => void
  value: string
  throttleDuration?: number
  singleLine?: boolean
  maxLength?: number
  children?: React.ReactNode
  innerState?: boolean
  readonly?: boolean
  [key: string]: any
}) {
  const {
    value,
    maxLength = 2000,
    singleLine = false,
    onInputChange,
    children,
    placeholder = '',
    innerState = false,
    readonly = false,
  } = props
  const ref = useRef<HTMLTextAreaElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [focused, setFocused] = useState(false)
  const [innerValue, setInnerValue] = useState(value)

  const onChange = function (e: React.ChangeEvent<HTMLTextAreaElement>) {
    const inputText = e.target.value || ''
    let value = singleLine ? inputText.replace(/[\r\n]/g, '') : inputText
    onInputChange(value.substring(0, maxLength))
    setInnerValue(inputText)
  }

  // 根据textarea的高度自动调整高度
  function resize() {
    const textarea = ref.current
    const root = rootRef.current
    if (root) {
      root.style.height = 'auto'
      if (textarea) {
        root.style.height = textarea.scrollHeight + 'px'
      }
    }
  }

  function listenFocus() {
    setInnerValue(value)
    if (readonly) {
      return
    }
    setFocused(true)
  }

  function listenBlur() {
    setFocused(false)
  }

  function listenKey() {
    function listenKey(e: KeyboardEvent) {
      if (['Escape', 'Tab'].includes(e.key)) {
        setFocused(false)
        e.stopPropagation()
        e.preventDefault()
      }
    }

    rootRef?.current?.addEventListener('keydown', listenKey)
    return function () {
      rootRef?.current?.removeEventListener('keydown', listenKey)
    }
  }

  useEffect(
    function () {
      resize()
    },
    [value, focused, innerValue]
  )

  useEffect(
    function () {
      // 聚焦在尾部
      const textarea = ref.current
      if (textarea) {
        textarea.selectionStart = textarea.selectionEnd = textarea.value.length
      }

      if (focused) {
        return listenKey()
      }
    },
    [focused]
  )

  const text = innerState ? innerValue : value
  return (
    <div
      className={'max-w-full overflow-hidden'}
      ref={rootRef}
      tabIndex={readonly ? -1 : 0}
      onFocus={listenFocus}
      onBlur={listenBlur}
    >
      {focused ? (
        <div className={'relative w-full h-full'}>
          <textarea
            autoFocus={true}
            ref={ref}
            rows={1}
            onChange={onChange}
            placeholder={placeholder}
            className={'w-full h-full p-1 resize-none'}
            value={text}
          ></textarea>
          {innerValue !== value && (
            <div className={'text-xs absolute  right-1 bottom-1'}>
              <EditSvg />
            </div>
          )}
        </div>
      ) : (
        <div className={'p-1'}>{children}</div>
      )}
    </div>
  )
}
