
import SyncStrategy from '../src/database/syncStrategy'
import { ChangeFlag } from '../src/database/typing'
import { MockClient } from './mock/client'

type DataType = {id: string,title: string, updateAt: number}

const localClient = new MockClient<DataType>('local-mock')
const cloudClient = new MockClient<DataType>('cloud-mock')

function createData(): DataType{
    return {
        id: `${Date.now()}_id`,
        updateAt: Date.now(),
        title: 'title: '+ Date.now()
    }
}

const syncStrategy = new SyncStrategy({
    lockResolving: 10 * 1000,
    client:{
        cloud: cloudClient,
        //@ts-ignore
        local: localClient
    }
})
describe('basic method support',()=>{
    it('should add',async ()=>{
        const mockData = createData()
        const result = await localClient.add(mockData.id,mockData);
        expect(result).toBe(mockData)
        const queryResult = await localClient.query(mockData.id);
        expect(queryResult).toBe(mockData)
    })
})

describe('computeDiff', ()=>{
    it('shoud get diff when local create/change/delete/nochange',async ()=>{
        let localDiff
        localClient.reset();
        // create
        const data = createData();
        await localClient.add(data.id,data)
        localDiff = await syncStrategy.computeDiff('local')
        await expect(localDiff.changeMap[data.id]).toBe(ChangeFlag.created)
        await syncStrategy.sync()
        //  update
        await localClient.update(data.id,{
            id: data.id,
            title: 'new',
            updateAt: Date.now(),
        })
        localDiff = await syncStrategy.computeDiff('local')
        await expect(localDiff.changeMap[data.id]).toBe(ChangeFlag.changed)

        // delete
        await syncStrategy.sync()
        await localClient.remove(data.id)
        localDiff = await syncStrategy.computeDiff('local')
        await expect(localDiff.changeMap[data.id]).toBe(ChangeFlag.deleted)

        // nochange
        await syncStrategy.sync()
        const data2 = createData()
        await localClient.add(data2.id,data2)
        localDiff = await syncStrategy.computeDiff('local')
        expect(localDiff.changeMap[data.id]).toBe(undefined)
    })

})
