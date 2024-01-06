import {AbstractInfo, Snapshot, SyncClient} from '../../src/database/typing'


export class MockClient<Data extends {
    updateAt: number,
    id: string
}> implements SyncClient<Data>{
    private readonly clientId;

    private dataMap: Record<string,Data> = {};


    public cache = {
        cacheMap: {
            'cache': {}
        },
        storageGet(cacheId: string){
            //@ts-ignore
            return Promise.resolve(this.cacheMap[cacheId])
        },
        storageSet (cacheId: string, snapshot: Snapshot | null){
            // @ts-ignore
            this.cacheMap[cacheId] = snapshot as unknown as any;
            return Promise.resolve()
        }
    };

    constructor(clientId: string){
        this.clientId = clientId;
    }

    reset(){
        this.dataMap = {};
        //@ts-ignore
        this.cache.cacheMap = {}
    }

    getSourceId (){
        return Promise.resolve(this.clientId)
    }
    add(id:string,data:Data){
        this.dataMap[id] = data;
        return Promise.resolve(data);
    }
    update (id:string,data:Data){
        this.dataMap[id] = data;
        return Promise.resolve(data);
    }
    remove(id:string){
        delete this.dataMap[id]
        return Promise.resolve(null);
    }
    query(id:string){
        return Promise.resolve(this.dataMap[id])
    }
    getCurrentSnapshot(){
        const snapshot: Record<string,AbstractInfo> = {};
        for(let i in this.dataMap){
            snapshot[i] = {
                id: i,
                updateAt: this.dataMap[i].updateAt
            }
        }
        return Promise.resolve(snapshot)
    }
    getAbstractInfo(data:Data | null){
        if(data){
            return {
                id: data.id,
                updateAt: data.updateAt
            }
        }
        return null
    }
}