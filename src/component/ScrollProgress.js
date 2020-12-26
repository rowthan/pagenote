import {h, render, Component, Fragment} from 'preact';
import './scroll-progress.scss';
import {useEffect, useState} from "preact/hooks";
import {throttle} from "../utils";
import {getScroll} from "../document";
import i18n from "../locale/i18n";
import PreIcon from '../assets/pre.svg';
import NextIcon from '../assets/next.svg';

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
    document.addEventListener("scroll", handleScroll);

    return componentWillUnmount;
  },[]);

  function componentWillUnmount() {
    // 组件销毁时你要执行的代码
    document.removeEventListener('scroll',handleScroll);
  }


  const positionPercent = Math.min(Math.max(percent,8),98);
  return(
    // data-tip={i18n.t('has_read_percent',[percent])}
    <Fragment>
      {
        useDot ?
          <pagenote-scroll-sign style={{top: `${positionPercent}%`}}></pagenote-scroll-sign>:
          <pagenote-progress data-position='bottom' >
            <pagenote-progress-percent
              style={{top: `${positionPercent}%`}} >
              {/*<PreIcon width='10px' height='10px'></PreIcon>*/}
              {/*<NextIcon width='10px' height='10px'></NextIcon>*/}
            </pagenote-progress-percent>
          </pagenote-progress>

      }
    </Fragment>
  )
}
