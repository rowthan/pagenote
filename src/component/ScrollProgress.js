import {h, render, Component, Fragment} from 'preact';
import './scroll-progress.scss';
import {useEffect, useState} from "preact/hooks";
import {throttle} from "../utils";
import {getScroll} from "../document";
import i18n from "../locale/i18n";


export default  function LightRefAnotation() {

  const [percent,setPercent] = useState(0);


  const  handleScroll = throttle( (e)=> {
    // 重新计算相对位置。
    const {y}= getScroll();

    const currentY = y;
    const totalY = document.documentElement.scrollHeight - window.innerHeight;
    setPercent(Math.floor(currentY / totalY * 100));
  },20);

  useEffect(function () {
    document.addEventListener("scroll", handleScroll);

    return componentWillUnmount;
  },[]);

  function componentWillUnmount() {
    // 组件销毁时你要执行的代码
    document.removeEventListener('scroll',handleScroll);
  }

  return(
    <pagenote-progress data-position='bottom' data-tip={i18n.t('has_read_percent',[percent])}>
      <pagenote-progress-percent
        style={{width: percent+'%'}} ></pagenote-progress-percent>
    </pagenote-progress>
  )
}
