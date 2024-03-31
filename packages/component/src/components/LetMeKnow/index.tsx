import React, {FC, PropsWithChildren,useState,useRef} from "react";
import { RiThumbUpLine,RiThumbUpFill } from "react-icons/ri";
import {withComponentStyles} from '../HOC'
import confetti from 'canvas-confetti'
import classNames from 'classnames'
import css from './index.scss'

const LetMeKnow:FC<PropsWithChildren<{container?: Document, _isWebComponent?: boolean}>> = (props) => {
  const [up,setUp] = useState<boolean>(false);
  const canvasRef = useRef(null);
  function onClick(){
    setUp(!up)
    if(!up && canvasRef.current){
      // const canvas = canvasRef.current
      // // @ts-ignore;
      // canvas.confetti = canvas.confetti || confetti.create(canvas, { resize: true });

      const target = canvasRef.current as HTMLElement;
      const position = target.getBoundingClientRect();
      console.log(position)
      confetti({
        particleCount: 60,
        spread: 70, //横向扩展
        // decay: 0.94, 速度丢失
        // drift: 0.8, 风向横向吹动
        // gravity: 0.5, 重力
        ticks: 80, // 显示时间
        startVelocity: 30, // 运行速度
        origin: { 
          y: (position.y + position.height / 2 ) / window.innerHeight  
        }
      });
      // const jsConfetti = new JSConfetti({
      //   canvas: canvasRef.current,
      // });
      // jsConfetti.addConfetti({
      //   confettiNumber: 20
      // });
    }
  }

  return (
      <div className="flex justify-center">
        <div className="relative rounded-full bg-red overflow-hidden m-auto p-[0.5rem]">
          {
            props.children ? props.children : 
            <button onClick={onClick}
             className={
              classNames('relative active:scale-95 duration-100	 z-10 text-blue-400 p-2 border rounded-full border-blue-400',{
                'bg-[#ffc60a]': up,
                'border-[#ffc60a]': up,
                'anmiation': '', // todo 点赞动画
              })
             }>
              {
                up ? <RiThumbUpFill fill="white" /> : <RiThumbUpLine />
              }
            </button>
          } 
          <canvas className="absolute top-0 left-0 w-full h-full" ref={canvasRef}></canvas>
        </div>
        
      </div>
  )
}

export default withComponentStyles(LetMeKnow,css)

