
import SyncStrategy from '../src/ftp/SyncFile'
import MockClient from './mock/FileClient'

type DataType = {id: string,title: string, updateAt: number}

const localClient = new MockClient()
const cloudClient = new MockClient()

function createData(): DataType{
    return {
        id: `${Date.now()}_id`,
        updateAt: Date.now(),
        title: 'title: '+ Date.now()
    }
}

const syncStrategy = new SyncStrategy({
    cloud: cloudClient,
    local: localClient,
})
describe('file sync',()=>{
    it('should equal',async ()=>{
        const mockData = createData()
        await cloudClient.putFile(mockData.id,mockData);
        const mockData2 = createData();
        const mockData3 = createData();
        await cloudClient.putFile(mockData2.id,mockData);
        await cloudClient.putFile(mockData3.id,mockData);

        await syncStrategy.sync();

        const cloudFiles = await cloudClient.getFiles();
        const localFiles = await localClient.getFiles()
        expect(cloudFiles).toStrictEqual(localFiles)
        expect(localFiles).toStrictEqual(cloudFiles)


        expect(cloudClient.fileTemp).toStrictEqual(localClient.fileTemp)

        const updateDeleted = {updateAt: Date.now(),deleted: true}
        await cloudClient.putFile(mockData2.id,updateDeleted);
        await syncStrategy.sync();

        expect(cloudClient.fileTemp).toStrictEqual(localClient.fileTemp)
        expect(cloudClient.fileTemp[mockData2.id]).toStrictEqual(JSON.stringify(updateDeleted))

        localClient.putFile(mockData2.id,{
            updateAt: 100,
        })

        await syncStrategy.sync();
        expect(cloudClient.fileTemp[mockData2.id]).toStrictEqual(JSON.stringify(updateDeleted))
            

    })
    
})