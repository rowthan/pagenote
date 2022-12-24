import {AbstractInfo} from "./syncStrategy";
import LocalFileSystem from './localFileSystem'
import md5 from "md5";

interface TableInfo<T> {
    tableName: string,
    getAbstractInfo: (inputData: T, filePath: string)=> AbstractInfo
}

function parseFileContentAsJSON<T>(input: string):T | undefined {
    let data: T | undefined;
    try{
        data = JSON.parse(input);
    }catch (e) {
        console.error('parse file content error. input:'+input)
    }
    return data;
}
export default class DirDatabaseTable<T> {
    /**文件操作API对象*/
    public localFileSystem: LocalFileSystem;
    /**文件夹系统文件记录的表信息*/
    public tableTempInfo: {
        tableId?: string
    } = {
        tableId: ''
    }
    /**指定表的描述方法：表明、如何提取摘要*/
    private readonly tableDescribe: TableInfo<T>
    constructor(localFileSystem: LocalFileSystem,tableDescribe: TableInfo<T>) {
        this.tableDescribe = tableDescribe;
        this.localFileSystem = localFileSystem;
        this._initTableInfo();
    }

    /**初始化表信息，记录、生成表ID*/
    async _initTableInfo(){
        const {tableName} = this.tableDescribe;
        const TABLE_INFO_FILE_NAME = `/${tableName}/.${tableName}.table.json`
        const hasTableInfoFile = await this.localFileSystem.exists(TABLE_INFO_FILE_NAME);
        if(hasTableInfoFile){
            const infoString = await this.localFileSystem.readFile(TABLE_INFO_FILE_NAME)
            this.tableTempInfo = parseFileContentAsJSON(infoString) || {};
        }

        this.tableTempInfo.tableId = this.tableTempInfo.tableId || md5(`${tableName}${Date.now()}`)
        return this.localFileSystem.writeFile(TABLE_INFO_FILE_NAME,JSON.stringify(this.tableTempInfo)).then( ()=> {
            return this.tableTempInfo
        })
    }

    /**传入一个相对表、相对文件系统的文件路径，返回一个相对文件系统的文件路径*/
    _getFilePath(relativeOrAbsolutePath: string){
        const {tableName} = this.tableDescribe;
        const checkIsAbsolutePath = new RegExp(`${tableName}\/`)
        if(checkIsAbsolutePath.test(relativeOrAbsolutePath)){
            return relativeOrAbsolutePath
        }else{
            return `/${tableName}/${relativeOrAbsolutePath}`
        }
    }

    /**添加文件*/
    add(filePath: string, data: T): Promise<T|undefined>{
        return this.localFileSystem.writeFile(this._getFilePath(filePath),JSON.stringify(data)).then(async function (file) {
            const text = await file.text();
            return parseFileContentAsJSON(text)
        })
    }

    /**查询文件*/
    query(filePath: string,):Promise<T|undefined>{
        return this.localFileSystem.readFile(this._getFilePath(filePath)).then(function (res) {
            return parseFileContentAsJSON<T>(res)
        })
    }

    /**删除文件*/
    remove(filePath: string):Promise<void>{
        return this.localFileSystem.unlink(this._getFilePath(filePath))
    }

    /**更新文件*/
    update(filePath: string, data: T):Promise<T|undefined>{
        return this.add(filePath,data)
    }

    /**获取当前文件的全量摘要信息*/
    async getCurrentSnapshot():Promise<Record<string, AbstractInfo>>{
        const {tableName,getAbstractInfo} = this.tableDescribe;

        /**扫描全量符合要求的文件*/
        const files = await this.localFileSystem.readdir(`/${tableName}`, {
            fileFilter: new RegExp(`\.${tableName}\.json$`),
            excludeFileFilter: /^\./, // 忽略隐藏文件
            deep: false,// 只查找一级文件夹下的文件
        });

        /**摘要缓存**/
        const ABSTRACT_TEMP_FILE = `/${tableName}/.${tableName}.abstract.json`;
        const hasTemp = await this.localFileSystem.exists(ABSTRACT_TEMP_FILE);
        let filePathBasedTempAbstract: Record<string, AbstractInfo> = {}
        if(hasTemp){
            const temp = await this.localFileSystem.readFile(ABSTRACT_TEMP_FILE);
            filePathBasedTempAbstract = parseFileContentAsJSON(temp) || {}
        }

        /**
         * 分批次提取文件摘要信息；一次性全量扫描可能导致卡顿；通过步长控制批量执行数量。
         * */
        const snapshot: Record<string, AbstractInfo> = {}
        const STEP_NUM = 500;
        for (let i = 0; i < files.length;) {
            const tasks = []
            for(let j=i; j < i+STEP_NUM; j++){
                const tempFile = files[j];
                if(!tempFile){
                    continue
                }
                tasks.push((async  ()=> {
                    const stat = await this.localFileSystem.stats(tempFile);
                    const cacheSnapshot = filePathBasedTempAbstract[tempFile];
                    /**验证缓存的快照信息可信*/
                    const useTempSnapshot =
                        cacheSnapshot &&
                        stat?.mtimeMs && stat?.mtimeMs === cacheSnapshot?.mtimeMs && // 与上次缓存相比，文件未修改过
                        cacheSnapshot.id && cacheSnapshot.updateAt && // 有必要的摘要信息
                        cacheSnapshot.c_id === tempFile; // 摘要信息的指定文件与当前文件一致，保证数据指定对象正确
                    if(useTempSnapshot){
                        snapshot[cacheSnapshot.id] = cacheSnapshot;
                        return Promise.resolve()
                    }else{
                        /**无可用的缓存摘要信息时，需要读取文件，并提取摘要*/
                        return this.localFileSystem.readFile(tempFile).then(function (content) {
                            const json = parseFileContentAsJSON<T>(content);
                            if (!json) {
                                return
                            }
                            const abstract = getAbstractInfo(json,tempFile);
                            if (!abstract.id) {
                                console.error(json,tempFile)
                                throw Error(`${i} 文件异常，读取失败`)
                            }
                            snapshot[abstract.id] = abstract;
                        })
                    }
                })())
            }

            await Promise.all(tasks);

            i += STEP_NUM;
        }

        /**记录以文件名为索引的快照
         * 摘要信息提取完毕后，存储至文件系统缓存中，供下次使用，提效
         * */
        const fileBasedSnapshot: Record<string, AbstractInfo> = {}
        for(let i in snapshot){
            fileBasedSnapshot[snapshot[i]?.c_id||''] = snapshot[i]
        }
        await this.localFileSystem.writeFile(ABSTRACT_TEMP_FILE,JSON.stringify(fileBasedSnapshot),false)

        return snapshot
    }
}
