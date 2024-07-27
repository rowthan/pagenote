import JSZip from 'jszip';
import {BackupData} from "@pagenote/shared/lib/@types/data";
//@ts-ignore
import piexifjs from 'piexifjs';

type FileParse = {
    text: string,
    type: string,
    properties?: Object
}

function checkIsImage(type: string) {
    return type.startsWith('image') || ['jpeg','jpg','png'].includes(type)
}

/**
 * 将图片文件解析为 base64 字符
 * */
function readFileAsBase64(file: File):Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function () {
            resolve(this.result as string)
        }
        reader.readAsDataURL(file)
    })
}

/**
 * 解析文件为字符串
 * */
function readFileAsString(file: File):Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = function () {
            resolve(this.result as string)
        }
        reader.readAsText(file)
    })
}

/**
 * 解析多个文件，支持zip、文本、字符等各类
 * */
export function readFiles(files: FileList):Promise<FileParse[]> {
    // 循环读取文件，并将文件内容读取到result list 中，全部读取完毕后，返回一个 promise，该 promise 成功时，result list 就是所有文件的内容
    return new Promise(async (resolve, reject) => {
        const result: FileParse[] = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const fileType = file.type;
            if(checkIsImage(fileType)){
                const base64Image = await readFileAsBase64(file)
                result.push({
                    text: base64Image,
                    type: fileType,
                })
            }else if(fileType.includes('zip')){
                console.log('解压文件 开始')
                const zipFileList = await unzipFile(file);
                result.push(...zipFileList);
            } else{
                const fileText = await readFileAsString(file)
                result.push({
                    text: fileText,
                    type: fileType,
                })
            }
        }
        console.log(result.length,'文件数量')
        resolve(result)
    })
}

/**
 * 解压zip文件
 * */
async function unzipFile(zipFileBlob: Blob):Promise<FileParse[]> {
    const textList:FileParse[] = [];

    const jsZip = new JSZip();
    const zip = await jsZip.loadAsync(zipFileBlob);
    for(let i in zip.files){
        const file = zip.files[i];
        if(!file.dir){
            const type = i.split('.').pop() || 'text';
            // console.log(file.comment,'zip comment')
            if(checkIsImage(type)){
                const base64Image = 'data:image/jpeg;base64,'+ await file.async('base64')
                textList.push({
                    type: type,
                    text: base64Image,
                })
            }else{
                const string = await file.async('string');
                textList.push({
                    text: string,
                    type: type,
                })
            }

        }
    }
    return textList;
}


function resolveImage(base64:string){
    let properties = {};
    try{
        // 从图片信息中提取附加属性
        const extr = piexifjs.load(base64);
        properties = JSON.parse(extr.Exif[37500])
    }catch (e) {

    }
    const data = {
        items: [
            {
                db: 'lightpage',
                table: 'snapshot',
                list: [{
                    url: base64,
                    ...(properties || {}),
                }]
            }
        ]
    }
    return data;
}

export const resolveImportString = function (inputStr: string, type: string):BackupData | undefined {
    let data: BackupData | undefined;
    try{
        data = JSON.parse(inputStr);
        return data
    }catch (e) {
        console.warn('初次尝试解析文件异常',inputStr)
    }

    /**
     * 非 json 文件的二次解析。
     * */
    // 单个 html 文件解析
    if(type && type.indexOf('html')>-1){
        data = {
            items: [
                {
                    db: 'resource',
                    table: 'html',
                    list: [{
                        data: inputStr,
                        relatedPageUrl: '',// 这里设置为空，导入后，由插件解析出html内的数据，然后重置该字段
                    }]
                }
            ]
        }
        return data;
    } else if(checkIsImage(type)){
        return resolveImage(inputStr);
    }

    try{
        data = JSON.parse(decodeURIComponent(inputStr));
    }catch (e) {
        console.error(type,e,inputStr);
        throw '数据可能已经损坏或不兼容，请联系开发者处理'
    }
    return data;
}
