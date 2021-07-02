import {h} from 'preact';
import Popover from '../tip/Popover';
import './LightRefAnotation.scss'
import ImageIcon from '../../assets/images/image.svg'
import i18n from '../../locale/i18n'
import Tip from '../tip/Tip'
export default  function LightRefAnotation({step,showTarget}) {
  const {data,runtime} = step;
  const text = data.text||'';
  const notion = data.text!==data.tip?data.tip:'';
  const imgs = data.images || [];
  const hasRelated = runtime.relatedNode.length>0
  return(
      <pagenote-light-aside-ref
          onClick={()=>step.gotoView()}
          onDblClick={()=>step.toggle()}
          data-founded={hasRelated?'1':'0'}
          data-insign={data.isInview?'1':'0'}
          data-active={data.isActive?'1':'0'}
          style={{'--fill-color':data.bg}}>
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
      </pagenote-light-aside-ref>
  )
}
