import {
    BlobReader,
    BlobWriter,
    TextReader,
    TextWriter,
    ZipReader,
    ZipWriter,
} from "@zip.js/zip.js";
export function readFiles(files: FileList):Promise<string[]> {
    // 循环读取文件，并将文件内容读取到result list 中，全部读取完毕后，返回一个 promise，该 promise 成功时，result list 就是所有文件的内容
    return new Promise(async (resolve, reject) => {
        const result: string[] = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            console.log(file)
            if(file.type === 'application/zip'){
               const result = await unzipFile(file);
               return resolve(result)
            }else{
                const reader = new FileReader()
                reader.onload = function () {
                    result.push(this.result as string)
                    if (result.length === files.length) {
                        resolve(result)
                    }
                }
                reader.readAsText(file)
            }
        }
    })
}


export async function unzipFile(zipFileBlob: Blob) {
    const zipFileReader = new BlobReader(zipFileBlob);
    const zipReader = new ZipReader(zipFileReader);
    // will be written in the `writable` property.
    // const helloWorldStream = new TransformStream();
    const entries = await zipReader.getEntries();
    const textList = [];
    if (entries && entries.length) {
        // const filenamesUTF8 = Boolean(!entries.find(entry => !entry.filenameUTF8));
        // const encrypted = Boolean(entries.find(entry => entry.encrypted));
        for (const entry of entries) {
            const helloWorldWriter = new TextWriter();
            console.log(entry.filename)
            if(entry &&  entry.getData && !entry.directory){
                const data = await entry.getData(helloWorldWriter)
                textList.push(data)
            }
        }
    }
    await zipReader.close();

    return textList;
}
