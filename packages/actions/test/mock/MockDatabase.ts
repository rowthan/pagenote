

class Table {
    private dataMap: Record<string, any> = {}
    constructor() {
    }
    get(id: string) {
        return Promise.resolve(this.dataMap[id])
    }
    put(value:any) {
        this.dataMap[value.id] = value;
        return Promise.resolve()
    }

    delete(id: string) {
        delete this.dataMap[id]
        return Promise.resolve()
    }

    keys(){
        return Object.keys(this.dataMap)
    }
}


class Database {
    private tables: Record<string, Table> = {}

    getTable(name: string) {
        if (this.tables[name]) {
            return this.tables[name]
        } else {
            const table = new Table()
            this.tables[name] = table
            return table
        }
    }
}

export default Database
