
export enum PredefinedSchema {
    markdown='markdown'
}

export const predefinedSchemaMap: Record<PredefinedSchema, string>= {
    markdown: `## [{{title}}]({{{url}}})
{{#steps}}> * {{text}}

{{#tip}}{{{tip}}}

{{/tip}}{{/steps}}
open in [pagenote.cn](https://pagenote.cn/webpage#/{{encodeUrl}})
    `
}