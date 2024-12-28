

export enum Collection {
  webpage = 'webpage',
  light = 'light',
  snapshot = 'snapshot',
  html = 'html',
  note = 'note',
  file = 'file',
  memory = 'memory',
  config = 'config',
}

export const dbTableMap: Record<
  Collection,
  {
    db: string
    table: string
  }
> = {
  [Collection.file]: {db: "temp", table: "file"},
  [Collection.webpage]: {
    db: 'lightpage',
    table: 'webpage',
  },
  [Collection.light]: {
    db: 'lightpage',
    table: 'light',
  },
  [Collection.snapshot]: {
    db: 'lightpage',
    table: 'snapshot',
  },
  [Collection.html]: {
    db: 'resource',
    table: 'html',
  },
  [Collection.note]: {
    db: 'lightpage',
    table: 'note',
  },
  [Collection.memory]: {
    db: 'temp',
    table: 'memory',
  },
  [Collection.config]: {
    db: 'setting',
    table: 'config'
  }
}
