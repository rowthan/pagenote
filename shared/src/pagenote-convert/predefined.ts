
export enum PredefinedSchema {
    markdown='markdown'
}

export const predefinedSchemaMap: Record<PredefinedSchema, string>= {
    markdown: `## [{{title}}]({{{url}}})
{{#plainData.steps}}> * {{text}}

{{#tip}}{{{tip}}}

{{/tip}}{{/plainData.steps}}
    `
}
// open in [pagenote.cn](https://pagenote.cn/webpage#/{{encodeUrl}})
