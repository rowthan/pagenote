import {h, render, Component, Fragment} from 'preact';
import Delete from "../assets/delete.svg";
import './LightRefAnotation.scss'

export default  function LightRefAnotation({step}) {
  const text = step.text||step.tip;
  return(
    <pagenote-ref-anotation data-insign={step.isInview?'1':''}>
      <pagenote-light-ref>
        <span style={{color:step.isActive?step.bg:'',fontSize:'1.2em'}}>
          {text.substr(0,1)}
        </span>
        <span>
          {text.substring(1)}
        </span>
      </pagenote-light-ref>
      <pagenote-light-anotation dangerouslySetInnerHTML={{__html: step.text!==step.tip?step.tip:''}}>
      </pagenote-light-anotation>
      <pagenote-light-actions>
        <pagenote-icon>
          <Delete onClick={(e)=>step.delete(e)}/>
        </pagenote-icon>
      </pagenote-light-actions>
    </pagenote-ref-anotation>
  )
}
