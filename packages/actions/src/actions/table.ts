import {IAction} from "../typing/IAction";

export interface TableActionProps {
  method: string | 'keys' | 'get' | 'put'
  "db": string,
  "params": any,
  "table": string
}

const tableAction: IAction = {
  id: 'pagenote/table',
  version: '1',
  description: '数据库操作',
  engines: {
    extension: '>=0.28.10',
  },
  run: function (props: TableActionProps) {
    // const table = context.background.db.getTable(props.db,props.table);
    // return table[props.method](props.params)
    return Promise.resolve(props);
  }
}


export default tableAction
