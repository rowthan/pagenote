import FetchAction from '../../src/actions/fetch'
import {IAction} from "../../src/typing/IAction";
import {TableProps} from "../../src/actions/table";
import MockDatabase from "./MockDatabase";
import pickAction from "../../src/actions/pick";
import convert from "../../src/actions/convert";

const database = new MockDatabase();
const MockTableAction: IAction = {
    description: "",
    id: "",
    run(args: TableProps) {
        const { method,params,table } = args
        //@ts-ignore
        return database.getTable(table)[method](params)
    },
    version: ""

}
export function MockRegisterAction(id:string) {
    switch (id){
        case 'pagenote/fetch@v1':
            return Promise.resolve(FetchAction);
        case 'pagenote/table@v1':
            return Promise.resolve(MockTableAction);
        case 'pagenote/pick@v1':
            return Promise.resolve(pickAction);
        case 'pagenote/convert@v1':
            return Promise.resolve(convert);
        default:
            throw Error('un support action:' + id)
    }
}

export function MockEnv(keys: string[]) {
    return Promise.resolve({
        obsidian:{
            token: '9e00b736cc3f573c623ffef1c1900bc0718643ae9bca6d84194ea4c7bf40c95b',
            host: 'http://127.0.0.1:27123'
        },
        keys: keys
    })
}
