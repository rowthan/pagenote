import React, {FC, PropsWithChildren, useEffect} from "react";
import r2wc from "@r2wc/react-to-web-component"
import tailCss from '../tailwind';

const Keyword:FC<PropsWithChildren<{css?: string, container?: Document}>> = (props) => {
  useEffect(function () {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(tailCss);
    const root = props.container || document;
    if(root){
      root.adoptedStyleSheets  = [sheet]
    }
  },[])

  const children = props.children //|| props.container.host.childNodes;
  return (
    <div className={'underline text-blue-500'}>
      {children}
      <slot></slot>
    </div>
  )
}
export default Keyword

const WebComponent = r2wc(Keyword,{
  shadow:'closed'
})
customElements.define("key-word", WebComponent)
