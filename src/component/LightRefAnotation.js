import {h, render, Component, Fragment} from 'preact';
import Delete from "../assets/delete.svg";
import './LightRefAnotation.scss'

export default  function LightRefAnotation({step}) {
  return(
    <pagenote-ref-anotation data-insign={step.isInview?'1':''}>
      <pagenote-light-ref>
        {step.text||step.tip}
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
