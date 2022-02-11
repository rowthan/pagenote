import {computePosition, convertColor, isMobile} from "../utils";
// @ts-ignore
import Highlight from '@/assets/images/highlight.svg';
import root from 'react-shadow';
// @ts-ignore
import styles from './action-bar.less';
import {Position, Step} from "@pagenote/shared/lib/@types/Types";
import {IBrush} from "../types/Option";
import React, {Fragment, useEffect, useMemo, useRef} from "react";

interface Props {
  position: Position
  brushes: IBrush[],
  showButton: boolean,
  target: Step,
  recordNew: (data: { bg: string })=>void
}


export default function ActionBars ({position,brushes,showButton,target,recordNew}:Props) {
  const recordButtonX = position.x+'px';
  const recordButtonY = position.y + "px";

  const show = target!==null;

  function stopPropagation(e: { stopPropagation: () => void;preventDefault(): void; }) {
      // console.log(e,'stop')
      // e.stopPropagation();
      // e.preventDefault();
      // // @ts-ignore
      // e.nativeEvent.stopPropagation();
      // // @ts-ignore
      // e.nativeEvent.stopImmediatePropagation();
  }

  const ref = useRef(null);
  // useEffect(function () {
  //     ['click','mouseup',"mousedown",'touchstart'].forEach(function (event) {
  //         if(ref.current){
  //             ref?.current?.addEventListener(event,function (e: { stopPropagation: () => void; preventDefault: () => void; }) {
  //                 e.stopPropagation();
  //                 e.preventDefault();
  //             })
  //         }
  //     })
  // },[])


  return (
      <root.div ref={ref}
                // onClick={stopPropagation}
                // onMouseUp={stopPropagation}
                // onMouseDown={stopPropagation}
                // onTouchStart={stopPropagation}
            >
          <style type="text/css">{styles}</style>
          <div

              className='pagenote-action-container' style={{
            left: recordButtonX,
            top: recordButtonY,
          }}>
            {
                useMemo(function () {
                    return <div>
                        {
                            show &&
                            <div className='pagenote-block'>
                                <div className='pagenote-colors-container'>
                                    {
                                        brushes.map((item, index) => {
                                            const radios = 30;
                                            const {x:offsetX,y:offsetY} = (isMobile || index===0) ? {
                                                x: (index) * - 40,
                                                y: 0,
                                            } : computePosition(index-1,radios);

                                            if(!item){
                                                return (
                                                    <div className='pagenote-color-button' key={index}/>
                                                )
                                            }
                                            return(
                                                <div className='pagenote-color-button'
                                                     key={index}
                                                     data-pagenotecolor={item.bg}
                                                     style={{
                                                         // @ts-ignore
                                                         '--color': item.bg,
                                                         transform: `translate(${offsetX}px,${-offsetY}px)`,
                                                         top: (offsetY) + 'px',
                                                         left: (-offsetX) + 'px',
                                                         width: radios + 'px',
                                                         height: radios + 'px',
                                                         // @ts-ignore
                                                         color: convertColor(item.bg).textColor,
                                                         // @ts-ignore
                                                         textShadow: `1px 1px 0px ${convertColor(convertColor(item.bg).textColor).textColor}`,
                                                         // animation:`${(showAnimation&&index!==0)?'colorShow 3s ease-out':''}`,
                                                         // animationDelay: index*0.1+'s',
                                                         // transitionDelay: index*0.1+'s',
                                                     }}
                                                     // onMouseUp={(e)=>{recordNew(item);}}
                                                     onClick={(e)=>{recordNew(item);}}
                                                >
                                                    <Highlight  data-pagenotecolor={item.bg} style={{userSelect:'none'}} fill={item.bg}/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        }
                    </div>
                },[brushes])
            }
          </div>
      </root.div>
  )
}
