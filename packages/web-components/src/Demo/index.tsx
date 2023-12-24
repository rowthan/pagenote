import React, {FC, PropsWithChildren, useEffect, useState} from "react";
import withComponentStyles from "../HOC";
import {getChildren} from "../utils/webComponent";

/**react组件模式的 css 引入，产物将以单独的文件形式输出 sideEffect*/
import '../tailwind.css'
import './index.scss'

/**web-component 组件模式的纯文本引入，产物将包装在 js 内部*/
import css from '!!raw-loader!sass-loader!postcss-loader!./index.scss'


const Index:FC<PropsWithChildren<{container?: Document}>> = (props) => {
    const [state,setState] = useState(false)

    useEffect(function(){
        setState(true)
    },[])
  return (
      <div>
        {getChildren(props)}
        {state}
      </div>
  )
}

export default Index


const WebComponent = withComponentStyles(Index,css)
export {
    WebComponent
}
