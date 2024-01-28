import { Color } from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { ReactNode } from 'react'
import {EditorContentProps} from "@tiptap/react/src/EditorContent";
import {Hashtag} from './extension/HashTag'
import suggestion from './suggestion'

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
      return '留下备忘录。支持 markdown 语法'
    },
  }),
  Hashtag.configure({
    HTMLAttributes: {
      class: 'hashtag bg-blue-100 rounded text-sm',
    },
    suggestion
  })
  // Suggestion.configure({
  //   matcher: {
  //     char: '@', // 匹配 @ 符号
  //     allowSpaces: false, // 是否允许空格
  //     startOfLine: false, // 是否需要在行首
  //   },
  //   appendText: (query) => `@${query}`, // 提示框中选中项后追加的文本
  //   command: ({ editor, range, props }) => {
  //     return editor
  //       .chain()
  //       .focus()
  //       .setMark('mention', { userId: props.userId })
  //       .deleteRange(range)
  //       .run();
  //   },
  // }),
  // {
  //   // 定义 mention mark
  //   name: 'mention',
  //   parseHTML() {
  //     return [{ tag: 'span[data-mention]' }];
  //   },
  //   renderHTML({ HTMLAttributes }) {
  //     return ['span', HTMLAttributes];
  //   },
  // },
]

export interface EditorChangeContent {
  htmlContent: string
  jsonContent?: Object
  textContent: string
}

export interface EditorProps {
  htmlContent: string
  jsonContent?: Object
  onUpdate?: (content: EditorChangeContent) => void
  className?: string
  children?: ReactNode
}

const TipEditor = React.forwardRef((props: EditorProps & Partial<EditorContentProps>, ref) => {
  const {children,className,onUpdate,jsonContent,htmlContent,...left} = props;
  const onUpdateData = function (data: {
    editor: { getHTML: () => any; getJSON: () => any; getText: () => string }
  }) {
    onUpdate && onUpdate({
      htmlContent: data.editor.getHTML(),
      jsonContent: data.editor.getJSON(),
      textContent: data.editor.getText(),
    })
    return undefined
  }

  const editor = useEditor({
    extensions: extensions,
    content: htmlContent,
    onUpdate: onUpdateData,
    autofocus: false,
  })

  React.useImperativeHandle(ref, () => ({
    editor: editor,
  }))


  return (
    // @ts-ignore
    <EditorContent {...left} className={props.className} editor={editor} >
      {props.children}
    </EditorContent>
  )
})
TipEditor.displayName = 'TipEditor'

export default TipEditor
