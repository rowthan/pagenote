import React, {FC, PropsWithChildren, useState, useRef} from "react";
import { RiThumbUpLine,RiThumbUpFill } from "react-icons/ri";
import { TiHeartFullOutline,TiHeartOutline } from "react-icons/ti";
import {withComponentStyles} from '../HOC'
import classNames from 'classnames'
import css from './index.scss'
import {showConfetti} from "./confetti";

type Type = 'thumb' | 'heart' | string

const icons: Record<Type, {
  fill: React.ReactNode,
  line: React.ReactNode,
  animation?: (element: HTMLElement)=>void
}> = {
  thumb: {
    fill: <RiThumbUpFill fill="white"/>,
    line: <RiThumbUpLine/>,
    animation: showConfetti,
  },
  heart: {
    fill: <TiHeartFullOutline fill="white"/>,
    line: <TiHeartOutline/>
  }
}

interface Props {
  type: Type,
  color: string
}

const LetMeKnow:FC<PropsWithChildren<{container?: Document, _isWebComponent?: boolean} & Props>> = (props) => {
  const {type='thumb',color='#ffc60a'} = props;
  const [up,setUp] = useState<boolean>(false);
  const canvasRef = useRef(null);
  function onClick(){
    setUp(!up)
    if(!up && canvasRef.current && icons[type]?.animation){
      const target = canvasRef.current as HTMLElement;
      icons[type].animation(target)
    }
  }

  return (
      <div className="flex justify-center text-blue-500">
        <div className="relative rounded-full bg-red overflow-hidden m-auto p-[0.5rem]">
          {
            <button
                onClick={onClick}
                ref={canvasRef}
                style={{
                  backgroundColor: up ? color : '',
                  borderColor: up ? color : '',
                }}
                className={
                  classNames('relative active:scale-95 duration-100 z-10 text-current p-2 border rounded-full border-current', {
                    'anmiation': '', // todo 点赞动画
                  })
                }>
              {
                up ? icons[type].fill :icons[type].line
              }
            </button>
          }
        </div>
      </div>
  )
}

export default withComponentStyles(LetMeKnow, css)

