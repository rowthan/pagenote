import React from 'react'

// eslint-disable-next-line no-unused-vars
export default class ErrorBoundary extends React.Component<{
  // eslint-disable-next-line no-unused-vars
  fallback: (props: { error: string }) => React.ReactNode
  children?: React.ReactNode
}> {
  //@ts-ignore
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: { toString: () => any }) {
    console.warn(error, 'error from getDerivedStateFromError')
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error?.toString() }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    // logErrorToMyService(error, info.componentStack);
    console.warn(error, info.componentStack, 'error from componentDidCatch')
    return {
      hasError: true,
      error: info.componentStack,
    }
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      // @ts-ignore
      return this.props.fallback({ error: this.state.error })
    }

    return this.props.children
  }
}
