import React, {FC, PropsWithChildren,useEffect,Fragment,useRef} from "react";
import {withComponentStyles} from '../HOC'
import ReactDOM from "react-dom";

const Highlight:FC<PropsWithChildren<{container:Document,_isWebComponent?: boolean}>> = (props) => {
  const highlightText = '内容'
  const rootRef = useRef(null)
  useEffect(()=>{
    if(props._isWebComponent){
      const children = props.container.querySelector('slot')?.assignedNodes();
      console.log(children, 'web component children')
    }else{
      // @ts-ignore
      const children = rootRef.current.childNodes;
      console.log(children, 'react component children')
    }
    highlight();
  },[])

  function highlight(){
    console.log('start highlight');
  }

  if(props._isWebComponent){
    return props.children
  }else{
    return (
      <div ref={rootRef}>
        {props.children}
      </div>
    ) 
  }
}

export default withComponentStyles(Highlight)

