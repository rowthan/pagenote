import JSZip from 'jszip';
import {BackupData} from "@pagenote/shared/lib/@types/data";

type FileParse = {
    text: string,
    type: string
}

export function readFiles(files: FileList):Promise<FileParse[]> {
    // 循环读取文件，并将文件内容读取到result list 中，全部读取完毕后，返回一个 promise，该 promise 成功时，result list 就是所有文件的内容
    return new Promise(async (resolve, reject) => {
        const result: FileParse[] = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            if(file.type === 'application/zip'){
               const result = await unzipFile(file);
               return resolve(result)
            }else{
                const reader = new FileReader()
                reader.onload = function () {
                    console.log(this)
                    result.push({
                        text: this.result as string,
                        type: file.type,
                    })
                    if (result.length === files.length) {
                        resolve(result)
                    }
                }
                reader.readAsText(file)
            }
        }
    })
}


export async function unzipFile(zipFileBlob: Blob):Promise<FileParse[]> {
    const textList:FileParse[] = [];

    const jsZip = new JSZip();
    const zip = await jsZip.loadAsync(zipFileBlob);
    for(let i in zip.files){
        const file = zip.files[i];
        if(!file.dir){
            const string = await file.async('string');
            const type = i.split('.').pop() || 'text';
            textList.push({
                text: string,
                type: type,
            })
        }
    }
    return textList;
}


export const resolveImportString = function (inputStr: string, type: string):BackupData | undefined {
    let data: BackupData | undefined;
    try{
        data = JSON.parse(inputStr);
        return data
    }catch (e) {
        console.warn('低版本数据，二次解码处理中。不推荐使用，请使用最新版本导出数据')
    }

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
    }

    try{
        data = JSON.parse(decodeURIComponent(inputStr));
    }catch (e) {
        console.error(type,e,inputStr);
        throw '数据可能已经损坏或不兼容，请联系开发者处理'
    }
    return data;
}
