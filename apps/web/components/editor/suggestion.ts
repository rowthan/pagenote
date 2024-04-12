// @ts-nocheck
import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import MentionList from './node/MentionList'
import extApi from "@pagenote/shared/lib/pagenote-api";

export default {
  items: ({ query }) => {
    return extApi.table.keys({
      table: 'webpage',
      db: "lightpage",
      params:{
        key: "categories",
      }
    }).then(function (res) {
      const keys = res.data  || [];
      keys.push(query)
      return keys.filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5)
    })
  },

  render: () => {
    let component
    let popup

    return {
      onStart: props => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0]?.destroy()
        component?.destroy()
      },
    }
  },
}
