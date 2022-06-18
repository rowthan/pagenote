import {ContentType} from "../@types/data";

interface Result {
    imageUrl:string,
    blob:Blob|null
}

export const resizeImage = function (src:string,scale=1/10,contentType=ContentType.jpeg,quality=0.92) {
    const img = document.createElement('img');
    const canvasEl = document.createElement('canvas');
    const canvas = canvasEl.getContext('2d');

    let onsuccess:(res:Result)=>void,onfail:()=>void;
    const promise = new Promise((resolve:(res:Result)=>void,reject)=>{
        onsuccess = resolve;
        onfail = reject;
    })

    img.onload = function () {
        canvasEl.width = img.width * scale;
        canvasEl.height = img.height * scale;
        canvas?.scale(scale,scale)
        canvas?.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height)
        const formated = canvasEl.toDataURL(contentType,quality);
        canvasEl.toBlob(function (res) {
            onsuccess({
                imageUrl:formated,
                blob:res
            })
        },contentType)

    }

    img.onerror = function () {
        onfail()
    }

    img.src = src;
    img.crossOrigin = 'Anonymous';

    return promise;
}
