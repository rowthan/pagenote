import {h} from 'preact';
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
      <pagenote-light-aside-ref
          data-founded={hasRelated?'1':'0'}
          data-insign={step.isInview?'1':''}
          data-active={step.isActive?'1':''}
          style={{'--fill-color':step.bg}}>
          <pagenote-light-highlight onClick={()=>step.gotoView()}>
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
          <pagenote-light-anotation data-content={notion?'1':'0'}>
              {
                  step.isActive && notion &&
                  <pagenote-block dangerouslySetInnerHTML={{__html: notion}}>

                  </pagenote-block>
              }
          </pagenote-light-anotation>
      </pagenote-light-aside-ref>
  )
}
