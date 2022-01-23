import {createRef} from 'react';
import ToolTip from "rc-tooltip";
// import './popover.less'

export default function Popover({message,children,inner=false,...props}) {
  const ref = createRef();
  return(
    <ToolTip
             destroyTooltipOnHide={{ keepParent: false }}
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
                 return inner? a.parentNode : document.body
             }}
             {...props}
      >
        {children}
    </ToolTip>
  )
}
