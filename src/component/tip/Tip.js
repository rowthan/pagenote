import {h} from 'preact';
import ToolTip from "rc-tooltip";
import './tip.less'

export default function Tip({message,children}) {
  return(
    <ToolTip destroyTooltipOnHide={{ keepParent: false }}
             align={{
               offset: [0, -10],
             }}
             overlayStyle={{zIndex:9999999}}
             placement="top"
             trigger={['hover']}
             offsetX={10} overlay={<span>{message}</span>}>
      {children}
    </ToolTip>
  )
}
