import ToolTip from "rc-tooltip";
import styles from './tip.less'
import root from 'react-shadow';

export default function Tip({message,children,inner=false,placement='top'}) {
  return(
      <div>
          <style type="text/css">{styles}</style>
          <ToolTip destroyTooltipOnHide={{ keepParent: false }}
                   align={{
                       offset: [0, 0],
                   }}
                   overlayStyle={{zIndex:9999999}}
                   placement={placement}
                   trigger={['hover']}
                   getTooltipContainer={function (a) {
                       return inner ? a.parentNode : document.body;
                   }}
                   offsetX={10} overlay={<span>{message}</span>}>
              {children}
          </ToolTip>
      </div>
  )
}
