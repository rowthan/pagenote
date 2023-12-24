import React, {FC, PropsWithChildren, useEffect, useState} from "react";
import withComponentStyles, {withoutReAction} from "../HOC";

/**react组件模式的 css 引入，产物将以单独的文件形式输出 sideEffect*/
import '../tailwind.css'
import './index.scss'

/**web-component 组件模式的纯文本引入，产物将包装在 js 内部*/
import css from '!!raw-loader!sass-loader!postcss-loader!./index.scss'


const Keyword:FC<PropsWithChildren<{container?: Document, _isWebComponent?: boolean}>> = (props) => {
    const {_isWebComponent} = props
    const [state,setState] = useState(false)

    useEffect(function(){
        setState(true)
    },[])


  return (
      <div>
        {props.children}
      </div>
  )
}

export default Keyword


const WebComponent = withoutReAction(withComponentStyles(Keyword,css))
// const WebComponent = withComponentStyles(Keyword,css)

export {
    WebComponent
}
