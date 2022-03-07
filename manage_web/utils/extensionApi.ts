/**
 * 0.20.x 版本前使用的旧版通信 bridge
 * */
import Bridge from "./extensionBridge";
let getBridge = function (){
    const element = document.getElementById('messenger');
    const bridgeCli = new Bridge(element,'page','extension');
    if(element){
        getBridge = function (){
            return bridgeCli
        }
    }
    return bridgeCli;
}


function requestExtension<T>(method:string,data:any=null):Promise<T> {
    return new Promise((resolve, reject)=>{
        getBridge().sendMessage(method,data,function (result: {data:T}) {
            resolve(result.data)
        },method+Math.random())
    })
}

export {
    requestExtension
}