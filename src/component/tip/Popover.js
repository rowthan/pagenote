import {h,createRef} from 'preact';
import ToolTip from "rc-tooltip";
import './popover.less'

export default function Popover({message,children,...props}) {
  const ref = createRef();
  return(
    <ToolTip destroyTooltipOnHide={{ keepParent: false }}
             // align={{
             //   offset: [0, 10],
             // }}
             overlayStyle={{zIndex:9999999}}
             prefixCls='rc-popover'
             placement="bottom"
             trigger={['click']}
             // offsetX={10}
             overlay={<span>{message}</span>}
             getTooltipContainer={function (a) {
                 return a.parentNode
             }}
             {...props}
      >
        {children}
    </ToolTip>
  )
}
