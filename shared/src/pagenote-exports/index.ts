
export enum METHOD_NUM {
    copy='COPY',
    download= 'DOWNLOAD',
}

export enum SchemaType {
    markdown='markdown',
}

export type ExportMethod = {
    name: string,
    schemaType: SchemaType,
    api?: string,
    schema: string,
    method: string,
}