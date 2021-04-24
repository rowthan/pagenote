import {h} from 'preact';
import Delete from "../../assets/images/delete.svg";
import Popover from '../tip/Popover';
import './LightRefAnotation.scss'
import ImageIcon from '../../assets/images/image.svg'
import i18n from '../../locale/i18n'
import Tip from '../tip/Tip'
export default  function LightRefAnotation({step,showTarget}) {
  const text = step.text||'';
  const notion = step.text!==step.tip?step.tip:'';
  const imgs = step.images || [];
  const hasRelated = step.relatedNode.length>0
  return(
      <Popover
          placement='right'
          trigger={['hover']}
          overlay={<pagenote-block>
              <Delete onClick={(e)=>step.delete(e)}/>
          </pagenote-block>}
          // align={{
          //     points: ['cr', 'cl'],        // align top left point of sourceNode with top right point of targetNode
          //     // offset: [110, 20],            // the offset sourceNode by 10px in x and 20px in y,
          //     // targetOffset: ['30%','40%'], // the offset targetNode by 30% of targetNode width in x and 40% of targetNode height in y,
          //     overflow: { adjustX: true, adjustY: false },
          // }}
      >
          <pagenote-ref-anotation
              data-founded={hasRelated?'1':'0'}
              data-insign={step.isInview?'1':''}
              data-active={step.isActive?'1':''}
              style={{'--fill-color':step.bg}}>
              <pagenote-light-ref onClick={()=>step.gotoView()}>
                  <pagenote-light-highlight>
                      {
                          !hasRelated &&
                          <Tip message={i18n.t('not_found')}>
                              <i style={{fontSize: '12px'}} className='iconfont iconinfo'></i>
                          </Tip>
                      }
                      <pagenote-light-inner>
                          {text.substring(0,28)}
                          {imgs.length?<Popover trigger='hover' message={imgs.map((img)=>(
                              <div>
                                  <img style='max-width:100px' src={img.url} alt={img.alt}/>
                              </div>
                          ))}>
                              <ImageIcon style={{verticalAlign:'sub',margin:'0 4px'}} />
                          </Popover>:''}
                      </pagenote-light-inner>
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
      </Popover>
  )
}
