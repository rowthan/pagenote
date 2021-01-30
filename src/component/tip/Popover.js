import {h} from 'preact';
import ToolTip from "rc-tooltip";
import './popover.less'

export default function Tip({message,children,...props}) {
  return(
    <ToolTip destroyTooltipOnHide={{ keepParent: false }}
             align={{
               offset: [0, 10],
             }}
             overlayStyle={{zIndex:9999999}}
             prefixCls='rc-popover'
             placement="bottom"
             trigger={['click']}
             offsetX={10}
             overlay={<span>{message}</span>}
             {...props}
      >
      {children}
    </ToolTip>
  )
}
