import { Color } from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { ReactNode } from 'react'

const extensions = [
  Link.configure(),
  Image.configure(),
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  // @ts-ignore
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Placeholder.configure({
    placeholder: () => {
      return '留下关联备忘录'
    },
  }),
]

export interface EditorChangeContent {
  htmlContent: string
  jsonContent?: Object
  textContent: string
}

export interface EditorProps {
  htmlContent: string
  jsonContent?: Object
  onUpdate: (content: EditorChangeContent) => void
  className?: string
  children?: ReactNode
}

const TipEditor = React.forwardRef((props: EditorProps, ref) => {
  const onUpdate = function (data: {
    editor: { getHTML: () => any; getJSON: () => any; getText: () => string }
  }) {
    props.onUpdate({
      htmlContent: data.editor.getHTML(),
      jsonContent: data.editor.getJSON(),
      textContent: data.editor.getText(),
    })
    return undefined
  }

  const editor = useEditor({
    extensions: extensions,
    content: props.htmlContent,
    onUpdate: onUpdate,
    autofocus: false,
  })

  React.useImperativeHandle(ref, () => ({
    editor: editor,
  }))

  return (
    <EditorContent className={props.className} editor={editor}>
      {props.children}
    </EditorContent>
  )
})
TipEditor.displayName = 'TipEditor'

export default TipEditor
