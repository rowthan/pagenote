import {h} from 'preact';
import Delete from "../assets/delete.svg";
import Popover from './tip/Popover';
import './LightRefAnotation.scss'
import ImageIcon from '../assets/image.svg'

export default  function LightRefAnotation({step}) {
  const text = step.text||'';
  const notion = step.text!==step.tip?step.tip:'';
  const imgs = step.images || [];
  return(
    <pagenote-ref-anotation data-insign={step.isInview?'1':''}
                            data-active={step.isActive?'1':''}
                            style={{'--fill-color':step.bg}}>
        <pagenote-light-ref onClick={()=>step.gotoView()}>
            <Popover
                placement='left'
                trigger={['hover']}
                overlay={<span><Delete onClick={(e)=>step.delete(e)}/></span>}>
                <pagenote-light-target onClick={()=>{step.toggle()}} />
            </Popover>

            <pagenote-light-highlight>
                {text.substring(0,28)}
                {imgs.length?<Popover trigger='hover' message={imgs.map((img)=>(
                    <div>
                        <img style='max-width:100px' src={img.url} alt={img.alt}/>
                    </div>
                ))}>
                    <ImageIcon style={{verticalAlign:'sub',margin:'0 4px'}} />
                </Popover>:''}
            </pagenote-light-highlight>
      </pagenote-light-ref>
      <pagenote-light-anotation>
        {
          step.isActive && notion &&
          <pagenote-block dangerouslySetInnerHTML={{__html: notion}}>

          </pagenote-block>
        }
      </pagenote-light-anotation>
    </pagenote-ref-anotation>
  )
}
