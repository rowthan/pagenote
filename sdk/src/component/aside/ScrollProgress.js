import './scroll-progress.scss';
import {useEffect, useState} from "react";
import {throttle} from "../../utils";
import {getScroll} from "../../utils/document";
import i18n from "../../locale/i18n";
import ToolTip from "rc-tooltip";

export default  function ScrollProgress({steps=[],useDot}) {

  const [percent,setPercent] = useState(0);


  const  handleScroll = throttle( (e)=> {
    // 重新计算相对位置。
    const {y}= getScroll();

    const currentY = y;
    const totalY = document.documentElement.scrollHeight - window.innerHeight;
    setPercent(Math.min(Math.floor(currentY / totalY * 100),100));

    steps.forEach((step)=>{
      step.checkInSign();
    })

  },20);

  useEffect(function () {
    // TODO 使用observe监听
    setTimeout(()=>{
      steps.forEach((step)=>{
        step.checkInSign();
      })
    },1000)
    document.addEventListener("scroll", handleScroll);

    return componentWillUnmount;
  },[]);

  function componentWillUnmount() {
    // 组件销毁时你要执行的代码
    document.removeEventListener('scroll',handleScroll);
  }


  const positionPercent = Math.min(Math.max(percent,8),98);

  const showProgress = !useDot;

  return(
      <></>
      // <ToolTip
      //   destroyTooltipOnHide={{ keepParent: false }}
      //   align={{
      //     offset: [10, 0],
      //   }}
      //   placement="rightTop" trigger={['hover']}
      //   offsetX={10} overlay={<span>{i18n.t('has_read_percent',[percent])}</span>}>
      //   {/*{*/}
      //   {/*  useDot ?*/}
      //   {/*    <pagenote-scroll-sign style={{top: `${positionPercent}%`}}></pagenote-scroll-sign>:*/}
      //   {/*    <pagenote-progress data-position='bottom'>*/}
      //   {/*      <pagenote-progress-percent*/}
      //   {/*        style={{width: `${percent}%`}} >*/}
      //   {/*      </pagenote-progress-percent>*/}
      //   {/*    </pagenote-progress>*/}
      //   {/*}*/}
      //   <pagenote-progress data-position='bottom'>
      //     <pagenote-progress-percent
      //         style={{width: `${percent}%`}} >
      //     </pagenote-progress-percent>
      //   </pagenote-progress>
      // </ToolTip>
  )
}
