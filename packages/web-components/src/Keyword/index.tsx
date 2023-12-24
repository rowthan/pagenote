import React, {FC, PropsWithChildren, useEffect, useRef, useState} from "react";
import withComponentStyles from "../HOC";
import {calculateOptimalPosition} from "../utils/position";
import {getWordInfo} from "../service/request";
import classNames from 'classnames';
import {onFocusChange} from "../utils/focus";
import Popup from "../Popup";
import {getComponentInnerText} from "../utils/webComponent";
import KeywordCard from "../Card/KeywordCard";
import Markdown from "../Markdown";
/**react组件模式的 css 引入，产物将以单独的文件形式输出 sideEffect*/
import '../tailwind.css'
import './index.scss'

/**web-component 组件模式的纯文本引入，产物将包装在 js 内部*/
import css from '!!raw-loader!sass-loader!postcss-loader!./index.scss'

enum LoadState {
    init = 0,
    loading = 1,
    loaded = 2,
    fail = 3,
}
const Keyword:FC<PropsWithChildren<{container?: Document}>> = (props) => {
  const keywordRef = useRef<HTMLSpanElement>(null);
    const [state,setState] = useState(LoadState.init)
    const [markdown,setMarkdown] = useState('')
    const [focused,setFocused] = useState(false)
  const popupEl = useRef<HTMLDivElement>(null);
  const [popup,setPopup] = useState({
    left: 0,
    top: 0,
  })

    const keyword = getComponentInnerText(props)

    function setPopupPosition() {
        if(keywordRef.current && popupEl.current){
            setPopup(calculateOptimalPosition(keywordRef.current,popupEl.current))
        }
    }
  function loadKeyword () {
    setPopupPosition()

      if(!markdown){
          setState(LoadState.loading)

          getWordInfo(keyword).then(function (res) {
              setState(LoadState.loaded)
              setMarkdown(res.markdown)
          }).catch(function () {
              setState(LoadState.fail)
          })
      }

  }



    useEffect(function () {
        window.addEventListener('resize', ()=> {
            setPopupPosition()
        })
        loadKeyword()
        onFocusChange([
            keywordRef.current,
            popupEl.current,
        ], {
            outTimeout: 300,
            callback: (value)=> {
                setFocused(value)
            }
        })
    },[])

  return (
      <>
        <span ref={keywordRef} onMouseEnter={loadKeyword}
              className={classNames(`word cursor-pointer`,{
                'loading': state === LoadState.loading,
                'loaded': state === LoadState.loaded,
                'fail': state === LoadState.fail
              })}>
            {/* web component 模式下，不需要保留原 html 节点，原节点用于兜底（如离线化） */}
            {props.children || keyword}
        </span>

        <div ref={popupEl}>
          {
              focused &&
              <Popup
                  left={popup.left}
                  top={popup.top}
              >
                <KeywordCard className={'w-[320px] max-h-[480px] bg-white dark:bg-gray-600 dark:text-white'}
                    scrollBar={
                        <>
                            <div className={'px-4 py-3 font-medium'}>
                                {keyword}
                            </div>
                            <div className={'divider w-full h-[1px] bg-[#1f232926] scale-y-[0.5]'}></div>
                        </>
                    }
                     footer={
                         <div>
                             <div></div>
                             footer
                         </div>
                     }
                >

                    <div slot={'body'} className="dictionary-body bg-no-repeat" style={{
                        // backgroundImage:   `url("")`,
                        backgroundSize: '100% 143px'
                    }}>
                        <div className={'absolute right-4 top-2' }>

                        </div>

                        {/*2.1导航*/}
                        <div className={'px-4 py-3'} >
                            <div className={'text-lg font-medium'}>
                                {keyword}
                            </div>
                            <div className={'text-sm '}>

                            </div>
                            <div className="tag">

                            </div>
                        </div>

                        {/*2.2内容区*/}
                        <div className="layout-section p-4">
                            <div className={'description'}>
                                <Markdown markdown={markdown} />
                            </div>
                        </div>
                    </div>
                </KeywordCard>
              </Popup>
          }
        </div>
      </>
  )
}

export default Keyword


const WebComponent = withComponentStyles(Keyword,css)
export {
    WebComponent
}
