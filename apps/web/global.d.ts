import React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'key-word': React.DetailedHTMLProps<
        { preview?: string } & React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
      'mark-down': React.DetailedHTMLProps<
        { css?: string } & React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
    }
  }
}
