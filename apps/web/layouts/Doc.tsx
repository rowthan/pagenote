import { type ReactNode } from 'react'
import 'react-notion-x/src/styles.css'
import HelpAside from '../components/HelpAside'
import BasicLayout from "./BasicLayout";

// core styles shared by all of react-notion-x (required)
interface Props {
  children?: ReactNode
}

export default function Doc(props: Props) {
  const { children } = props
  return (
    <BasicLayout>
      {children}
    </BasicLayout>
  )
}

Doc.defaultProps = {}
