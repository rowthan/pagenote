import React, {FC, PropsWithChildren, useEffect, useRef, useState} from "react";
import withComponentStyles from "../HOC";
import { getChildren, getHostRoot } from "../utils/webComponent";

/**react组件模式的 css 引入，产物将以单独的文件形式输出 sideEffect*/
import '../tailwind.css'
import './index.scss'

/**web-component 组件模式的纯文本引入，产物将包装在 js 内部*/
import css from '!!raw-loader!sass-loader!postcss-loader!./index.scss'

type PositionSize = {
  height: string,
  width: string,
  left?: string,
  right?: string,
  top?: string,
  bottom?: string,
}

const Index:FC<PropsWithChildren<{container?: Document} & PositionSize>> = (props) => {
    const componentRoot = useRef(null)
    // const [size,setSize] = useState({
    //   width: props.width,
    //   height: props.height
    // })

    // const [pos,setPos] = useState({
    //   left: props.left,
    //   top: props.top,
    //   right: props.right,
    //   bottom: props.bottom,
    // })

    useEffect(function(){
      const domRoot = getHostRoot(props) || componentRoot.current;
      // 监听resize
    },[])
  return (
      <>
        <div ref={componentRoot}>
        {getChildren(props)}
        </div>
      </>
  )
}

export default Index


const WebComponent = withComponentStyles(Index,css)
export {
    WebComponent
}
