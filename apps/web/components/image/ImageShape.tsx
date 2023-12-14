import React, {useState, useRef, ReactElement, useEffect} from 'react'

import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
} from 'react-image-crop'
import { canvasPreview } from './canvasPreview'
import { useDebounceEffect } from './useDebounceEffect'

import 'react-image-crop/dist/ReactCrop.css'
import {imgPreview} from "./imgPreview";

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

type Props =  {
    preViewCanvas?: HTMLCanvasElement | null,
    originImgSrc: string,

    children: ReactElement

    cropCallback: (canvas: HTMLCanvasElement,)=>void
}

export default function ImageShape(props:Props) {
    const {originImgSrc,preViewCanvas,children,cropCallback} = props;
    const [imgSrc, setImgSrc] = useState('')
    const previewCanvasRef = useRef<HTMLCanvasElement|null>(null)
    const imgRef = useRef<HTMLImageElement|null>(null)
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop|null>()
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [aspect, setAspect] = useState<number | undefined>(1 / 1)

    useEffect(function () {
        setImgSrc(originImgSrc);
        setScale(1);
        setRotate(0)
    },[originImgSrc])



    function onImageLoad() {
        if (aspect) {
            const { width, height } = imgRef.current || {}
            if(width && height){
                setCrop(centerAspectCrop(width, height, aspect))
            }
        }
    }

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                (previewCanvasRef.current || preViewCanvas)
            ) {
                const canvas: HTMLCanvasElement = preViewCanvas || previewCanvasRef.current as HTMLCanvasElement;
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(
                    imgRef.current as HTMLImageElement,
                    canvas,
                    completedCrop,
                    scale,
                    rotate,
                )

                cropCallback(canvas)
            }
        },
        100,
        [completedCrop, scale, rotate, originImgSrc],
    )

    function handleToggleAspectClick() {
        if (aspect) {
            setAspect(undefined)
        } else if (imgRef.current) {
            const { width, height } = imgRef.current
            setAspect(16 / 9)
            setCrop(centerAspectCrop(width, height, 16 / 9))
        }
    }

    return (
        <div className="App">
            {!!imgSrc && (
                <ReactCrop
                    minWidth={128}
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    circularCrop={false}
                >
                    <img
                        crossOrigin="anonymous"
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, minHeight:'128px' }}
                        onLoad={onImageLoad}
                    />
                </ReactCrop>
            )}
            <div>
                {!preViewCanvas && !!completedCrop && (
                    <canvas
                        ref={previewCanvasRef}
                        style={{
                            display:"none",
                            border: '1px solid black',
                            objectFit: 'contain',
                            width: completedCrop.width,
                            height: completedCrop.height,
                        }}
                    />
                )}
            </div>
            {children}
        </div>
    )
}
