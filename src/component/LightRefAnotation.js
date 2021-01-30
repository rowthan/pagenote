import {h} from 'preact';
import Delete from "../assets/delete.svg";
// import MoreAction from '../assets/more-action.svg'
import Popover from './tip/Popover';
import './LightRefAnotation.scss'
import MoreAction from "../assets/more-action.svg";

export default  function LightRefAnotation({step}) {
  const text = step.text||step.tip;
  const notion = step.text!==step.tip?step.tip:'';
  return(
    <pagenote-ref-anotation data-insign={step.isInview?'1':''} style={{'--fill-color':(step.isActive&&step.isInview)?step.bg:'#fff'}}>
      <pagenote-light-ref>
        <span>
          {text.substring(0,28)}
        </span>
      </pagenote-light-ref>
      <pagenote-light-anotation>
        {
          step.isActive && notion &&
          <pagenote-block>
            <pagenote-block>
              {new Date(step.time).toLocaleDateString()}
            </pagenote-block>
            <pagenote-block dangerouslySetInnerHTML={{__html: notion}}>

            </pagenote-block>
          </pagenote-block>
        }
      </pagenote-light-anotation>
      <pagenote-light-actions>
        <Popover
          overlay={<span><Delete onClick={(e)=>step.delete(e)}/></span>}>
          <MoreAction onClick={(e)=>{e.stopPropagation()}}/>
        </Popover>
      </pagenote-light-actions>
    </pagenote-ref-anotation>
  )
}
