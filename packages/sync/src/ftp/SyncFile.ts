
interface ContentWithCompareKey{
    updateAt: number
}

export interface FileClient<T extends ContentWithCompareKey> {
    getFiles: ()=>Promise<string[]>
    getFile: (filePath: string)=> Promise<T | null>
    putFile:  (filePath: string,content: T | null)=>Promise<boolean>
}

enum State {
    unset = 'unset',
    sync = 'syncing',
    faild = 'faild',
    success = 'success'
}

/**
 * 文件系统式的同步。复杂度 O(n), 取决于文件的数量
 * 优点： 短平快，没有复杂的策略和缓存机制，适用于任何场景。对使用者、客户端要求最低。
 * 缺点：这不是一种高效的同步方法
 * 1. 每次都需要遍历全集，性能较差、带宽消耗较大；适用不依赖带宽、数量较少的场景、的本地同步场景。
 * 2. 同步结果为两端的 merge 全集，无法处理文件被删除的情况。对于此类场景，只能标记删除、而不能真正的文件删除。
 * 3. 不支持事务，无法提前收集到两端的差异，只能边收集边同步边执行
 * 
 * 适用场景：配置、账号信息等可枚举数量、文件内容较少的同步
 * */ 
export default class SyncFile<T extends ContentWithCompareKey>{
    private localClient: FileClient<T>
    private cloudClient: FileClient<T>
    public status: State
    constructor(option:{local: FileClient<T>, cloud: FileClient<T>}){
        this.cloudClient = option.cloud;
        this.localClient = option.local;
        this.status = State.unset;
    }

    async _syncFile(file: string,localContent:T | null,cloudContent:T | null){
        console.log('sync ', file, localContent, cloudContent)
        // todo 改为 pkData
        if(localContent && localContent?.updateAt > (cloudContent?.updateAt || 0)){
            await this.cloudClient.putFile(file,localContent)
            console.log('pick local',file, localContent)
        }else{
            await this.localClient.putFile(file, cloudContent)
            console.log('pick cloud',file, cloudContent)
        }
    }

    async sync(){
        this.status = State.sync;
        /**拉取远端的文件列表*/ 
        const cloudFileList = await this.cloudClient.getFiles();
        const localFileList = await this.localClient.getFiles();

        /**全量文件集合**/ 
        const allFiles = new Set<string>([...cloudFileList,...localFileList])

        /**全量数据比对*/ 
        for (const file of allFiles.values()) {
            try{
                const [cloudContent,localContent] = await Promise.all([
                    this.cloudClient.getFile(file),
                    this.localClient.getFile(file),
                ])
                await this._syncFile(file,localContent,cloudContent)      
            }catch(e){
                console.error(e)
            }
        }

        console.log('sync finished')
        return 
    }
}