
export function readFiles(files: FileList):Promise<string[]> {
    // 循环读取文件，并将文件内容读取到result list 中，全部读取完毕后，返回一个 promise，该 promise 成功时，result list 就是所有文件的内容
    return new Promise((resolve, reject) => {
        const result: string[] = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const reader = new FileReader()
            reader.onload = function () {
                result.push(this.result as string)
                if (result.length === files.length) {
                    resolve(result)
                }
            }
            reader.readAsText(file)
        }
    })
}
