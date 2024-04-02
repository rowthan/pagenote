export interface TableActionProps {
  method: string | 'keys' | 'get' | 'put'
  "db": string,
  "params": any,
  "table": string
}

function run(props: TableActionProps) {
  // const table = context.background.db.getTable(props.db,props.table);
  // return table[props.method](props.params)
  return Promise.resolve(props);
}


export default run
