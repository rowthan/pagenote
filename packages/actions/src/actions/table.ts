import {IAction} from "../typing/IAction";

export interface TableProps {
  method: string
  "db": string,
  "params": any,
  "table": string
}

const tableAction: IAction = {
  id: 'table',
  version: 'v1',
  description: '数据库操作',
  engines: {
    extension: '>=0.28.10',
  },
  run: function (props: TableProps) {
    // const table = context.background.db.getTable(props.db,props.table);
    // return table[props.method](props.params)
    return Promise.resolve(props);
  }
}


export default tableAction
