import Script from 'next/script';
import { useEffect, type ReactNode } from 'react';
import JSConfetti from 'js-confetti'

interface Props {
  children?: ReactNode
}

export default function Congratulate(props: Props) {

   useEffect(function(){
    const jsConfetti = new JSConfetti()
    jsConfetti.addConfetti();
   },[])
  
  return <div className="">
    </div>
}
