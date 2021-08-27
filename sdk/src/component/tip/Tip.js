import {h} from 'preact';
import ToolTip from "rc-tooltip";
import './tip.less'

export default function Tip({message,children,inner=false}) {
  return(
    <ToolTip destroyTooltipOnHide={{ keepParent: false }}

             align={{
               offset: [0, 0],
             }}
             overlayStyle={{zIndex:9999999}}
             placement="top"
             trigger={['hover']}
             getTooltipContainer={function (a) {
                 return inner ? a.parentNode : document.body;
             }}
             offsetX={10} overlay={<span>{message}</span>}>
      {children}
    </ToolTip>
  )
}
