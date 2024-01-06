import {FileClient} from '../../src/ftp/SyncFile'

export default class MockFileClient<T extends {updateAt: number}> implements FileClient<T>{
    public fileTemp: Record<string, string | null> = {};

    constructor(){
        
    }
    getFiles(){
        return Promise.resolve(Object.keys(this.fileTemp))
    }
    getFile(file: string){
        const content = this.fileTemp[file]
        return Promise.resolve(content ? JSON.parse(content): null)
    }
    putFile(file: string, fileContent: T | null){
        this.fileTemp[file] = fileContent ? JSON.stringify(fileContent) : null;
        return Promise.resolve(true);
    }

}